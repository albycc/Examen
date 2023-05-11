import react, { useState, useEffect, useMemo } from "react"
import {
    useStripe,
    useElements,
    IbanElement,
} from "@stripe/react-stripe-js";
import {
    StripeIbanElementOptions,
} from '@stripe/stripe-js';
import Form from "react-bootstrap/Form"
import { Button } from "../../components/inputs/Buttons"
import { IBillingDetails } from "../../models/ICheckout";
import euroCountries from "../../constants/euroCountries";
import Row from "react-bootstrap/Row";
import StripeInputStyle from "./stylings/StripeInput.module.css"
import { CardContainer } from "../../components/CardContainer";
import { Col } from "react-bootstrap";
import { FormMessageError, FormMessageSuccess } from "../../components/forms/FormMessage";

/*
SEPA payment form.

Accepts EURO as currency

Only available for Euro countries

A dropdown will display Euro countries and their country code as values. See euroCountries array list

A Stripe IbanElement is used for accepting debit card numbers.

*/

interface IProps {
    clientSecret: string;
    customer?: IBillingDetails
    paymentSuccess: () => void;
}

//options for IbanElement. Needs to know countrycode for accepting right debit card numbers.
const useOptions = (countryCode: string, disabled: boolean) => {
    const options: StripeIbanElementOptions = useMemo(
        () => ({
            supportedCountries: ["SEPA"],
            placeholderCountry: countryCode,
            style: {
                base: {
                    fontSize: "25px",
                    color: "#5B3442",
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

    return options;
};

const SepaCheckoutForm = (props: IProps) => {
    const stripe = useStripe(); //keeps track of payments
    const elements = useElements(); //manages Stripes UI components

    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [customerDetails, setCustomerDetails] = useState<IBillingDetails>(); //customers details, like email and name
    const [disableSepaForm, setDisableSepaForm] = useState<boolean>(false)
    const [countryCode, setCountryCode] = useState<string>("SE") //country code
    const [sepaDebitFilled, setSepaDebitFilled] = useState<boolean>(false) //check to see IbanElement card number has been filled
    const [paymentSuccessful, setPaymentSuccessful] = useState<boolean>(false)
    const options = useOptions(countryCode, disableSepaForm);

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
        setDisableSepaForm(true)

        const ibanElement = elements.getElement(IbanElement)


        //sepa payment uses confirmSepaDebitPayment method to complete the purchase
        //need to know the iban card number from IbanElement and customers details, as well as pass the clientSecret
        if (ibanElement !== null && customerDetails) {
            const { error, paymentIntent } = await stripe.confirmSepaDebitPayment(props.clientSecret, {
                payment_method: {
                    sepa_debit: ibanElement,
                    billing_details: customerDetails
                }
            });

            //something went wrong
            if (error && error.message) {
                setErrorMessage("Nåt fel hände. Försök att välja annan betalmetod eller försök senare.")
                console.log("error: ", error)
            }
            else if (paymentIntent?.status === 'succeeded' || paymentIntent?.status === 'processing') {
                //success
                setIsLoading(false)
                setErrorMessage("")
                setPaymentSuccessful(true)
                props.paymentSuccess() //call what happens after succesful payment
            }
        }
    }

    return (
        <Form onSubmit={onSubmitHandler}>

            <CardContainer>
                {errorMessage ?
                    <Row>
                        <FormMessageError>
                            {errorMessage}
                        </FormMessageError>
                    </Row>
                    : null}
                <Row>
                    <Col>
                        <div className="my-2">
                            <Form.Group>
                                <Form.Label>EU Länder</Form.Label>
                                <Form.Select onChange={(event) => setCountryCode(event.target.value)} value={countryCode} disabled={disableSepaForm}>

                                    {euroCountries.map(option => <option key={option.value} value={option.value}>{option.name}</option>)}
                                </Form.Select>

                            </Form.Group>

                        </div>
                        <div className="my-2">
                            <Form.Label>SEPA Iban nummer</Form.Label>
                            <IbanElement options={options} className={StripeInputStyle["card-element"]} onChange={(event) => setSepaDebitFilled(event.complete)} />

                        </div>

                    </Col>

                </Row>
                <Row>
                    <Col className="mt-3 d-flex justify-content-end">
                        {paymentSuccessful ?
                            <FormMessageSuccess>Betald!</FormMessageSuccess>
                            :
                            <Button type="submit" disabled={isLoading || !stripe || !elements || !sepaDebitFilled} >Betala</Button>
                        }

                    </Col>
                </Row>
            </CardContainer>
        </Form>
    )
}

export default SepaCheckoutForm