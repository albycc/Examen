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
import { Button } from "../../components/inputs/Buttons"
import { IAddress, IBillingDetails, IPaymentMethod } from "../../models/ICheckout";
import { useLocation } from "react-router-dom";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown"
import euroCountries from "../../constants/euroCountries";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row"
import CustomerFields from "./CustomerFields";
import StripeInputStyle from "./stylings/StripeInput.module.css"
import { CardContainer } from "../../components/CardContainer";
import { FormMessageSuccess } from "./stylings/CheckoutStyles";

interface IProps {
    clientSecret: string;
    customer?: IBillingDetails
}

const useOptions = (countryCode: string, disabled: boolean) => {
    console.log("use options: ", countryCode)
    const options: StripeIbanElementOptions = useMemo(
        () => ({
            supportedCountries: ["SEPA"],
            placeholderCountry: countryCode,
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
        }), [countryCode, disabled]
    );

    console.log("options: ", options)

    return options;
};

const SepaCheckoutForm = (props: IProps) => {
    const stripe = useStripe();
    const elements = useElements();

    const [message, setMessage] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [customerDetails, setCustomerDetails] = useState<IBillingDetails>();
    const [disableSepaForm, setDisableSepaForm] = useState<boolean>(true)
    const [countryCode, setCountryCode] = useState<string>("SE")
    const [countryValue, setCountryValue] = useState()
    const [sepaDebitFilled, setSepaDebitFilled] = useState<boolean>(false)
    const [paymentSuccessful, setPaymentSuccessful] = useState<boolean>(false)
    const options = useOptions(countryCode, disableSepaForm);

    useEffect(() => {
        if (props.customer) {
            setCustomerDetails(props.customer)
            setDisableSepaForm(false)
        }

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

    const sendCustomerHandler = (customerDetails: IBillingDetails) => {
        setCustomerDetails(customerDetails)
        setDisableSepaForm(false)
    }

    const onSubmitHandler = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!stripe || !elements) {
            console.error("Stripe has not yet been loaded")
            return;
        }

        setIsLoading(true);

        const ibanElement = elements.getElement(IbanElement)

        console.log("ibanElement: ", ibanElement)

        if (ibanElement !== null && customerDetails) {
            const { error, paymentIntent } = await stripe.confirmSepaDebitPayment(props.clientSecret, {
                payment_method: {
                    sepa_debit: ibanElement,
                    billing_details: customerDetails
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
                setPaymentSuccessful(true)
            }

        }

    }

    return (
        <Form onSubmit={onSubmitHandler}>

            {/* <AddressElement options={addressOptions} onChange={(event: StripeAddressElementChangeEvent) => {
                const { value: { address } } = event
                setAddress(address)
            }} /> */}
            <CustomerFields sendCustomer={sendCustomerHandler} disableFields={isLoading} />
            <CardContainer>
                <Row>
                    <Form.Group>
                        <Form.Label>EU Länder</Form.Label>
                        <Form.Select onChange={(event) => setCountryCode(event.target.value)} value={countryCode} disabled={disableSepaForm}>

                            {euroCountries.map(option => <option key={option.value} value={option.value}>{option.name}</option>)}
                        </Form.Select>

                    </Form.Group>
                    <IbanElement options={options} className={StripeInputStyle["card-element"]} onChange={(event) => setSepaDebitFilled(event.complete)} />

                </Row>
                <Row>
                    {paymentSuccessful ?
                        <FormMessageSuccess>Betald!</FormMessageSuccess>
                        :
                        <Button type="submit" disabled={isLoading || !stripe || !elements || !sepaDebitFilled} >Betala</Button>
                    }
                </Row>
            </CardContainer>
        </Form>
    )
}

export default SepaCheckoutForm