const express = require("express");
const cors = require("cors");

const stripe = require("stripe")(
  "sk_test_51MnKfQHKeMBcSTk8kHbdB8luw8P7WBLFKbIYo5qy2sYT8kVbwGSXwDKVWBb7U4SoYAPp304TGsUHwGsbtH0dhVoh001EUjKJwR"
);

const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(cors());

const PORT = 5000;

app.post("/create-payment-intent", async (req, res) => {
  const { productName, sum } = req.body;
  console.log("req.body: ", req.body);
  console.log("productName: ", productName);
  console.log("sum: ", sum);

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: sum,
    currency: "sek",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

app.listen(PORT, () => console.log("Node server listening on port ", PORT));
