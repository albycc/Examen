import { Link } from "react-router-dom";
import MainCenterLayout from "../../components/layouts/CenterLayout";
import { HeadingL, HeadingM, P } from "../../components/text/Text";
import { CardContainer } from "../../components/CardContainer";
import { useState } from "react";
import { ButtonLink } from "../../components/inputs/Links";
import DonationWindow from "../User/DonationWindow";

/*
Home component for main page

Not much to see here, except for donation.

Wanted to add donation feature here so you don't have to go to users page to do that.

*/
export default function Home() {

    const [showDonationModal, setShowDonationModal] = useState<boolean>(false)
    return (
        <MainCenterLayout>
            <HeadingL align="center">Välkommen till Bildhistoria!</HeadingL>
            <CardContainer>
                <P className="my-2">
                    Föreningen Svenskt Porträttarkiv har under många år digitaliserat hundratusentals historiska porträttbilder, fastighetsbilder och gruppfoton ur böcker och privata samlingar. Många av bilderna är dessutom försedda med beskrivningar kring motiv och personens biografi. Dessutom kan medlemmar och icke-medlemmar  bidra med sina privata fotografiska samlingar.
                </P>
                <P className="my-2">
                    Föreningens nuvarande plattform (portrattarkiv.se) stödjer endast porträttbilder och måste utvecklas till att visa olika typer av historisk fotografi och att möjliggöra för användare att beskriva innehållet i bilder, tex personer, fastigheter, organisationer, platser och händelser.
                </P>
                <P className="my-2">
                    Bildhistoria.se – som kommer att lanseras under 2023 och som är tänkt att ersätta porträttarkiv.se – kommer att bli nordens största community för privat- och lokal-historiska fotografier. Vi vänder oss till privatpersoner, hembygdsföreningar och lokalhistoriska föreningar som vill beskriva sin historia genom fotografier.
                </P>
                <P>
                    Vill du hjälpa oss att bli bättre? Donera pengar till föreningen idag!
                </P>
                <ButtonLink onClick={() => setShowDonationModal(true)}>Donera pengar</ButtonLink>


            </CardContainer>
            <DonationWindow show={showDonationModal} cancel={() => setShowDonationModal(false)} />
        </MainCenterLayout>
    )
}