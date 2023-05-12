import react, { useEffect, useState } from "react"
import { PaymentRequest, StripePaymentRequestButtonElementOptions } from "@stripe/stripe-js";
import { useStripe, useElements, PaymentRequestButtonElement } from "@stripe/react-stripe-js";
import { IBillingDetails } from "../../models/ICheckout";
import { CardContainer } from "../../components/CardContainer";
import { Container, Row } from "react-bootstrap";
import { FormMessageError, FormMessageSuccess } from "../../components/forms/FormMessage";
import { IProductDetails } from "../../models/IProducts";

/*
Wallet payment form.

Accepts different wallet payment forms, like Apple, Google and Link pay.

Has a bit of a different approach than card and SEPA.

To display correct wallet, you must ensure its compatible with the device and browser and also if you have activated the wallet.
See more here: https://stripe.com/docs/stripe-js/elements/payment-request-button

A paymentRequest is used to retrive suitable wallet options. It is used to collect payment information through an interface controlled and styled by the browser itself.
See more here: https://stripe.com/docs/js/payment_request

the make sure your customer has an active payment method enabled with paymentRequests canMakePayment(). 
If so, render Stripes PaymentRequestButtonElement component to display different wallet options

*/

interface IProps {
    clientSecret: string;
    customer?: IBillingDetails;
    paymentSuccess: (customer: IBillingDetails) => void;
    productDetails?: IProductDetails;
}

const PayCheckoutForm = (props: IProps) => {
    const stripe = useStripe(); //keeps track of payments
    const elements = useElements(); //manages Stripes UI components
    const [paymentRequest, setPaymentRequest] = useState<PaymentRequest>();
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [paymentSuccessful, setPaymentSuccessful] = useState<boolean>(false)

    useEffect(() => {
        if (stripe && props.productDetails) {
            //create payment
            const pr: PaymentRequest = stripe.paymentRequest({
                country: 'SE',
                currency: 'sek',
                total: {
                    label: 'Demo total',
                    amount: props.productDetails.price.unit_amount,
                },
                requestPayerName: true,
                requestPayerEmail: true,
            })

            //Check to make sure that your customer has an active payment method
            pr.canMakePayment().then(result => {
                if (result) {
                    setPaymentRequest(pr);
                }
            });

        }
    }, [stripe])

    useEffect(() => {
        if (paymentRequest && stripe) {
            //listed for accepting payments with the paymentRequest object. Pass the clientSecret and PaymentMethod ID
            paymentRequest.on("paymentmethod", async (event) => {
                const { paymentIntent, error } = await stripe.confirmCardPayment(
                    props.clientSecret,
                    { payment_method: event.paymentMethod.id },
                    { handleActions: false }
                )

                if (error) {
                    event.complete('fail')
                    setErrorMessage("Nåt fel hände. Försök att välja annan betalmetod eller försök senare.")
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
                            setErrorMessage("Nåt fel hände. Försök att välja annan betalmetod eller försök senare.")
                        }
                        else {
                            setErrorMessage("")
                            setPaymentSuccessful(true)
                        }
                    } else {
                        setErrorMessage("")
                        setPaymentSuccessful(true)
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

        return <CardContainer>
            <Container>
                {errorMessage ?
                    <Row>
                        <FormMessageError>
                            {errorMessage}
                        </FormMessageError>
                    </Row> : null}
                <Row>
                    <PaymentRequestButtonElement options={paymentRequestOptions} />
                </Row>
                {paymentSuccessful ?
                    <Row>
                        <FormMessageSuccess>Betald!</FormMessageSuccess>
                    </Row>
                    : null}
            </Container>

        </CardContainer>

    }
    else {
        return <div>Loading...</div>
    }
}

export default PayCheckoutForm;