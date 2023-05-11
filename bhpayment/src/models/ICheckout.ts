export interface IPaymentMethod {
  paymentName: string;
  displayName: string;
  currency: string;
  paymentMethod?: string;
  icon?: string;
}

export interface IBillingDetails {
  email: string;
  name: string;
}

export interface IAddress {
  city: string | null;
  country: string | null;
  line1: string | null;
  line2: string | null;
  postal_code: string | null;
  state: string | null;
}

export interface IDropdownMethodGroup {
  name: string;
  displayName: string;
  paymentMethods: string[];
}
