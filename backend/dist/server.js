"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const stripe = require("stripe")("sk_test_51MnKfQHKeMBcSTk8kHbdB8luw8P7WBLFKbIYo5qy2sYT8kVbwGSXwDKVWBb7U4SoYAPp304TGsUHwGsbtH0dhVoh001EUjKJwR");
const app = (0, express_1.default)();
app.use(express_1.default.static("public"));
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const PORT = 5000;
app.post("/create-payment-intent", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { currency, productId, paymentMethod, } = req.body;
        console.log("req.body: ", req.body);
        const customer = yield stripe.customers.create({
            description: "test customer",
        });
        console.log("customer: ", customer);
        const invoiceItem = yield stripe.invoiceItems.create({
            customer: customer.id,
            price: productId,
        });
        console.log("invoiceItem: ", invoiceItem);
        let { amount } = invoiceItem;
        if (currency === "eur") {
            let euro = (amount / 100) * 0.087952246;
            amount = (Math.round(euro * 100) / 100) * 100;
        }
        const paymentIntent = yield stripe.paymentIntents.create({
            amount: amount,
            currency: currency,
            payment_method_types: [paymentMethod],
        });
        console.log("paymentIntent: ", paymentIntent);
        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    }
    catch (err) {
        res.status(404).send({ error: err });
    }
}));
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
