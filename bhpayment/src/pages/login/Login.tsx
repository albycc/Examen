import { Link } from "react-router-dom";
import { CardContainer } from "../../components/CardContainer";
import { Form } from "react-bootstrap";
import MainCenterLayout from "../../components/layouts/CenterLayout";
import Tab from "react-bootstrap/Tab";
import { NavContainer, NavLink } from "../User/stylings/UserStyles";
import Col from "react-bootstrap/Col";
import NavItem from "react-bootstrap/NavItem";
import { P } from "../../components/text/Text";
import FieldInput from "../../components/forms/FieldInput";
import { Button } from "../../components/inputs/Buttons";
import LoginForm from "./LoginForm";
import RegisterUserForm from "./RegisterUserForm";

export default function Home() {

    return (
        <MainCenterLayout>
            <h1>home</h1>
            <Tab.Container defaultActiveKey='login'>
                <NavContainer variant='tabs'>
                    <Col className='col-auto '>
                        <NavItem>
                            <NavLink eventKey='login'>
                                Logga in
                            </NavLink>
                        </NavItem>
                    </Col>
                    <Col className='col-auto'>
                        <NavItem>
                            <NavLink eventKey='register'>
                                Registrera
                            </NavLink>
                        </NavItem>
                    </Col>
                </NavContainer>
                <Tab.Content className='px-0  py-0'>
                    <Tab.Pane eventKey='login'>
                        <LoginForm />

                    </Tab.Pane>
                    <Tab.Pane eventKey='register'>
                        <RegisterUserForm />
                    </Tab.Pane>

                </Tab.Content>
            </Tab.Container>

        </MainCenterLayout>
    )
}