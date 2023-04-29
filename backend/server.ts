import express, { Express, Request, Response } from "express";
import cors from "cors";

const stripe = require("stripe")(
  "sk_test_51MnKfQHKeMBcSTk8kHbdB8luw8P7WBLFKbIYo5qy2sYT8kVbwGSXwDKVWBb7U4SoYAPp304TGsUHwGsbtH0dhVoh001EUjKJwR"
);

const app: Express = express();

app.use(express.static("public"));
app.use(express.json());
app.use(cors());

const PORT = 5000;

interface IRequestBodyCreatePaymentIntent {
  currency: string;
  productId: string;
  paymentMethod: string;
}

app.post("/create-payment-intent", async (req, res) => {
  try {
    let {
      currency,
      productId,
      paymentMethod,
    }: IRequestBodyCreatePaymentIntent = req.body;

    console.log("req.body: ", req.body);

    const customer = await stripe.customers.create({
      description: "test customer",
    });
    console.log("customer: ", customer);

    const invoiceItem = await stripe.invoiceItems.create({
      customer: customer.id,
      price: productId,
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

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    res.status(404).send({ error: err });
  }
});

// app.put("/update-payment-intent", async (req, res) => {
//   const { currency, sum, paymentMethod } = req.body;

//   console.log("paymentIntent: ", paymentIntent);

//   const options = {
//     amount: sum,
//     currency: currency,
//   };
//   if (paymentMethod) {
//     options.payment_method_types = [paymentMethod];
//   }

//   paymentIntent = await stripe.paymentIntents.update(options);
//   res.send({
//     clientSecret: paymentIntent.client_secret,
//   });
// });

app.listen(PORT, () => console.log("Node server listening on port ", PORT));
