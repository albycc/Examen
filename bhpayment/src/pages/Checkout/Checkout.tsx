import react, { useState, useEffect } from "react"
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import config from "../../config.json"
import CheckoutForm from "./CheckoutForm";
import Button from "react-bootstrap/Button"
import Dropdown from "react-bootstrap/Dropdown"
import DropdownButton from "react-bootstrap/DropdownButton"
import { IPaymentMethod } from "../../models/Checkout";

const stripePromise = loadStripe(config.STRIPE_PUBLIC_API_KEY)

const paymentMethodsList: IPaymentMethod[] = [
    {
        paymentMethod: "card",
        currency: "sek"
    },
    {
        paymentMethod: "sepa_debit",
        currency: "eur"
    },

]


export default function Checkout() {
    const [clientSecret, setClientSecret] = useState("")
    const [paymentMethod, setPaymentMethod] = useState<IPaymentMethod>()

    useEffect(() => {
        // Skapa PaymentIntent object 
        // summa anges som cents, så 100 cents blir 1$, vilket är 0.1 kr.
        console.log("useEffect paymentMethod")
        if (paymentMethod) {
            fetch(config.SERVER_URL + "payment-intent-secret", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currency: paymentMethod.currency, sum: 12000, paymentMethod: paymentMethod.paymentMethod })
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log("clientSecret: ", data.clientSecret)
                    setClientSecret(data.clientSecret)
                }).catch(err => console.error(err))
        }
    }, [paymentMethod]);

    const methodPaymentButtonHandler = (e: any) => {
        const value = paymentMethodsList.find(method => method.paymentMethod === e.target.value)
        console.log("methodPaymentButtonHandler ", value)
        setPaymentMethod(value)
    }


    const options: StripeElementsOptions = {
        clientSecret,
        appearance: { theme: 'stripe' },
    };

    return (
        <div>
            <h1>
                Checkout
            </h1>
            <DropdownButton
                id="dropdown-button-dark-example2"
                variant="secondary"
                menuVariant="dark"
                title="Dropdown button"
                className="mt-2"
            >
                <Dropdown.Item>Europa</Dropdown.Item>
                <Dropdown.Item>Resten av världen</Dropdown.Item>

            </DropdownButton>
            <Button onClick={methodPaymentButtonHandler} value="card">Kort</Button>
            <Button onClick={methodPaymentButtonHandler} value="sepa_debit">SEPA</Button>
            {clientSecret !== "" && (
                <Elements options={options} stripe={stripePromise}>
                    <CheckoutForm paymentMethod={paymentMethod} />

                </Elements>
            )}
        </div>
    )
}