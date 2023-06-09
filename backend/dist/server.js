"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const productRoute_1 = require("./routes/productRoute");
const paymentRoute_1 = require("./routes/paymentRoute");
const userRoute_1 = require("./routes/userRoute");
const app = (0, express_1.default)();
const routes = express_1.default.Router();
app.use(express_1.default.static("public"));
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const PORT = 5000;
routes.use(productRoute_1.productRoute);
routes.use(paymentRoute_1.paymentRoute);
routes.use(userRoute_1.userRoute);
app.use("/", routes);
app.listen(PORT, () => console.log("Node server listening on port ", PORT));
