import React, { forwardRef } from "react"
import Form from "react-bootstrap/Form";

interface Iprops {
    type: string;
    label?: string;
    id?: string;
    name?: string;
    placeholder?: string;
    onInput?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    value?: string;
    defaultValue?: string;
}

const FieldInput = forwardRef<HTMLInputElement, Iprops>((props, ref) => {

    return (
        <Form.Group>
            <Form.Label htmlFor={props.id}>{props.label}</Form.Label>
            <Form.Control
                ref={ref}
                type={props.type}
                id={props.id}
                name={props.name}
                placeholder={props.placeholder}
                onInput={props.onInput}
                onChange={props.onChange}
                disabled={props.disabled}
                value={props.value}
                defaultValue={props.defaultValue}
            />
            <Form.Text></Form.Text>
        </Form.Group>
    )
})

export default FieldInput