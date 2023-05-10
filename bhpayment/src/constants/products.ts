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
];
