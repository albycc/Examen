import react, { useState, useEffect } from "react"
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import config from "../../config.json"
import CardCheckoutForm from "./CardCheckoutForm";
import SepaCheckoutForm from "./SepaCheckoutForm";
import PayCheckoutForm from "./PayCheckoutForm";
import Button from "react-bootstrap/Button"
import Dropdown from "react-bootstrap/Dropdown"
import DropdownButton from "react-bootstrap/DropdownButton"
import { IPaymentMethod } from "../../models/Checkout";
import axios from "axios";

const stripePromise = loadStripe(config.STRIPE_PUBLIC_API_TEST_KEY)

const paymentMethodsList: IPaymentMethod[] = [
    {
        paymentName: "card",
        paymentMethod: "card",
        currency: "sek"
    },
    {
        paymentName: "sepa",
        paymentMethod: "sepa_debit",
        currency: "eur"
    },
    {
        paymentName: "pay",
        paymentMethod: "card",
        currency: "sek"
    }
]


export default function Checkout() {
    const [clientSecret, setClientSecret] = useState("")
    const [paymentMethod, setPaymentMethod] = useState<IPaymentMethod>()
    const [productId, setProductId] = useState<string>("price_1Mytk6HKeMBcSTk8eYnieGRt")

    useEffect(() => {
        // Skapa PaymentIntent object 
        // summa anges som cents, så 100 cents blir 1$, vilket är 0.1 kr.
        console.log("useEffect paymentMethod")
        if (paymentMethod) {
            axios.post(config.SERVER_URL + "create-payment-intent",
                { currency: paymentMethod.currency, productId, paymentMethod: paymentMethod.paymentMethod }
            )
                .then((data) => {
                    console.log("clientSecret: ", data)
                    if (data.data.clientSecret) {

                        setClientSecret(data.data.clientSecret)
                    }
                }).catch(err => console.error(err))
        }

    }, [paymentMethod]);

    const methodPaymentButtonHandler = async (e: any) => {
        const method = paymentMethodsList.find(method => method.paymentName === e.target.value)

        if (method) {
            if (method.paymentName === paymentMethod?.paymentName) {
                return
            }
            console.log("methodPaymentButtonHandler ", method)
            setPaymentMethod(method)
        }
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
                onChange={(event) => console.log(event.target)}
            >
                <Dropdown.Item>Europa</Dropdown.Item>
                <Dropdown.Item>Resten av världen</Dropdown.Item>

            </DropdownButton>
            <Button onClick={methodPaymentButtonHandler} value="card">Kort</Button>
            <Button onClick={methodPaymentButtonHandler} value="sepa">SEPA</Button>
            <Button onClick={methodPaymentButtonHandler} value="pay">Apple Google Link pay</Button>
            {clientSecret !== "" && (
                <Elements options={options} stripe={stripePromise}>
                    {paymentMethod?.paymentName === 'card' && <CardCheckoutForm clientSecret={clientSecret} />}
                    {paymentMethod?.paymentName === 'sepa' && <SepaCheckoutForm clientSecret={clientSecret} />}
                    {paymentMethod?.paymentName === 'pay' && <PayCheckoutForm clientSecret={clientSecret} />}

                </Elements>
            )}
        </div>
    )
}