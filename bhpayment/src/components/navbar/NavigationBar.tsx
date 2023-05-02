import { Container } from "react-bootstrap"
import { NavigationBarStyled } from "./NavigationStyles"
import Navbar from "react-bootstrap/Navbar"
import Image from "react-bootstrap/Image";
import logo from "./images/logo.png"

const NavigationBar = () => {
    return (
        <NavigationBarStyled>
            <Container>
                <Navbar>
                    <Image src={logo} />
                </Navbar>
            </Container>
        </NavigationBarStyled>
    )
}

export default NavigationBar