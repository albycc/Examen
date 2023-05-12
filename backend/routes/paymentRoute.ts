import Express, { Request, Response } from "express";
import stripe from "../stripe/stripeVars";

export const paymentRoute = Express.Router();

interface IRequestBodyCreatePaymentIntent {
  currency: string;
  priceId: string;
  paymentMethod: string;
  type: string;
  email: string;
  description: string;
}

//end point for creating payment intent
paymentRoute.post(
  "/api/create-payment-intent",
  async (req: Request, res: Response) => {
    try {
      let {
        currency,
        priceId,
        paymentMethod,
        type,
        email,
        description,
      }: IRequestBodyCreatePaymentIntent = req.body;

      const customer = await stripe.customers.create({
        description: "BH customer",
        email,
      });

      //is is a recurring price the customer pays each year? Subscribe!
      if (type === "recurring") {
        const subscription = await stripe.subscriptions.create({
          customer: customer.id,
          items: [{ price: priceId }],
          payment_behavior: "default_incomplete",
          expand: ["latest_invoice.payment_intent"],
          description,
          payment_settings: {
            payment_method_types: [paymentMethod],
          },
        });

        res.send({
          clientSecret:
            subscription.latest_invoice.payment_intent.client_secret,
          paymentIntentId: subscription.latest_invoice.payment_intent.id,
        });
      } else {
        // its a single payment

        // invoiceItems used for getting amount
        const invoiceItem = await stripe.invoiceItems.create({
          customer: customer.id,
          price: priceId,
        });

        // amount is specified in cents, so 100 cents is 1$ which is 0.1kr.
        // If you want to pay a product for 120 kr, amount must be 12000

        let { amount } = invoiceItem;

        // paymentIntent keeps track of payment. Create one paymentIntent for each order. Here is the clientSecret we want in the client
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amount,
          currency: currency,
          payment_method_types: [paymentMethod],
          description,
        });

        //keep track of this paymentIntent for update

        res.send({
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id,
        });
      }
    } catch (err) {
      console.log(err);
      res.status(404).send({ error: err });
    }
  }
);

// update payment when user chooses a different payment method.
paymentRoute.put(
  "/api/update-payment-intent",
  async (req: Request, res: Response) => {
    try {
      const { paymentIntentId, payload } = req.body;
      const { currency, paymentMethod, priceId } = payload;

      console.log("put req.body:", req.body);

      const price = await stripe.prices.retrieve(priceId);

      // amount is specified in cents, so 100 cents is 1$ which is 0.1kr.
      // If you want to pay a product for 120 kr, amount must be 12000

      let { unit_amount } = price;

      const options = {
        amount: unit_amount,
        currency: currency,
        payment_method_types: [paymentMethod],
      };

      console.log("options: ", options);
      console.log("paymentIntentId: ", paymentIntentId);

      const paymentIntent = await stripe.paymentIntents.update(
        paymentIntentId,
        options
      );
      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (err) {
      res.send(err);
    }
  }
);
