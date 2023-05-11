import Modal from "react-bootstrap/Modal"
import { ModalWindow } from "../../components/modal/ModalWindow"
import { HeadingL, P } from "../../components/text/Text"
import Form from "react-bootstrap/Form";
import { Button, ButtonOption, ButtonSec } from "../../components/inputs/Buttons";
import { useState } from "react";
import { products } from "../../constants/products";
import { useNavigate } from "react-router-dom";

/*
Donation window

a modal window for donating money. From 100 to 2000 kr. 

Navigates to checkout when user accepts

*/

interface Iprops {
    show: boolean;
    cancel: () => void
}

const DonationWindow = (props: Iprops) => {

    const [donationChosen, setDonationChosen] = useState<string>("");
    const navigate = useNavigate()

    const donationButtonChangeHandler = (event: any) => {
        setDonationChosen(event.target.value)
    }

    const buttonSubmitHandler = async (event: React.FormEvent) => {
        event.preventDefault()

        let productId: string = "";

        switch (donationChosen) {
            case "100": productId = products[2].id; break;
            case "200": productId = products[3].id; break;
            case "300": productId = products[4].id; break;
            case "400": productId = products[5].id; break;
            case "500": productId = products[6].id; break;
            case "1000": productId = products[7].id; break;
            case "2000": productId = products[8].id; break;
        }
        navigate(`/checkout/${productId}`)

    }
    return (
        <ModalWindow show={props.show}>
            <Modal.Header>
                <Modal.Title>
                    <HeadingL>Välj summa donation</HeadingL>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onChange={donationButtonChangeHandler} onSubmit={buttonSubmitHandler}>
                    <div className="d-flex flex-wrap">
                        <ButtonOption text={'100 kr'} id="100" name="donation" value="100" />
                        <ButtonOption text={'200 kr'} id="200" name="donation" value="200" />
                        <ButtonOption text={'300 kr'} id="300" name="donation" value="300" />
                        <ButtonOption text={'400 kr'} id="400" name="donation" value="400" />
                        <ButtonOption text={'500 kr'} id="500" name="donation" value="500" />
                        <ButtonOption text={'1000 kr'} id="1000" name="donation" value="1000" />
                        <ButtonOption text={'2000 kr'} id="2000" name="donation" value="2000" />
                    </div>
                    <div className="d-flex justify-content-center">
                        <Button type="submit">Donera</Button>
                        <ButtonSec onClick={() => props.cancel()}>Avbryt</ButtonSec>
                    </div>

                </Form>
            </Modal.Body>
        </ModalWindow>
    )
}

export default DonationWindow;