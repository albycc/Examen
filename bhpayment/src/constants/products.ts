import { IProduct } from "../models/IProducts";
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
    priceId_sec: "price_1Mytk6HKeMBcSTk8eYnieGRt",
    priceId_eur: "price_1N6YM0HKeMBcSTk8YQyhfZkt",
    type: "member",
    paymentSuccessBehaviour: registerMembership,
    paymentSuccessUrl: "/user",
  },
  {
    id: "prod_NkORXbXjM5qfZY",
    priceId_sec: "price_1MyteNHKeMBcSTk8OG6MZGyc",
    priceId_eur: "price_1N6YAyHKeMBcSTk8qlcXTfPU",
    type: "subscription",
    paymentSuccessBehaviour: registerMembership,
    paymentSuccessUrl: "/user",
  },
  {
    id: "prod_NkOjLDScNCUrhc",
    priceId_sec: "price_1MytwAHKeMBcSTk85HfS57j3",
    priceId_eur: "price_1N6YOcHKeMBcSTk8jRGdH8id",
    type: "donation",
    paymentSuccessUrl: "/donationsuccess",
  },
  {
    id: "prod_NkOkpsrw3f55D9",
    priceId_sec: "price_1MytxFHKeMBcSTk8IfL5Q8AX",
    priceId_eur: "price_1N6YPKHKeMBcSTk8CfFkVFMs",
    type: "donation",
    paymentSuccessUrl: "/donationsuccess",
  },
  {
    id: "prod_NkOln0UBGssg8O",
    priceId_sec: "price_1MytyLHKeMBcSTk8BQYji5nd",
    priceId_eur: "price_1N6YQ3HKeMBcSTk8JDlVaJ6x",
    type: "donation",
    paymentSuccessUrl: "/donationsuccess",
  },
  {
    id: "prod_NkOoWc2taGJtTt",
    priceId_sec: "price_1Myu0XHKeMBcSTk8MaczS36l",
    priceId_eur: "price_1N6YR8HKeMBcSTk8MIhUpmr0",
    type: "donation",
    paymentSuccessUrl: "/donationsuccess",
  },
  {
    id: "prod_NkOoRFx4KG9ajD",
    priceId_sec: "price_1Myu1HHKeMBcSTk8sAo6LICI",
    priceId_eur: "price_1N6YRvHKeMBcSTk84TpWWkaW",
    type: "donation",
    paymentSuccessUrl: "/donationsuccess",
  },
  {
    id: "prod_NkOphueWrN78oD",
    priceId_sec: "price_1Myu1mHKeMBcSTk8KSMZdNyh",
    priceId_eur: "price_1N6YTBHKeMBcSTk8XjGIwufb",
    type: "donation",
    paymentSuccessUrl: "/donationsuccess",
  },
  {
    id: "prod_NkOpy4vUk12WCE",
    priceId_sec: "price_1Myu28HKeMBcSTk8Z52EMNtS",
    priceId_eur: "price_1N6YTfHKeMBcSTk8kXBXmFU4",
    type: "donation",
    paymentSuccessUrl: "/donationsuccess",
  },
];
