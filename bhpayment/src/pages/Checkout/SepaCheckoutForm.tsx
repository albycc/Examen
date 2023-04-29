import react, { useState, useEffect, useMemo } from "react"
import { PaymentElement, useStripe, useElements, IbanElement } from "@stripe/react-stripe-js";
import { StripePaymentElementOptions, StripeIbanElementOptions, } from '@stripe/stripe-js';
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import { IPaymentMethod } from "../../models/Checkout";
import { useLocation } from "react-router-dom";

interface IProps {
    clientSecret: string;
}

const SepaCheckoutForm = (props: IProps) => {
    const stripe = useStripe();
    const elements = useElements();

    const [message, setMessage] = useState<string>("");

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [formInitialized, setFormInitialized] = useState<boolean>(false)

    useEffect(() => {
        setFormInitialized(true)
    }, [])

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

    // useEffect(() => {
    //     if (formInitialized && props.paymentMethod) {
    //         console.log("props.paymentMethod")
    //         elements?.update({
    //             mode: 'payment',
    //             paymentMethodTypes: [props.paymentMethod.paymentMethod],
    //             currency: props.paymentMethod.currency,
    //             amount: 1200
    //         })

    //     }

    // }, [props.paymentMethod])

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
                        name: "Test Testsson",
                        email: "testsson@testmail.com"
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

    const IBAN_STYLE = {
        base: {
            color: "#4651ee",
            fontSize: "14px",
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


    return (
        <>
            <Form onSubmit={onSubmitHandler}>
                <Form.Label>Namn</Form.Label>
                <Form.Control type="text" placeholder="Ange namn"></Form.Control>
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="Ange email"></Form.Control>

                <IbanElement options={IBAN_ELEMENT_OPTIONS} />
                <Button type="submit" disabled={isLoading || !stripe || !elements}>Betala</Button>
            </Form>
        </>

    )
}

export default SepaCheckoutForm