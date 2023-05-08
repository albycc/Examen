import React, { useState } from "react"
import Container from "react-bootstrap/Container"
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
import Form from "react-bootstrap/Form"
import { IBillingDetails } from "../../models/ICheckout"
import { CardContainer } from "../../components/CardContainer"
import { ButtonPrim, ButtonPrimDisabled } from "../../components/inputs/Buttons"
import { Button } from "../../components/inputs/Buttons"
import FieldInput from "../../components/forms/FieldInput"

interface Iprops {
    customerDetails?: IBillingDetails;
    sendCustomer: (customerDetails: IBillingDetails) => void;
    disableFields: boolean;
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
                <FieldInput
                    type="text"
                    label="Namn"
                    placeholder="Namn"
                    onInput={(event: React.ChangeEvent<HTMLInputElement>) => setCustomerDetails({ ...customerDetails, name: event.target.value })}
                    disabled={props.disableFields}
                />
                <FieldInput
                    type="email"
                    label="Email"
                    placeholder="Email"
                    onInput={(event: React.ChangeEvent<HTMLInputElement>) => setCustomerDetails({ ...customerDetails, email: event.target.value })}
                    disabled={props.disableFields}
                />
                <FieldInput
                    type="tel"
                    label="Tel"
                    placeholder="Tel"
                    onInput={(event: React.ChangeEvent<HTMLInputElement>) => setCustomerDetails({ ...customerDetails, phone: event.target.value })}
                    disabled={props.disableFields}
                />

            </Row>
            <Row>
                <Button type="button" onClick={buttonHandler} disabled={buttonEnabled()}>Nästa</Button>


            </Row>

        </CardContainer>
    )
}

export default CustomerFields;