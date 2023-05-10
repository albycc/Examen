import { Form } from "react-bootstrap"
import { CardContainer } from "../../components/CardContainer"
import FieldInput from "../../components/forms/FieldInput"
import { useContext, useState } from "react";
import { Button } from "../../components/inputs/Buttons";
import { IUserRegister } from "../../models/IUser";
import { userService } from "../../service/userService";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";


const RegisterUserForm = () => {
    const [userForm, setUserForm] = useState<IUserRegister>({ name: "", email: "", password: "" })
    const { setUserState } = useContext(UserContext)
    const navigate = useNavigate()

    const registerUserHandler = async (event: React.FormEvent) => {
        event.preventDefault()

        const user = await userService.registerUser(userForm)

        if (user) {
            await setUserState(user)
            navigate(`/user/${user.id}`)


        }



        console.log(userForm)
    }

    const disable = () => {
        return !Object.values(userForm).every(value => value !== "")
    }


    return (
        <CardContainer>
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