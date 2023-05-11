import { IDropdownMethodGroup, IPaymentMethod } from "../models/ICheckout";
import creditIcon from "../pages/Checkout/images/credit.png";
import sepaIcon from "../pages/Checkout/images/SEPA.png";
import payIcon from "../pages/Checkout/images/pay.png";

//array list of different payment methods
export const paymentMethodsList: IPaymentMethod[] = [
  {
    paymentName: "card",
    displayName: "Kort",
    paymentMethod: "card",
    currency: "sek",
    icon: creditIcon,
  },
  {
    paymentName: "sepa",
    displayName: "SEPA",
    paymentMethod: "sepa_debit",
    currency: "eur",
    icon: sepaIcon,
  },
  {
    paymentName: "pay",
    displayName: "Google Apple Link Pay",
    paymentMethod: "card",
    currency: "sek",
    icon: payIcon,
  },
];

export const dropdownMethodGroupList: IDropdownMethodGroup[] = [
  {
    name: "europe",
    displayName: "Europa",
    paymentMethods: ["card", "sepa", "pay"],
  },
  {
    name: "world",
    displayName: "Världen",
    paymentMethods: ["card", "pay"],
  },
];
