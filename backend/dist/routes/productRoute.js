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
exports.productRoute = void 0;
const express_1 = __importDefault(require("express"));
const stripeVars_1 = __importDefault(require("../stripe/stripeVars"));
exports.productRoute = express_1.default.Router();
exports.productRoute.get("/getProduct/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { id } = req.params;
        console.log("id: ", id);
        const product = yield stripeVars_1.default.products.retrieve(id);
        console.log("product: ", product);
        const price = yield stripeVars_1.default.prices.retrieve(product.default_price);
        res.send({ product, price });
    }
    catch (err) {
        res.send({ err: err });
    }
}));
