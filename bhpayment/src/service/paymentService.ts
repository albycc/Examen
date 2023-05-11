import axios from "axios";
import config from "../config.json";

/*
service file for making paymentIntents. Used by Checkout for the payment methods.

createPaymentIntent - creates a payment in server. Returns a clientSecret
updatePaymentIntent - updates the payment, either for changing payment method, or currency
*/
export const paymentService = {
  createPaymentIntent: async (payload: any) => {
    return await axios.post(
      config.SERVER_URL_API + `create-payment-intent`,
      payload
    );
  },
  updatePaymentIntent: async (payload: any) => {
    return await axios.put(
      config.SERVER_URL_API + `update-payment-intent`,
      payload
    );
  },
};
