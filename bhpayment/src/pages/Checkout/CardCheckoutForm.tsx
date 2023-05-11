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
import { FormMessageError, FormMessageSuccess } from "../../components/forms/FormMessage";

/*
Card payment form.

Accepts SEK as currency

Available to all regions

Uses Stripes CardNumberElement, CardCvcElement and CardExpiryElement for cardnumber, cvc and expiry date respectively

*/

//options for cardElement
const useOptions = (disabled: boolean) => {
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
            disabled: disabled,
            showIcon: true

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
    const stripe = useStripe(); // keeps track of payments
    const elements = useElements(); //manages Stripes UI components

    const [errorMessage, setErrorMessage] = useState<string>("");

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [customerDetails, setCustomerDetails] = useState<IBillingDetails>(); // customers details, like email and name
    const [disableCardForm, setDisableCardForm] = useState<boolean>(false)
    const [cardDetailsComplete, setCardDetailsComplete] = useState({ card: false, cvc: false, exp: false }) //check to see if card, cvc and expiry date has been filled
    const [paymentSuccessful, setPaymentSuccessful] = useState<boolean>(false)
    const options = useOptions(disableCardForm);


    useEffect(() => {
        if (props.customer) {
            setCustomerDetails(props.customer)
        }

    }, [props.customer])

    //fires after user submits the payment form
    const onSubmitHandler = async (e: React.FormEvent) => {
        e.preventDefault()

        //need to make sure stripe and elements are loaded to make payment
        if (!stripe || !elements) {
            console.error("Stripe has not yet been loaded")
            return;
        }

        setIsLoading(true);
        setDisableCardForm(true)


        const cardElement = elements.getElement(CardNumberElement)

        //card payment uses confirmCardPayment method to complete the purchase
        //need to know the card number from CardNumberElement and customers details, as well as pass the clientSecret
        if (cardElement !== null && customerDetails) {
            const { error, paymentIntent } = await stripe.confirmCardPayment(props.clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: customerDetails
                },
            });


            if (error && error.message) {
                //there was an error
                setErrorMessage("Nåt fel hände. Försök att välja annan betalmetod eller försök senare.")
                console.error(error.message)
            }
            else if (paymentIntent?.status === 'succeeded') {
                // payment succesful
                props.paymentSuccess()
                setPaymentSuccessful(true)
            }
        }
    }

    const disable = () => {

        return !Object.values(cardDetailsComplete).every(value => value)
    }

    return (
        <Form onSubmit={onSubmitHandler}>

            <CardContainer>
                {errorMessage ? <Row>
                    <FormMessageError>
                        {errorMessage}
                    </FormMessageError>
                </Row>
                    : null}
                <Row>
                    <Col>
                        <Form.Label>Kort</Form.Label>
                        <CardNumberElement
                            options={options}
                            className={StripeInputStyle["card-element"]}
                            onChange={(event => { console.log(event); setCardDetailsComplete({ ...cardDetailsComplete, card: event.complete }) })}

                        />
                    </Col>
                </Row>
                <Row >
                    <Col sm={4} className="my-2">
                        <Form.Label>CVC</Form.Label>
                        <CardCvcElement
                            options={options}
                            className={StripeInputStyle["card-element"]}
                            onChange={(event => setCardDetailsComplete({ ...cardDetailsComplete, cvc: event.complete }))}
                        />
                    </Col>
                    <Col sm={8} className="my-2">
                        <Form.Label>Utgångsdatum</Form.Label>
                        <CardExpiryElement
                            options={options}
                            className={StripeInputStyle["card-element"]}
                            onChange={(event => setCardDetailsComplete({ ...cardDetailsComplete, exp: event.complete }))}
                        />

                    </Col>

                </Row>
                <Row>
                    <Col className="mt-3 d-flex justify-content-end">
                        {paymentSuccessful ?
                            <FormMessageSuccess className="w-100">Betald!</FormMessageSuccess>

                            :
                            <Button type="submit" disabled={isLoading || !stripe || !elements || disable()}>Betala</Button>
                        }

                    </Col>

                </Row>

            </CardContainer>
        </Form>


    )
}

export default CardCheckoutForm