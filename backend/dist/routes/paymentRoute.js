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
exports.paymentRoute = void 0;
const express_1 = __importDefault(require("express"));
const stripeVars_1 = __importDefault(require("../stripe/stripeVars"));
exports.paymentRoute = express_1.default.Router();
//end point for creating payment intent
exports.paymentRoute.post("/api/create-payment-intent", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { currency, priceId, paymentMethod, type, email, description, } = req.body;
        const customer = yield stripeVars_1.default.customers.create({
            description: "BH customer",
            email,
        });
        //is is a recurring price the customer pays each year? Subscribe!
        if (type === "recurring") {
            const subscription = yield stripeVars_1.default.subscriptions.create({
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
                clientSecret: subscription.latest_invoice.payment_intent.client_secret,
                paymentIntentId: subscription.latest_invoice.payment_intent.id,
            });
        }
        else {
            // its a single payment
            // invoiceItems used for getting amount
            const invoiceItem = yield stripeVars_1.default.invoiceItems.create({
                customer: customer.id,
                price: priceId,
            });
            // amount is specified in cents, so 100 cents is 1$ which is 0.1kr.
            // If you want to pay a product for 120 kr, amount must be 12000
            let { amount } = invoiceItem;
            // paymentIntent keeps track of payment. Create one paymentIntent for each order. Here is the clientSecret we want in the client
            const paymentIntent = yield stripeVars_1.default.paymentIntents.create({
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
    }
    catch (err) {
        console.log(err);
        res.status(404).send({ error: err });
    }
}));
// update payment when user chooses a different payment method.
exports.paymentRoute.put("/api/update-payment-intent", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { paymentIntentId, payload } = req.body;
        const { currency, paymentMethod, priceId } = payload;
        console.log("put req.body:", req.body);
        const price = yield stripeVars_1.default.prices.retrieve(priceId);
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
        const paymentIntent = yield stripeVars_1.default.paymentIntents.update(paymentIntentId, options);
        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    }
    catch (err) {
        res.send(err);
    }
}));
