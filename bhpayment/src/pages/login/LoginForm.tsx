import { Form } from "react-bootstrap"
import { CardContainer } from "../../components/CardContainer"
import FieldInput from "../../components/forms/FieldInput"
import { Button } from "../../components/inputs/Buttons"
import { useContext, useState } from "react"
import { userService } from "../../service/userService"
import { FormMessageError } from "../../components/forms/FormMessage"
import { useNavigate } from "react-router-dom"
import { IUser } from "../../models/IUser"
import { UserContext } from "../../context/UserContext"

/*
Simple form for logging in user.

*/
const LoginForm = () => {

    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [errorMessage, setErrorMessage] = useState<string>("")
    const navigate = useNavigate()
    const { setUserState } = useContext(UserContext)

    const loginButtonHandler = async (event: React.FormEvent) => {
        event.preventDefault();
        const response = await userService.login(email, password)

        //does user already exist with that email?
        if (response.message === "user-already-exists") {
            setErrorMessage("Finns ingen sån användare")
            return;
        }
        //...or incorrect password?
        else if (response.message === "incorrect-password") {
            setErrorMessage("Fel lösenord")
            return;
        }
        //loggs in user
        else {
            const user: IUser = await userService.getUserByEmail(email)
            setErrorMessage("")
            await setUserState(user)

            navigate(`/user/${user.id}`)

        }

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
            <Form onSubmit={loginButtonHandler}>
                <FieldInput
                    type="email"
                    label="Email"
                    placeholder="testsson@mail.com"
                    onInput={(event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}

                />
                <FieldInput
                    type="password"
                    label="Lösenord"
                    placeholder="●●●●●●●●"
                    onInput={(event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}

                />
                <Button type="submit" disabled={email === "" || password === ""}>Logga in</Button>
            </Form>

        </CardContainer>
    )
}

export default LoginForm