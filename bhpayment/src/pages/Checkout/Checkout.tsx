import react, { useState, useEffect } from "react"
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import config from "../../config.json"
import CardCheckoutForm from "./CardCheckoutForm";
import SepaCheckoutForm from "./SepaCheckoutForm";
import PayCheckoutForm from "./PayCheckoutForm";
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import Dropdown from "../../components/inputs/Dropdown"
import DropdownButton from "react-bootstrap/DropdownButton"
import { IBillingDetails, IPaymentMethod } from "../../models/ICheckout";
import axios from "axios";
import CustomerFields from "./CustomerFields";
import Container from "react-bootstrap/Container"
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
import { CardContainer } from "../../components/CardContainer";
import { HeadingL, HeadingM, P } from "../../components/text/Text";
import { ButtonIconRound } from "./stylings/CheckoutStyles";
import creditIcon from "./images/credit.svg"
import sepaIcon from "./images/SEPA.svg"
import payIcon from "./images/pay.png"
import MainCenterLayout from "../../components/layouts/CenterLayout";
import { useParams } from "react-router-dom";
import { productService } from "../../service/productsService";
import { IProductDetails } from "../../models/IProducts";

const stripePromise = loadStripe(config.STRIPE_PUBLIC_API_TEST_KEY)

const paymentMethodsList: IPaymentMethod[] = [
    {
        paymentName: "card",
        displayName: "Kort",
        paymentMethod: "card",
        currency: "sek",
        icon: creditIcon
    },
    {
        paymentName: "sepa",
        displayName: "SEPA",
        paymentMethod: "sepa_debit",
        currency: "eur",
        icon: sepaIcon
    },
    {
        paymentName: "pay",
        displayName: "Google Apple Link Pay",
        paymentMethod: "card",
        currency: "sek",
        icon: payIcon
    }
];

interface IDropdownMethodGroup {
    name: string;
    displayName: string;
    paymentMethods: string[];

}

const dropdownMethodGroupList: IDropdownMethodGroup[] = [
    {
        name: "europe",
        displayName: "Europa",
        paymentMethods: ["card", "sepa", "pay"]
    },
    {
        name: "world",
        displayName: "Världen",
        paymentMethods: ["card", "pay"]
    },
]


export default function Checkout() {
    const [clientSecret, setClientSecret] = useState("")
    const [paymentMethod, setPaymentMethod] = useState<IPaymentMethod | null>()
    // const [dropdownValue, setDropdownValue] = useState<string>("")
    const [dropdownMethodGroup, setDropdownMethodGroup] = useState<IDropdownMethodGroup>()
    const [customerDetails, setCustomerDetails] = useState<IBillingDetails>()
    const [productDetails, setProductDetails] = useState<IProductDetails>()
    const { id } = useParams()

    console.log("id: ", id)
    console.log("productDetails: ", productDetails)

    useEffect(() => {
        setDropdownMethodGroup(dropdownMethodGroupList[0])

        const exec = async () => {
            if (id) {
                const data = await productService.getProduct(id)

                if (data) {
                    setProductDetails(data)

                }
            }
        }
        exec()

    }, [])

    useEffect(() => {
        // Skapa PaymentIntent object 
        // summa anges som cents, så 100 cents blir 1$, vilket är 0.1 kr.
        console.log("useEffect paymentMethod")
        if (paymentMethod && clientSecret) {
            axios.put(config.SERVER_URL + "update-payment-intent",
                {
                    currency: paymentMethod.currency,
                    priceId: productDetails?.price.id,
                    paymentMethod: paymentMethod.paymentMethod
                })
                .then(data => {
                    console.log("clientSecret: ", data)

                })
        }
        else if (paymentMethod) {
            axios.post(config.SERVER_URL + "create-payment-intent",
                {
                    currency: paymentMethod.currency,
                    priceId: productDetails?.price.id,
                    paymentMethod: paymentMethod.paymentMethod
                }
            )
                .then((data) => {
                    console.log("clientSecret: ", data)
                    if (data.data.clientSecret) {

                        setClientSecret(data.data.clientSecret)
                    }
                }).catch(err => console.error(err))
        }

    }, [paymentMethod]);

    const methodPaymentButtonHandler = async (e: any) => {
        const method = paymentMethodsList.find(method => method.paymentName === e.target.value)

        if (method) {
            if (method.paymentName === paymentMethod?.paymentName) {
                return
            }
            console.log("methodPaymentButtonHandler ", method)
            setPaymentMethod(method)
        }
    }


    const options: StripeElementsOptions = {
        clientSecret,
        appearance: { theme: 'stripe' },
    };


    const containsMethodGroup = (name: string) => {

        if (dropdownMethodGroup)

            return dropdownMethodGroup.paymentMethods.some(method => method === name)
    }

    const displayPaymentMethods = () => {

        let buttons;

        if (dropdownMethodGroup) {
            const methods = paymentMethodsList.filter(paymentMethod => dropdownMethodGroup.paymentMethods.some(method => paymentMethod.paymentName === method))
            console.log(methods)

            buttons = methods.map(method => (
                <ButtonIconRound
                    key={method.paymentName}
                    value={method.paymentName}
                    onClick={methodPaymentButtonHandler}
                    style={{ backgroundImage: `url(${method.icon})` }}
                />
            ))
        }

        return (
            <div>
                {buttons}

            </div>
        )
    }


    console.log("dropdownMethodGroup: ", dropdownMethodGroup)
    console.log("paymentMethod: ", paymentMethod)

    return (
        <MainCenterLayout>
            <Container>
                <Row>
                    <div className="justify-content-center">

                        <HeadingL >Checkout</HeadingL>
                    </div>

                </Row>

            </Container>

            {productDetails ? <CardContainer>
                <HeadingM>{productDetails.product.name}</HeadingM>
                <P>
                    {productDetails.price.unit_amount / 100}
                    {" kr"}
                </P>
                <P className="mt-2">{productDetails.product.description}</P>
            </CardContainer> : null}

            <CardContainer>
                <Row>
                    <Dropdown
                        id="dropdown-button-dark-example2"
                        title="Dropdown button"
                        className="mt-2"
                        onSelect={(event: any) => {
                            if (event) {

                                const methodGroup = dropdownMethodGroupList.find(method => method.name === event)

                                if (methodGroup) setDropdownMethodGroup(methodGroup)
                            }
                        }}
                    >
                        <Dropdown.Toggle>
                            {dropdownMethodGroup?.displayName}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {dropdownMethodGroupList.map((method) => <Dropdown.Item key={method.name} eventKey={method.name}>{method.displayName}</Dropdown.Item>)}

                        </Dropdown.Menu>

                    </Dropdown>

                </Row>
                <Row>
                    {displayPaymentMethods()}

                </Row>
            </CardContainer>

            {clientSecret !== "" && (
                <Elements options={options} stripe={stripePromise}>
                    {(paymentMethod?.paymentName === 'card' && containsMethodGroup('card')) &&
                        <CardCheckoutForm clientSecret={clientSecret} />}
                    {(paymentMethod?.paymentName === 'sepa' && containsMethodGroup('sepa')) &&
                        <SepaCheckoutForm clientSecret={clientSecret} />}
                    {(paymentMethod?.paymentName === 'pay' && containsMethodGroup('pay')) &&
                        <PayCheckoutForm clientSecret={clientSecret} />}

                </Elements>
            )}



        </MainCenterLayout>
    )
}