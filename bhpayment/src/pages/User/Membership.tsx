import { useContext, useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { CardContainer } from "../../components/CardContainer";
import { HeadingL, LinkStyled, P, Span } from "../../components/text/Text";
import { ButtonPrim } from "../../components/inputs/Buttons";
import { Link } from "react-router-dom";
import { products } from "../../constants/products"
import { IUser } from "../../models/IUser";



interface Iprops {
	user: IUser | null;
	userParamsId?: string
}

export default function Membership(props: Iprops) {

	const [productMemberId, setProductMemberId] = useState<string>()
	const [productSubscriptionId, setProductSubscriptionId] = useState<string>()
	const [statusText, setStatusText] = useState<string>("")

	useEffect(() => {

		setProductMemberId(products[0].id)
		setProductSubscriptionId(products[1].id)

		if (props.user) {
			console.log("user: ", props.user)
			switch (props.user.type) {
				case "user": setStatusText("Inte medlem"); break;
				case "member":
					if (props.user.dateMemberPaidExpire) {
						const paidDate = props.user.dateMemberPaidExpire.toString().slice(0, 10)
						setStatusText(`Betald medlemsavgift fram till ${(paidDate)}`);
					}
					break;
				case "subscription":
					if (props.user.dateMemberPaidExpire) {
						const paidDate = props.user.dateMemberPaidExpire.toString().slice(0, 10)
						setStatusText(`Prenumererar på medlemskap. Närvarande betalt fram till ${(paidDate)}`);
					}

			}
		}

	}, [props.user])

	console.log("userParamsId: ", props.userParamsId)

	return (
		<>
			<CardContainer>
				<Container className='p-0' fluid>
					<Row>
						<Col style={{ width: "90%" }}>
							<HeadingL>Medlemskap</HeadingL>
						</Col>

					</Row>
					<Row style={{ textAlign: "left" }}>
						<Col>
							<P>
								Som medlem får du tillgång till ett antal fina premiumtjänster, tex bildsökning med ansiktsigenkänning och att hitta bilder på individer i en uppladdad GEDCOM fil.
								<LinkStyled>
									Läs mer.
								</LinkStyled>.
								{" "}
								Betald årsavgift (eller påbörjad prenumeration) ger medlemskap till 31 december innevarande år. Om du betalar avgiften i november eller december, sträcker sig medlemsskapet till 31 dec nästkommande år.
							</P>

						</Col>
					</Row>

					<Row style={{ paddingBottom: "15px", paddingTop: "30px" }}>
						<Col>
							<P>
								<Span>Medlemstatus</Span>
								{": "}
								<strong>{statusText}</strong>
							</P>
						</Col>

					</Row>
					{props.user && props.user.type !== "subscription" && props.user.id === props.userParamsId ? <Row className="py-3">
						<Col className="col-12">
							<div className="d-flex ">
								<ButtonPrim >
									<Link to={`/checkout/${productMemberId}`}>
										{props.user.type === 'member'
											?
											"Betala medlemsavgift för ytterligare ett år"
											:
											"Betala medlemsavgift för ett år"

										}
									</Link>
								</ButtonPrim>
								<ButtonPrim className="mx-2">
									<Link to={`/checkout/${productSubscriptionId}`}>
										Prenumerera (årlig debitering)
									</Link>
								</ButtonPrim>

							</div>
						</Col>

					</Row> : null}
				</Container>
			</CardContainer>

			<CardContainer>
				<Container className='p-0' fluid>
					<Row>
						<Col style={{ width: "90%" }}>
							<HeadingL>Dina betalningsmetoder och tidigare fakturor</HeadingL>
						</Col>

					</Row>
					<Row>
						<P>På din betalningsportal kan du se din faktureringshistorik, uppdatera dina betalningsuppgifter och kortnummer, samt lägga till kontaktuppgifter så att vi kontakta dig kring eventuell problem med din betalning.</P>
						<P className="pt-3 pb-5">
							<LinkStyled>
								Gå till min betalningsportal
							</LinkStyled>
						</P>
					</Row>
				</Container>
			</CardContainer>


		</>
	);
}
