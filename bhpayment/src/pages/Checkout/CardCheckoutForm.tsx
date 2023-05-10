import React, { useState, useEffect, useMemo } from "react"
import { PaymentElement, useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from "@stripe/react-stripe-js";
import { StripePaymentElementOptions, StripeCardNumberElementOptions } from '@stripe/stripe-js';
import Form from "react-bootstrap/Form"
import { IPaymentMethod } from "../../models/ICheckout";
import { useLocation } from "react-router-dom";
import { IBillingDetails } from "../../models/ICheckout";
import CustomerFields from "./CustomerFields";
import Container from "react-bootstrap/Container"
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
import StripeInputStyle from "./stylings/StripeInput.module.css"
import { CardContainer } from "../../components/CardContainer";
import { ButtonPrim } from "../../components/inputs/Buttons";
import { Button } from "../../components/inputs/Buttons";
import { P } from "../../components/text/Text";
import { FormMessageSuccess } from "./stylings/CheckoutStyles";

const useOptions = (disabled: boolean) => {
    console.log("use options")
    const options: StripeCardNumberElementOptions = useMemo(
        () => ({
            style: {
                base: {
                    fontSize: "25px",
                    color: "#424770",
                    letterSpacing: "0.025em",
                    fontFamily: "Roboto, Source Code Pro, monospace, SFUIDisplay",
                    "::placeholder": {
                        color: "#aab7c4"
                    }
                },
                invalid: {
                    color: "#9e2146"
                },

            },
            disabled: disabled

        }), [disabled]
    );

    return options;
};

interface IProps {
    clientSecret: string;
    customer?: IBillingDetails;
    paymentSuccess: () => void;
}

const CardCheckoutForm = (props: IProps) => {
    const stripe = useStripe();
    const elements = useElements();

    const [message, setMessage] = useState<string>("");

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [formInitialized, setFormInitialized] = useState<boolean>(false)
    const [customerDetails, setCustomerDetails] = useState<IBillingDetails>();
    const [disableCardForm, setDisableCardForm] = useState<boolean>(false)
    const [cardDetailsComplete, setCardDetailsComplete] = useState({ card: false, cvc: false, exp: false })
    const [cardHolder, setCardHolder] = useState<string>()
    const [paymentSuccessful, setPaymentSuccessful] = useState<boolean>(false)
    const options = useOptions(disableCardForm);

    useEffect(() => {
        setFormInitialized(true)
    }, [])

    useEffect(() => {
        if (props.customer) {
            setCustomerDetails(props.customer)
        }

    }, [props.customer])

    const sendCustomerHandler = (customerDetails: IBillingDetails) => {
        setCustomerDetails(customerDetails)
        setDisableCardForm(false)
    }

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
        setDisableCardForm(true)

        console.log("processing card payment")

        const cardElement = elements.getElement(CardNumberElement)

        if (cardElement !== null && customerDetails) {
            const { error, paymentIntent } = await stripe.confirmCardPayment(props.clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: customerDetails

                },

            });

            console.log("paymentIntent: ", paymentIntent)

            if (error && error.message) {
                setMessage(error.message)
                console.error(error.message)
            }
            else if (paymentIntent?.status === 'succeeded') {
                setMessage('Done!')
                props.paymentSuccess()
                setPaymentSuccessful(true)
            }

        }

    }

    const disable = () => {

        return !Object.values(cardDetailsComplete).every(value => value)
    }

    console.log("isLoading: ", isLoading)
    console.log("stripe: ", stripe)
    console.log("elements: ", elements)
    console.log("disable: ", disable())
    console.log("disableCardForm: ", disableCardForm)


    return (
        <Form onSubmit={onSubmitHandler}>

            <CardContainer>
                <Row>
                    <Form.Label>Kort</Form.Label>
                    <CardNumberElement
                        options={options}
                        className={StripeInputStyle["card-element"]}
                        onChange={(event => setCardDetailsComplete({ ...cardDetailsComplete, card: event.complete }))}
                    />
                    <Form.Label>CVC</Form.Label>
                    <CardCvcElement
                        options={options}
                        className={StripeInputStyle["card-element"]}
                        onChange={(event => setCardDetailsComplete({ ...cardDetailsComplete, cvc: event.complete }))}
                    />
                    <Form.Label>Utgångsdatum</Form.Label>
                    <CardExpiryElement
                        options={options}
                        className={StripeInputStyle["card-element"]}
                        onChange={(event => setCardDetailsComplete({ ...cardDetailsComplete, exp: event.complete }))}
                    />

                </Row>
                <Row>
                    {paymentSuccessful ?
                        <FormMessageSuccess>Betald!</FormMessageSuccess>

                        :
                        <Button type="submit" disabled={isLoading || !stripe || !elements || disable()}>Betala</Button>
                    }

                </Row>

            </CardContainer>
        </Form>


    )
}

export default CardCheckoutForm