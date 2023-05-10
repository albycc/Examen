import Button from "react-bootstrap/Button";
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

export default function User() {

    const [memberStatus, setMemberStatus] = useState<string>("")

    let accountType = "";
    const { userId } = useParams()
    const { user: contextUser } = useContext(UserContext)
    const [user, setUser] = useState<IUser | null>(null)

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
        <TwoColumnLayout>
            <Container fluid>
                <Row>
                    <Col >
                        <HeadingL>
                            Mitt konto
                        </HeadingL>
                        <Tab.Container defaultActiveKey='profile'>
                            <NavContainer variant='tabs'>
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
                            </NavContainer>
                            <Row>
                                <Col xs={12} lg={8}>
                                    <Tab.Content className='px-0  py-0'>
                                        <Tab.Pane eventKey='profile'>
                                            <CardContainer></CardContainer>
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

                                                    <Link to="/donations">Gå till donering</Link>
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
    )
}