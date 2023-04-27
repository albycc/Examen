import react, { useState, useEffect } from "react"
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { StripePaymentElementOptions } from '@stripe/stripe-js';
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();

    const [message, setMessage] = useState<string>("");

    const [isLoading, setIsLoading] = useState<boolean>(false);

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

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Make sure to change this to your payment completion page
                return_url: "http://localhost:3000",
            },
        });
    }

    const paymentElementOptions: StripePaymentElementOptions = {
        layout: "tabs"
    }

    return (
        <Form onSubmit={onSubmitHandler}>
            <Form.Label>Namn</Form.Label>
            <Form.Control type="text" placeholder="Ange namn"></Form.Control>
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="Ange email"></Form.Control>
            <PaymentElement id="payment-element" options={paymentElementOptions} />
            <Button type="submit" disabled={isLoading || !stripe || !elements}>Betala</Button>
        </Form>

    )
}

export default CheckoutForm