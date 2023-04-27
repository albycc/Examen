import react, { useState, useEffect } from "react"
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import config from "../../config.json"
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe(config.STRIPE_PUBLIC_API_KEY)

type StripeTypes = {
    clientSecret: string;
    appearance: {
        theme: "stripe",

    }
};

export default function Checkout() {
    const [clientSecret, setClientSecret] = useState("")

    useEffect(() => {
        // Create PaymentIntent as soon as the page loads
        fetch(config.SERVER_URL + "create-payment-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productName: "xl-tshirt", sum: 1200 }),
        })
            .then((res) => res.json())
            .then((data) => setClientSecret(data.clientSecret)).catch(err => console.error(err))
    }, []);

    const options: StripeElementsOptions = {
        clientSecret,
        appearance: { theme: 'stripe' },
    };

    console.log("clientSecret: ", clientSecret)

    return (
        <div>
            <h1>
                Checkout
            </h1>
            {clientSecret !== "" && (
                <Elements options={options} stripe={stripePromise}>
                    <CheckoutForm />

                </Elements>
            )}
        </div>
    )
}