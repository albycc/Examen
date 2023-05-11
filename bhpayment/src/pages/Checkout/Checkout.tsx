import react, { useState, useEffect, useContext } from "react"
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import config from "../../config.json"
import CardCheckoutForm from "./CardCheckoutForm";
import SepaCheckoutForm from "./SepaCheckoutForm";
import PayCheckoutForm from "./PayCheckoutForm";
import Dropdown from "../../components/inputs/Dropdown"
import { IBillingDetails, IDropdownMethodGroup, IPaymentMethod } from "../../models/ICheckout";
import CustomerFields from "./CustomerFields";
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import { CardContainer } from "../../components/CardContainer";
import { HeadingL, HeadingM, P } from "../../components/text/Text";
import { ButtonIconRound } from "./stylings/CheckoutStyles";
import MainCenterLayout from "../../components/layouts/CenterLayout";
import { useNavigate, useParams } from "react-router-dom";
import { productService } from "../../service/productsService";
import { IProduct, IProductDetails } from "../../models/IProducts";
import { products } from "../../constants/products";
import { UserContext } from "../../context/UserContext";
import { paymentService } from "../../service/paymentService";
import { paymentMethodsList } from "../../constants/checkout";
import { dropdownMethodGroupList } from "../../constants/checkout";

/*
Checkout component used by checkout page

Displays product details, user formula, payment methods and formulas for each payment method.

Stripe Elements is a parent wrapper component for Stripes UI elements. You need to pass a loadStripe promise as well as options containing the clientSecret

Depending on what payment method you choose, its corresponding formula will be displayed.

*/

//use Stripe test key
const stripePromise = loadStripe(config.STRIPE_PUBLIC_API_TEST_KEY)


export default function Checkout() {
    const [clientSecret, setClientSecret] = useState("") //self explanatory
    const [paymentMethod, setPaymentMethod] = useState<IPaymentMethod | null>() //chosen payment method stored as object
    const [dropdownMethodGroup, setDropdownMethodGroup] = useState<IDropdownMethodGroup>() // filtering right payment methods used depending on region
    const [product, setProduct] = useState<IProduct>() // product from products array. A product has ids, type and behaviours after succesful pay.
    const [customerDetails, setCustomerDetails] = useState<IBillingDetails>() // customers details like email and name
    const [productDetails, setProductDetails] = useState<IProductDetails>() // details Stripes product and price
    const [paymentIntentId, setPaymentIntentId] = useState<string>("")
    const { id } = useParams() //grab products id from url
    const navigate = useNavigate()
    const { user } = useContext(UserContext) // see if there is a logged user. If so, fill in its details in customer fields.

    useEffect(() => {
        setDropdownMethodGroup(dropdownMethodGroupList[0])

        const exec = async () => {
            if (id) {
                const product = products.find(prod => prod.id === id)
                if (product) {
                    setProduct(product)
                }
                const data = await productService.getProduct(id)

                if (data) {
                    setProductDetails(data)

                }
            }
        }
        exec()

    }, [])

    useEffect(() => {
        // Create paymentIntent on server and grab clientSecret

        // Different payment methods has different supported currencies, so we need to send it
        // priceId for getting the products price. Stripe products can have multiple price object, so we have created prices for kr and euro
        // need to know the choosen payment method of course
        // type is for price is a reccuring or single payment
        // email for customer
        // description for products description


        if (paymentMethod && product) {
            let priceId;
            //get either the price id for sek or euro currency
            switch (paymentMethod.currency) {
                case "sek": priceId = product.priceId_sec; break;
                case "eur": priceId = product.priceId_eur; break;
                default: priceId = "sek";
            }
            const payload = {
                currency: paymentMethod.currency,
                priceId: priceId,
                paymentMethod: paymentMethod.paymentMethod,
                type: productDetails?.price.type,
                email: customerDetails?.email,
                description: productDetails?.product.name
            }
            if (clientSecret) {
                //switch to a different payment method.

                paymentService.updatePaymentIntent({ paymentIntentId, payload })
                    .then(data => {
                        console.log("updated payment")

                    })
            }
            else if (paymentMethod) {
                // Create new payment. Retreives clientSecret for identifying the payment. 
                //Also clientSecret is used by Stripe Elements to identify the payment.

                paymentService.createPaymentIntent(payload)
                    .then((data) => {
                        if (data.data.clientSecret) {

                            setClientSecret(data.data.clientSecret)
                            setPaymentIntentId(data.data.paymentIntentId)
                        }
                    }).catch(err => console.error(err))
            }
        }

    }, [paymentMethod]);

    //grab info of payment method
    const methodPaymentButtonHandler = async (e: any) => {
        const method = paymentMethodsList.find(method => method.paymentName === e.target.value)

        if (method) {
            if (method.paymentName === paymentMethod?.paymentName) {
                return
            }
            setPaymentMethod(method)
        }
    }

    const sendCustomerHandler = (customerDetails: IBillingDetails) => {
        setCustomerDetails(customerDetails);
    }


    // Option object used by Elements
    const options: StripeElementsOptions = {
        clientSecret,
        appearance: { theme: 'stripe' },
    };

    // Fires after succesful payment. Returns to a url if there is any. Fires a behaviour if there is any, like changing user type after he/she becomes member
    const paymentSuccess = async () => {
        if (product) {
            if (product.paymentSuccessBehaviour && user) {
                await product.paymentSuccessBehaviour(user.id, product.type)
                if (product.paymentSuccessUrl && user) {
                    navigate(product.paymentSuccessUrl + "/" + user.id)
                }

            }
            else if (product.paymentSuccessUrl) {
                navigate(product.paymentSuccessUrl)
            }
        }

    }


    const containsMethodGroup = (name: string) => {

        if (dropdownMethodGroup)

            return dropdownMethodGroup.paymentMethods.some(method => method === name)
    }

    // Show payment methods as icons
    const displayPaymentMethods = () => {

        let buttons;

        if (dropdownMethodGroup) {
            const methods = paymentMethodsList.filter(paymentMethod => dropdownMethodGroup.paymentMethods.some(method => paymentMethod.paymentName === method))

            buttons = methods.map(method => (
                <ButtonIconRound
                    key={method.paymentName}
                    value={method.paymentName}
                    onClick={methodPaymentButtonHandler}
                    style={{ backgroundImage: `url(${method.icon})` }}
                    className={method.paymentName === paymentMethod?.paymentName ? "active" : ""}
                />
            ))
        }

        return (
            <div>
                {buttons}

            </div>
        )
    }

    return (
        <MainCenterLayout>
            <Container>
                <Row>
                    <div className="justify-content-center">

                        <HeadingL >Checkout</HeadingL>
                    </div>

                </Row>

            </Container>

            {productDetails ?
                <CardContainer>
                    <HeadingM>{productDetails.product.name}</HeadingM>
                    <P>
                        {productDetails.price.unit_amount / 100}
                        {" kr"}
                    </P>
                    <P className="mt-2">{productDetails.product.description}</P>
                </CardContainer>
                : null
            }

            <CustomerFields sendCustomer={sendCustomerHandler} user={user} />

            {customerDetails ? <CardContainer>
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
            </CardContainer> : null}

            {clientSecret !== "" && (
                <Elements options={options} stripe={stripePromise}>
                    {(paymentMethod?.paymentName === 'card' && containsMethodGroup('card')) &&
                        <CardCheckoutForm
                            clientSecret={clientSecret}
                            paymentSuccess={paymentSuccess}
                            customer={customerDetails}
                        />}
                    {(paymentMethod?.paymentName === 'sepa' && containsMethodGroup('sepa')) &&
                        <SepaCheckoutForm
                            clientSecret={clientSecret}
                            paymentSuccess={paymentSuccess}
                            customer={customerDetails}
                        />}
                    {(paymentMethod?.paymentName === 'pay' && containsMethodGroup('pay')) &&
                        <PayCheckoutForm
                            clientSecret={clientSecret}
                            paymentSuccess={paymentSuccess}
                            productDetails={productDetails}
                        />}

                </Elements>
            )}



        </MainCenterLayout>
    )
}