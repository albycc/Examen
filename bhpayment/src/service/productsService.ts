import axios from "axios";
import config from "../config.json";

/*
service file for retrieving a Stripe product

getProduct - retrieves an object with Stripe price and product object
*/
export const productService = {
  getProduct: async (productId: string) => {
    let res = await axios.get(
      config.SERVER_URL_API + `getProduct/${productId}`
    );

    return res.data;
  },
};
