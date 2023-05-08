import axios from "axios";
import config from "../config.json";

export const productService = {
  getProduct: async (productId: string) => {
    let res = await axios.get(config.SERVER_URL + `getProduct/${productId}`);

    return res.data;
  },
};
