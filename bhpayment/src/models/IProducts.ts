import { IMemberSuccess } from "./IService";

export interface IProduct {
  id: string;
  priceId_sec: string;
  priceId_eur: string;
  type: string;
  paymentSuccessBehaviour?: (
    email: string,
    type: string
  ) => Promise<IMemberSuccess>;
  paymentSuccessUrl?: string;
}

export interface IProductDetails {
  product: {
    id: string;
    name: string;
    default_price: string;
    description: string;
  };
  price: {
    id: string;
    currency: string;
    product: string;
    unit_amount: number;
    type: string;
  };
}
