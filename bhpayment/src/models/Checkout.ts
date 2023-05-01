export interface IPaymentMethod {
  paymentName: string;
  currency: string;
  paymentMethod?: string;
}

export interface IBillingDetails {
  email: string | null;
  name: string | null;
  phone: string | null;
}

export interface IAddress {
  city: string | null;
  country: string | null;
  line1: string | null;
  line2: string | null;
  postal_code: string | null;
  state: string | null;
}
