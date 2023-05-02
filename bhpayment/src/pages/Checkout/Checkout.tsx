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
        displayName: "Kort",
        paymentMethod: "card",
        currency: "sek",
    },
    {
        paymentName: "sepa",
        displayName: "SEPA",
        paymentMethod: "sepa_debit",
        currency: "eur"
    },
    {
        paymentName: "pay",
        displayName: "Google Apple Link Pay",
        paymentMethod: "card",
        currency: "sek"
    }
];

const dropdownMethodGroup = [
    {
        name: "europe",
        displayName: "Europa",
        paymentMethods: ["card", "sepa", "pay"],
    },
    {
        name: "world",
        displayName: "Världen",
        paymentMethods: ["card", "pay"]
    },
]


export default function Checkout() {
    const [clientSecret, setClientSecret] = useState("")
    const [paymentMethod, setPaymentMethod] = useState<IPaymentMethod | null>()
    const [productId, setProductId] = useState<string>("price_1Mytk6HKeMBcSTk8eYnieGRt")
    const [dropdownValue, setDropdownValue] = useState<string>("")

    useEffect(() => {
        setDropdownValue("europe")

    }, [])

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


    const containsMethodGroup = (name: string) => {
        const method = dropdownMethodGroup.find(method => method.name === dropdownValue)
        if (method) {
            return method.paymentMethods.some(method => method === name)
        }
    }

    const displayPaymentMethods = () => {

        const paymentMethodGroup = dropdownMethodGroup.find(method => method.name === dropdownValue)

        let buttons;

        if (paymentMethodGroup) {
            const methods = paymentMethodsList.filter(paymentMethod => paymentMethodGroup.paymentMethods.some(method => paymentMethod.paymentName === method))
            console.log(methods)

            buttons = methods.map(method => <Button onClick={methodPaymentButtonHandler} value={method.paymentName}>{method.displayName}</Button>)
        }

        return (
            <div>
                {buttons}

            </div>
        )
    }

    console.log("dropdownValue: ", dropdownValue)

    return (
        <div>
            <h1>
                Checkout
            </h1>
            <Dropdown
                id="dropdown-button-dark-example2"
                title="Dropdown button"
                className="mt-2"
                onSelect={(event) => { if (event) setDropdownValue(event) }}
            >
                <Dropdown.Toggle variant="success">
                    {dropdownValue}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {dropdownMethodGroup.map((method) => <Dropdown.Item key={method.name} eventKey={method.name}>{method.displayName}</Dropdown.Item>)}

                </Dropdown.Menu>

            </Dropdown>

            {displayPaymentMethods()}


            {clientSecret !== "" && (
                <Elements options={options} stripe={stripePromise}>
                    {(paymentMethod?.paymentName === 'card' && containsMethodGroup('card')) && <CardCheckoutForm clientSecret={clientSecret} />}
                    {(paymentMethod?.paymentName === 'sepa' && containsMethodGroup('sepa')) && <SepaCheckoutForm clientSecret={clientSecret} />}
                    {(paymentMethod?.paymentName === 'pay' && containsMethodGroup('pay')) && <PayCheckoutForm clientSecret={clientSecret} />}

                </Elements>
            )}
        </div>
    )
}