export interface IProduct {
  id: string;
  priceId: string;
  paymentSuccessBehaviour?: () => void;
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
  };
}
