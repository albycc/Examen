import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { CardContainer } from "../../components/CardContainer";
import { HeadingL, LinkStyled, P, Span } from "../../components/text/Text";
import { products } from "../../constants/products"
import { IUser } from "../../models/IUser";
import { LinkButton } from "../../components/inputs/Links";

/*
Membership component 

Displays content for member status/payments

Here you can become member for the site, either through membership or subscription. One button for each.

Memberstatus will display for members of site

Customers were supposed to direct to Stripes customer portal to change payment methods, but this feature was out of scope in this job.

*/

interface Iprops {
	user: IUser | null;
	userParamsId?: string
}

export default function Membership(props: Iprops) {

	const [productMemberId, setProductMemberId] = useState<string>()
	const [productSubscriptionId, setProductSubscriptionId] = useState<string>()
	const [statusText, setStatusText] = useState<string>("")

	useEffect(() => {

		//sets different status text for user/members.

		setProductMemberId(products[0].id)
		setProductSubscriptionId(products[1].id)

		if (props.user) {
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
					{props.user && props.user.type !== "subscription" ? <Row className="py-3">
						<Col className="col-12">
							<div className="d-flex ">
								<LinkButton to={`/checkout/${productMemberId}`} className="mx-2">
									{props.user.type === 'member'
										?
										"Betala medlemsavgift för ytterligare ett år"
										:
										"Betala medlemsavgift för ett år"

									}
								</LinkButton>
								<LinkButton to={`/checkout/${productSubscriptionId}`} className="mx-2">
									Prenumerera (årlig debitering)
								</LinkButton>

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
