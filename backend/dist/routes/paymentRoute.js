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
let paymentIntentId;
exports.paymentRoute.post("/create-payment-intent", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { currency, priceId, paymentMethod } = req.body;
        console.log("req.body: ", req.body);
        const customer = yield stripeVars_1.default.customers.create({
            description: "test customer",
        });
        console.log("customer: ", customer);
        const invoiceItem = yield stripeVars_1.default.invoiceItems.create({
            customer: customer.id,
            price: priceId,
        });
        console.log("invoiceItem: ", invoiceItem);
        let { amount } = invoiceItem;
        if (currency === "eur") {
            let euro = (amount / 100) * 0.087952246;
            amount = (Math.round(euro * 100) / 100) * 100;
        }
        const paymentIntent = yield stripeVars_1.default.paymentIntents.create({
            amount: amount,
            currency: currency,
            payment_method_types: [paymentMethod],
        });
        console.log("paymentIntent: ", paymentIntent);
        paymentIntentId = paymentIntent.id;
        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    }
    catch (err) {
        res.status(404).send({ error: err });
    }
}));
exports.paymentRoute.put("/update-payment-intent", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const paymentIntent = yield stripeVars_1.default.paymentIntents.update(paymentIntentId, options);
        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    }
    catch (err) {
        res.send(err);
    }
}));
