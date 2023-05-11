import { Form } from "react-bootstrap"
import { CardContainer } from "../../components/CardContainer"
import FieldInput from "../../components/forms/FieldInput"
import { useContext, useState } from "react";
import { Button } from "../../components/inputs/Buttons";
import { IUserRegister } from "../../models/IUser";
import { userService } from "../../service/userService";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { FormMessageError } from "../../components/forms/FormMessage";

/*
Simple form for registering new members.

*/

const RegisterUserForm = () => {
    const [userForm, setUserForm] = useState<IUserRegister>({ name: "", email: "", password: "" })
    const { setUserState } = useContext(UserContext)
    const navigate = useNavigate()
    const [errorMessage, setErrorMessage] = useState<string>("")

    const registerUserHandler = async (event: React.FormEvent) => {
        event.preventDefault()

        const user = await userService.registerUser(userForm)


        if (user.message === "user-already-exists") {
            setErrorMessage("Användare med sån mejl finns redan")
            return;
        } else if (user) {
            await setUserState(user)
            setErrorMessage("")
            navigate(`/user/${user.id}`)

        }
    }

    //make sure every field has a value before submit button can be enabled
    const disable = () => {
        return !Object.values(userForm).every(value => value !== "")
    }

    return (
        <CardContainer>
            {errorMessage ?
                <FormMessageError>
                    {errorMessage}

                </FormMessageError>
                :
                null
            }
            <Form onSubmit={registerUserHandler}>
                <FieldInput
                    type="text"
                    label="Name"
                    placeholder="Bert Bertilsson"
                    onInput={(event: React.ChangeEvent<HTMLInputElement>) => setUserForm({ ...userForm, name: event.target.value })}
                />
                <FieldInput
                    type="email"
                    label="Email"
                    placeholder="testsson@mail.com"
                    onInput={(event: React.ChangeEvent<HTMLInputElement>) => setUserForm({ ...userForm, email: event.target.value })}
                />
                <FieldInput
                    type="password"
                    label="Lösenord"
                    placeholder="●●●●●●●●"
                    onInput={(event: React.ChangeEvent<HTMLInputElement>) => setUserForm({ ...userForm, password: event.target.value })}
                />
                <Button type="submit" disabled={disable()}>Registrera</Button>
            </Form>

        </CardContainer>
    )
}

export default RegisterUserForm