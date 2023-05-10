import { Container } from "react-bootstrap"
import { NavigationBarStyled } from "./NavigationStyles"
import Navbar from "react-bootstrap/Navbar"
import Image from "react-bootstrap/Image";
import logoIcon from "./images/logo.png"
import userIcon from "./images/user.svg"
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { Button } from "../inputs/Buttons";

const NavigationBar = () => {
    const { user, setUserState } = useContext(UserContext)
    const navigate = useNavigate()

    const logoutButtonHandler = () => {
        setUserState(null)
        navigate("/")


    }
    return (
        <NavigationBarStyled>
            <Container>
                <Navbar>
                    <Link to="/">
                        <Image src={logoIcon} height={45} />

                    </Link>
                    {user !== null ?

                        <div>
                            <Link to={`/user/${user.id}`} className="px-2">
                                <Image src={userIcon} width={35} />
                            </Link>
                            <Button onClick={logoutButtonHandler}>Logga ut</Button>

                        </div>

                        :
                        <Link to="/login">Logga in</Link>
                    }
                </Navbar>
            </Container>
        </NavigationBarStyled>
    )
}

export default NavigationBar