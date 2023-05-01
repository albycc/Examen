import react, { useState, useEffect, useMemo } from "react"
import {
    PaymentElement,
    useStripe,
    useElements,
    IbanElement,
    AddressElement
} from "@stripe/react-stripe-js";
import {
    StripePaymentElementOptions,
    StripeIbanElementOptions,
    StripeAddressElementOptions,
    StripeAddressElementChangeEvent
} from '@stripe/stripe-js';
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import { IAddress, IBillingDetails, IPaymentMethod } from "../../models/Checkout";
import { useLocation } from "react-router-dom";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown"

interface IProps {
    clientSecret: string;
}

const SepaCheckoutForm = (props: IProps) => {
    const stripe = useStripe();
    const elements = useElements();

    const [message, setMessage] = useState<string>("");

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [email, setEmail] = useState<string>()
    const [billingDetails, setBillingDetails] = useState<IBillingDetails>({

        email: null,
        name: null,
        phone: null
    })


    console.log("billingDetails: ", billingDetails)


    useEffect(() => {
        if (!stripe) {
            return;
        }

        const clientSecret = new URLSearchParams(window.location.search).get(
            "payment_intent_client_secret"
        );

        if (!clientSecret) {
            return;
        }

        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
            if (paymentIntent) {
                switch (paymentIntent.status) {
                    case "succeeded":
                        setMessage("Payment succeeded!");
                        break;
                    case "processing":
                        setMessage("Your payment is processing.");
                        break;
                    case "requires_payment_method":
                        setMessage("Your payment was not successful, please try again.");
                        break;
                    default:
                        setMessage("Something went wrong.");
                        break;
                }

            }
        });
    }, [stripe]);

    const onSubmitHandler = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!stripe || !elements) {
            console.error("Stripe has not yet been loaded")
            return;
        }

        setIsLoading(true);

        const ibanElement = elements.getElement(IbanElement)

        console.log("ibanElement: ", ibanElement)

        if (ibanElement !== null) {
            const { error, paymentIntent } = await stripe.confirmSepaDebitPayment(props.clientSecret, {
                payment_method: {
                    sepa_debit: ibanElement,
                    billing_details: {
                        name: billingDetails.name || "",
                        email: billingDetails.email || "",
                        phone: billingDetails.phone || ""

                    }
                }

            });

            console.log("error: ", error)
            console.log("paymentIntent: ", paymentIntent)

            if (error && error.message) {
                setMessage(error.message)
            }
            else if (paymentIntent?.status === 'succeeded' || paymentIntent?.status === 'processing') {
                setMessage('Done!')
                setIsLoading(false)
            }

        }

    }

    const addressChangeHandler = () => {

    }

    const IBAN_STYLE = {
        base: {
            color: "#4651ee",
            fontSize: "25px",
            "::placeholder": {
                color: "#707070",
            },
            ":-webkit-autofill": {
                color: "#707070",
            },
        },
        invalid: {
            color: "#fa755a",
            iconColor: "#fa755a",
            ":-webkit-autofill": {
                color: "#fa755a",
            },
        },
    };

    const IBAN_ELEMENT_OPTIONS: StripeIbanElementOptions = {
        supportedCountries: ["SEPA"],
        placeholderCountry: "SE",
        style: IBAN_STYLE,
    };

    const addressOptions: StripeAddressElementOptions = {
        mode: "billing"
    }


    return (
        <>
            <Form onSubmit={onSubmitHandler}>

                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="Email" onChange={(event) => setBillingDetails({ ...billingDetails, email: event.target.value })}></Form.Control>

                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder="för och efternamn" onChange={(event) => setBillingDetails({ ...billingDetails, name: event.target.value })}></Form.Control>

                <Form.Label>EU Länder</Form.Label>
                <DropdownButton
                    id="dropdown-button-dark-example2"
                    variant="secondary"
                    menuVariant="dark"
                    title="Dropdown button"
                    className="mt-2"
                >
                    <Dropdown.Item>SE</Dropdown.Item>
                    <Dropdown.Item>DK</Dropdown.Item>

                </DropdownButton>

                <Form.Label>Name</Form.Label>
                <Form.Control type="tel" placeholder="Tel" onChange={(event) => setBillingDetails({ ...billingDetails, phone: event.target.value })}></Form.Control>

                {/* <AddressElement options={addressOptions} onChange={(event: StripeAddressElementChangeEvent) => {
                    const { value: { address } } = event
                    setAddress(address)
                }} /> */}

                <IbanElement options={IBAN_ELEMENT_OPTIONS} />
                <Button type="submit" disabled={isLoading || !stripe || !elements}>Betala</Button>
            </Form>
        </>

    )
}

export default SepaCheckoutForm