import react, { useEffect, useState } from "react"
import { PaymentRequest } from "@stripe/stripe-js";
import { PaymentElement, useStripe, useElements, PaymentRequestButtonElement } from "@stripe/react-stripe-js";

const PayCheckoutForm = () => {
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

    if (paymentRequest) {
        return <PaymentRequestButtonElement options={{ paymentRequest }} />

    }
    else {
        return <div>Loading...</div>
    }
}

export default PayCheckoutForm;