import React, { useEffect, useState } from "react"
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
    disableFields?: boolean;
}

const CustomerFields = (props: Iprops) => {

    const [customerDetails, setCustomerDetails] = useState<IBillingDetails>(
        {
            email: "",
            name: ""
        })
    const [disableForm, setDisableForm] = useState<boolean>(false)

    useEffect(() => {
        if (props.disableFields) {
            setDisableForm(props.disableFields)

        }

    }, [props.disableFields])

    const buttonHandler = () => {
        props.sendCustomer(customerDetails)
        setDisableForm(true)

    }

    const disable = () => {

        return !Object.values(customerDetails).every(value => value)
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
                    disabled={disableForm}
                />
                <FieldInput
                    type="email"
                    label="Email"
                    placeholder="Email"
                    onInput={(event: React.ChangeEvent<HTMLInputElement>) => setCustomerDetails({ ...customerDetails, email: event.target.value })}
                    disabled={disableForm}
                />

            </Row>
            <Row>
                <Col className="mt-3 d-flex justify-content-end">
                    <Button type="button" onClick={buttonHandler} disabled={disable() || disableForm}>Nästa</Button>

                </Col>


            </Row>

        </CardContainer>
    )
}

export default CustomerFields;