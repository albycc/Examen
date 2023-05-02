import React, { useState } from "react"
import Container from "react-bootstrap/Container"
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
import Form from "react-bootstrap/Form"
import { IBillingDetails } from "../../models/Checkout"
import { CardContainer } from "../../components/CardContainer"
import { ButtonPrim, ButtonPrimDisabled } from "../../components/inputs/Buttons"
import { Button } from "../../components/inputs/Buttons"

interface Iprops {
    customerDetails?: IBillingDetails;
    sendCustomer: (customerDetails: IBillingDetails) => void
}

const CustomerFields = (props: Iprops) => {

    const [customerDetails, setCustomerDetails] = useState<IBillingDetails>(
        {
            email: "",
            name: "",
            phone: ""
        })

    const buttonEnabled = () => {

        return !Object.values(customerDetails).every(value => value.length > 0)
    }

    const buttonHandler = () => {
        props.sendCustomer(customerDetails)

    }

    console.log(customerDetails)

    return (
        <CardContainer>
            <Row>
                <Form.Group>
                    <Form.Label>Namn</Form.Label>
                    <Form.Control type="text" placeholder="Namn" onInput={(event: React.ChangeEvent<HTMLInputElement>) => setCustomerDetails({ ...customerDetails, name: event.target.value })}></Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="Email" onInput={(event: React.ChangeEvent<HTMLInputElement>) => setCustomerDetails({ ...customerDetails, email: event.target.value })} ></Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Telefon</Form.Label>
                    <Form.Control type="tel" placeholder="Telefon" onInput={(event: React.ChangeEvent<HTMLInputElement>) => setCustomerDetails({ ...customerDetails, phone: event.target.value })}></Form.Control>

                </Form.Group>
            </Row>
            <Row>
                <Button onClick={buttonHandler} disabled={buttonEnabled()}>Nästa</Button>


            </Row>

        </CardContainer>
    )
}

export default CustomerFields;