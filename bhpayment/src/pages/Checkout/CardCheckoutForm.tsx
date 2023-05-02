import react, { useState, useEffect, useMemo } from "react"
import { PaymentElement, useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from "@stripe/react-stripe-js";
import { StripePaymentElementOptions, StripeCardNumberElementOptions } from '@stripe/stripe-js';
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import { IPaymentMethod } from "../../models/Checkout";
import { useLocation } from "react-router-dom";
import { IBillingDetails } from "../../models/Checkout";
import CustomerFields from "./CustomerFields";
import Container from "react-bootstrap/Container"
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
import StripeInputStyle from "./stylings/StripeInput.module.css"
import { CardContainer } from "../../components/CardContainer";
import { ButtonPrim } from "../../components/inputs/Buttons";

const useOptions = () => {
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

            }
        }), []
    );

    return options;
};

interface IProps {
    clientSecret: string;
    customer?: IBillingDetails
}

const CardCheckoutForm = (props: IProps) => {
    const stripe = useStripe();
    const elements = useElements();
    const options = useOptions();

    const [message, setMessage] = useState<string>("");

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [formInitialized, setFormInitialized] = useState<boolean>(false)
    const [customerDetails, setCustomerDetails] = useState<IBillingDetails>();
    const [cardDetailsComplete, setCardDetailsComplete] = useState({ card: false, cvc: false, exp: false })

    useEffect(() => {
        setFormInitialized(true)
    }, [])

    useEffect(() => {
        if (props.customer) setCustomerDetails(props.customer)


    }, [props.customer])

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

        const cardElement = elements.getElement(CardNumberElement)

        if (cardElement !== null && customerDetails) {
            const { error, paymentIntent } = await stripe.confirmCardPayment(props.clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: customerDetails

                },

            });

            if (error && error.message) {
                setMessage(error.message)
            }
            else if (paymentIntent?.status === 'succeeded') {
                setMessage('Done!')
                setIsLoading(false)
            }

        }

    }

    const disable = () => {

        return !Object.values(cardDetailsComplete).every(value => value)
    }


    return (
        <Form onSubmit={onSubmitHandler}>

            <CustomerFields sendCustomer={setCustomerDetails} />

            <CardContainer>
                <Row>
                    <Form.Label>Kort</Form.Label>
                    <CardNumberElement options={options} className={StripeInputStyle["card-element"]}
                        onChange={(event => setCardDetailsComplete({ ...cardDetailsComplete, card: event.complete }))} />
                    <Form.Label>CVC</Form.Label>
                    <CardCvcElement options={options} className={StripeInputStyle["card-element"]}
                        onChange={(event => setCardDetailsComplete({ ...cardDetailsComplete, cvc: event.complete }))}
                    />
                    <Form.Label>Utgångsdatum</Form.Label>
                    <CardExpiryElement options={options} className={StripeInputStyle["card-element"]}
                        onChange={(event => setCardDetailsComplete({ ...cardDetailsComplete, exp: event.complete }))}

                    />

                </Row>
                <Row>
                    <ButtonPrim type="submit" disabled={isLoading || !stripe || !elements || disable()}>Betala</ButtonPrim>

                </Row>
            </CardContainer>
        </Form>


    )
}

export default CardCheckoutForm