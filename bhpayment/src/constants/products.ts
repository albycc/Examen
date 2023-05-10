import { IProduct } from "../models/IProducts";
import { useNavigate } from "react-router-dom";
import { userService } from "../service/userService";
import { IMemberSuccess } from "../models/IService";

const registerMembership = async (
  id: string,
  type: string
): Promise<IMemberSuccess> => {
  const postMember: IMemberSuccess = await userService.registerMember(id, type);

  return postMember;
};

export const products: IProduct[] = [
  {
    id: "prod_NkOXRJg4gPZFwl",
    priceId: "price_1Mytk6HKeMBcSTk8eYnieGRt",
    type: "member",
    paymentSuccessBehaviour: registerMembership,
    paymentSuccessUrl: "/user",
  },
  {
    id: "prod_NkORXbXjM5qfZY",
    priceId: "price_1MyteNHKeMBcSTk8OG6MZGyc",
    type: "subscription",
    paymentSuccessBehaviour: registerMembership,
    paymentSuccessUrl: "/user",
  },
  {
    id: "prod_NkOjLDScNCUrhc",
    priceId: "price_1MytwAHKeMBcSTk85HfS57j3",
    type: "donation",
    paymentSuccessUrl: "/donationsuccess",
  },
  {
    id: "prod_NkOkpsrw3f55D9",
    priceId: "price_1MytxFHKeMBcSTk8IfL5Q8AX",
    type: "donation",
    paymentSuccessUrl: "/donationsuccess",
  },
  {
    id: "prod_NkOln0UBGssg8O",
    priceId: "price_1MytyLHKeMBcSTk8BQYji5nd",
    type: "donation",
    paymentSuccessUrl: "/donationsuccess",
  },
  {
    id: "prod_NkOoWc2taGJtTt",
    priceId: "price_1Myu0XHKeMBcSTk8MaczS36l",
    type: "donation",
    paymentSuccessUrl: "/donationsuccess",
  },
  {
    id: "prod_NkOoRFx4KG9ajD",
    priceId: "price_1Myu1HHKeMBcSTk8sAo6LICI",
    type: "donation",
    paymentSuccessUrl: "/donationsuccess",
  },
  {
    id: "prod_NkOphueWrN78oD",
    priceId: "price_1Myu1mHKeMBcSTk8KSMZdNyh",
    type: "donation",
    paymentSuccessUrl: "/donationsuccess",
  },
  {
    id: "prod_NkOpy4vUk12WCE",
    priceId: "price_1Myu28HKeMBcSTk8Z52EMNtS",
    type: "donation",
    paymentSuccessUrl: "/donationsuccess",
  },
];
