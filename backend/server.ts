import express, { Express, Request, Response } from "express";
import cors from "cors";
import { productRoute } from "./routes/productRoute";
import { paymentRoute } from "./routes/paymentRoute";
import { userRoute } from "./routes/userRoute";

const stripe = require("stripe")(
  "sk_test_51MnKfQHKeMBcSTk8kHbdB8luw8P7WBLFKbIYo5qy2sYT8kVbwGSXwDKVWBb7U4SoYAPp304TGsUHwGsbtH0dhVoh001EUjKJwR"
);

const app: Express = express();
const routes = express.Router();

app.use(express.static("public"));
app.use(express.json());
app.use(cors());

const PORT = 5000;

routes.use(productRoute);
routes.use(paymentRoute);
routes.use(userRoute);

app.use("/", routes);

app.listen(PORT, () => console.log("Node server listening on port ", PORT));
