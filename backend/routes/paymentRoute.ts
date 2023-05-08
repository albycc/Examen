import Express, { Request, Response } from "express";
import stripe from "../stripe/stripeVars";

export const paymentRoute = Express.Router();
let paymentIntentId: string;

interface IRequestBodyCreatePaymentIntent {
  currency: string;
  priceId: string;
  paymentMethod: string;
}

paymentRoute.post("/create-payment-intent", async (req, res) => {
  try {
    let { currency, priceId, paymentMethod }: IRequestBodyCreatePaymentIntent =
      req.body;

    console.log("req.body: ", req.body);

    const customer = await stripe.customers.create({
      description: "test customer",
    });
    console.log("customer: ", customer);

    const invoiceItem = await stripe.invoiceItems.create({
      customer: customer.id,
      price: priceId,
    });
    console.log("invoiceItem: ", invoiceItem);

    let { amount } = invoiceItem;

    if (currency === "eur") {
      let euro = (amount / 100) * 0.087952246;
      amount = (Math.round(euro * 100) / 100) * 100;
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
      payment_method_types: [paymentMethod],
    });

    console.log("paymentIntent: ", paymentIntent);

    paymentIntentId = paymentIntent.id;

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    res.status(404).send({ error: err });
  }
});

paymentRoute.put("/update-payment-intent", async (req, res) => {
  try {
    const { currency, sum, paymentMethod } = req.body;

    let amount = sum;

    if (currency === "eur") {
      let euro = (amount / 100) * 0.087952246;
      amount = (Math.round(euro * 100) / 100) * 100;
    }

    const options = {
      amount: amount,
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
});