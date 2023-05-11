import Express, { Request, Response } from "express";
import stripe from "../stripe/stripeVars";

export const productRoute = Express.Router();

productRoute.get("/api/getProduct/:id", async (req: Request, res: Response) => {
  try {
    let { id } = req.params;

    console.log("id: ", id);

    const product = await stripe.products.retrieve(id);

    console.log("product: ", product);

    const price = await stripe.prices.retrieve(product.default_price);

    res.send({ product, price });
  } catch (err) {
    res.send({ err: err });
  }
});
