import { Link, useParams } from "react-router-dom"
import TwoColumnLayout from "../../components/layouts/TwoColumnLayout";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { HeadingL, HeadingM, P } from "../../components/text/Text";
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

export default function User() {

    const [memberStatus, setMemberStatus] = useState<string>("")

    let accountType = "";
    const { userId } = useParams()
    const { user: contextUser } = useContext(UserContext)
    const [user, setUser] = useState<IUser | null>(null)
    const [showDonationModal, setShowDonationModal] = useState<boolean>(false)

    console.log("user: ", user)

    useEffect(() => {

        const exec = async () => {
            if (userId) {
                const data = await userService.getUserById(userId)
                console.log("data: ", data)
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
                                                {/* <LoginType accountType={accountType} />
                                            <Profile accountType={accountType} /> */}
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
                                                                {/* <P className='mt-2'>{userCreatedAtDate}</P> */}
                                                            </Col>
                                                        </Row>
                                                    </HeadingM>
                                                </Row>
                                                <Row>
                                                    <P>date created at</P>
                                                    {/* <P>{User?.created_at?.split("T")[0]}</P> */}
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

                                                        {/* <Link to="/donations">Gå till donering</Link> */}
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