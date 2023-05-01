import react, { useEffect, useState } from "react"
import { PaymentRequest, StripePaymentRequestButtonElementOptions } from "@stripe/stripe-js";
import { useStripe, useElements, PaymentRequestButtonElement } from "@stripe/react-stripe-js";
import { ClientRequest } from "http";

interface IProps {
    clientSecret: string;
}

const PayCheckoutForm = (props: IProps) => {
    const stripe = useStripe();
    const elements = useElements();
    const [paymentRequest, setPaymentRequest] = useState<PaymentRequest>();

    useEffect(() => {
        if (stripe) {
            const pr: PaymentRequest = stripe.paymentRequest({
                country: 'SE',
                currency: 'sek',
                total: {
                    label: 'Demo total',
                    amount: 12000,
                },
                requestPayerName: true,
                requestPayerEmail: true,
            })

            //Check to make sure that your customer has an active payment method using
            pr.canMakePayment().then(result => {
                console.log("result: ", result)
                if (result) {
                    setPaymentRequest(pr);
                }
            });

        }
    }, [stripe])

    useEffect(() => {
        if (paymentRequest && stripe) {
            paymentRequest.on("paymentmethod", async (event) => {
                const { paymentIntent, error } = await stripe.confirmCardPayment(
                    props.clientSecret,
                    { payment_method: event.paymentMethod.id },
                    { handleActions: false }
                )

                if (error) {
                    event.complete('fail')
                }
                else {
                    // Report to the browser that the confirmation was successful, prompting
                    // it to close the browser payment method collection interface.
                    event.complete('success')


                    // Check if the PaymentIntent requires any actions and if so let Stripe.js
                    // handle the flow. 
                    if (paymentIntent.status === 'requires_action') {

                        const { error } = await stripe.confirmCardPayment(props.clientSecret)
                        if (error) {
                            console.error(error)
                        }
                        else {
                            console.log('payment succeeded!')
                        }
                    } else {
                        console.log('payment succeeded!')
                    }
                }
            })
        }

    }, [paymentRequest])


    if (paymentRequest) {

        const paymentRequestOptions: StripePaymentRequestButtonElementOptions = {
            paymentRequest,
            style: {
                paymentRequestButton: {
                    type: 'default',
                    theme: 'dark',
                    height: '32px'
                }
            }
        }

        return <>
            <PaymentRequestButtonElement options={paymentRequestOptions} />

        </>

    }
    else {
        return <div>Loading...</div>
    }
}

export default PayCheckoutForm;