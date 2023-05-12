import express, { Express } from "express";
import cors from "cors";
import { productRoute } from "./routes/productRoute";
import { paymentRoute } from "./routes/paymentRoute";
import { userRoute } from "./routes/userRoute";

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
