import { Link, useParams } from "react-router-dom"
import TwoColumnLayout from "../../components/layouts/TwoColumnLayout";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { HeadingL, HeadingM, P, Span } from "../../components/text/Text";
import Tab from "react-bootstrap/Tab";
import { NavContainer, NavLink } from "./stylings/UserStyles";
import { NavItem } from "react-bootstrap";
import Membership from "./Membership";
import { CardContainer } from "../../components/CardContainer";
import { useContext, useEffect, useState } from "react";
import { userService } from "../../service/userService";
import { UserContext } from "../../context/UserContext";
import { IUser } from "../../models/IUser";
import DonationWindow from "./DonationWindow";
import { Button } from "../../components/inputs/Buttons";
import { ButtonLink } from "../../components/inputs/Links";


/*
User component 

User by router /user

Displays the sites user with info and member status.
Here you can become member or to donate money.

Have two tabs for displaying user info and member/payments.

You can also donate money here, by clicking donate button and a modal will show up, displaying sum for donation.

*/
export default function User() {

    const { userId } = useParams() //grab users id from url
    const { user: contextUser } = useContext(UserContext) //grab stored user from react context. This is a logged in user
    const [user, setUser] = useState<IUser | null>(null) //value for user. Used for displaying the users stats
    const [showDonationModal, setShowDonationModal] = useState<boolean>(false) //show donation modal window

    useEffect(() => {

        //get user from server

        const exec = async () => {
            if (userId) {
                const data = await userService.getUserById(userId)
                setUser(data)
            }
        }
        exec()

    }, [])

    return (
        <>
            <TwoColumnLayout>
                <Container fluid>
                    <HeadingL>
                        {user?.name}
                        {" "}
                        konto
                    </HeadingL>
                    <Row>
                        <Col >
                            <Tab.Container defaultActiveKey='profile'>
                                {userId === contextUser?.id ? <NavContainer variant='tabs'>
                                    <Col className='col-auto '>
                                        <NavItem>
                                            <NavLink eventKey='profile'>
                                                Profil och inloggning
                                            </NavLink>
                                        </NavItem>
                                    </Col>
                                    <Col className='col-auto'>
                                        <NavItem>
                                            <NavLink eventKey='payment'>
                                                Medlemskap & betalningar
                                            </NavLink>
                                        </NavItem>
                                    </Col>
                                </NavContainer> : null}
                                <Row>
                                    <Col xs={12} lg={8}>
                                        <Tab.Content className='px-0  py-0'>
                                            <Tab.Pane eventKey='profile'>
                                                <CardContainer>
                                                    <HeadingM>Användaruppgifter</HeadingM>
                                                    <Container fluid className="px-0">
                                                        <Row className="my-3">
                                                            <Col xl={2}>
                                                                <strong>Epostadress</strong>
                                                            </Col>
                                                            <Col xl={10}>
                                                                <span>{user?.email}</span>

                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col xl={2}>
                                                                <strong>Visningsnamn</strong>
                                                            </Col>
                                                            <Col xl={10}>
                                                                <span>{user?.name}</span>

                                                            </Col>

                                                        </Row>
                                                    </Container>

                                                </CardContainer>
                                            </Tab.Pane>
                                            <Tab.Pane eventKey='payment'>
                                                <Membership user={user} userParamsId={userId} />
                                            </Tab.Pane>

                                        </Tab.Content>

                                    </Col>
                                    <Col xs={12} lg={4}>
                                        <CardContainer>
                                            <Container className='p-0' style={{ height: "84px" }} fluid>
                                                <Row>
                                                    <HeadingM>
                                                        <Row>
                                                            <Col>
                                                                Användare skapad{" "}
                                                            </Col>
                                                        </Row>
                                                    </HeadingM>
                                                </Row>
                                                <Row>
                                                    <P>
                                                        {user?.dateCreated?.toString().split("T")[0]}

                                                    </P>
                                                </Row>
                                            </Container>
                                        </CardContainer>
                                        <CardContainer>
                                            <Container className='p-0' fluid>
                                                <Row>
                                                    <HeadingM>
                                                        Hjälp oss att hålla Bildhistoria levande genom donation
                                                    </HeadingM>
                                                </Row>
                                                <Row>
                                                    <P>
                                                        Förutom medlemskap kan du donera pengar till vår verksamhet.{" "}

                                                        <ButtonLink onClick={() => setShowDonationModal(true)}>Donera pengar</ButtonLink>

                                                    </P>


                                                </Row>

                                            </Container>
                                        </CardContainer>

                                    </Col>
                                </Row>

                            </Tab.Container>

                        </Col>

                    </Row>

                </Container>


            </TwoColumnLayout>
            <DonationWindow show={showDonationModal} cancel={() => setShowDonationModal(false)} />
        </>
    )
}