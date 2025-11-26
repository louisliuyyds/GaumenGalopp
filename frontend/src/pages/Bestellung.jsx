import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import colors from '../theme/colors';
import {bestellpositionService, bestellungService} from "../services";

const Container = styled.div`
    max-width: 1400px;
    margin: 0 auto;
`;

const Header = styled.h1`
    color: ${colors.text.primary};
    margin-bottom: 30px;
    font-size: 2.5em;
    font-weight: 700;
`;

const Bestellposition = styled.div`
    background: ${colors.background.card};
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: ${colors.shadows.medium};
    border: 2px solid transparent;
    transition: 0.3s;
`;

const BestellpositionHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const BestellpositionName = styled.h2`
    color: ${colors.text.primary};
    margin-bottom: 10px;
    font-size: 1.4em;
    font-weight: 600;
`;

const Preis = styled.div`
    color: ${colors.accent.orange};
    font-size: 1.2em;
    font-weight: 700;
`;

const Beschreibung = styled.p`
color: ${colors.text.light};
margin-top: 10px;
font-size: 0.95em;
`;


const Aenderungen = styled.div`
margin-top: 8px;
font-size: 0.9em;
color: ${colors.text.secondary};
font-style: italic;
`;


const Menge = styled.div`
margin-top: 10px;
font-size: 1em;
color: ${colors.text.primary};
font-weight: 600;
`;

const AdresseContainer = styled.div`
    margin-top: 20px;
    padding: 20px;
    background: ${colors.background.card};
    border-radius: 12px;
    box-shadow: ${colors.shadows.medium};
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const AdresseHeader = styled.h2`
    font-size: 1.4em;
    font-weight: 700;
    margin-bottom: 10px;
    color: ${colors.text.primary};
`;

const AdresseLine = styled.div`
font-size: 1.2em;
color: ${colors.text.primary};
`;

const Footer = styled.div`
margin-top: 30px;
padding: 20px;
background: ${colors.background.card};
border-radius: 12px;
box-shadow: ${colors.shadows.medium};
display: flex;
justify-content: space-between;
align-items: center;
`;


const TotalText = styled.span`
font-size: 1.4em;
font-weight: 700;
color: ${colors.text.primary};
`;


const BestellButton = styled.button`
background: ${colors.accent.orange};
color: white;
padding: 12px 25px;
border: none;
border-radius: 10px;
cursor: pointer;
font-size: 1em;
font-weight: 600;
transition: 0.3s;
&:hover {
background: ${colors.accent.black};
}
`;

function Bestellung() {
    // const [bestellung, setBestellung] = useState([]);
    // const [bestellpositionen, setBestellpositionen] = useState([]);
    // const [adresse, setAdresse] = useState(null);
    // useEffect(() => {
    //     const loadData = async () => {
    //         try {
    //             const bestellpositionen = await bestellpositionService.getByBestellung()
    //             setBestellpositionen(bestellpositionen);
    //
    //             const bestellung = await bestellungService.getTotal();
    //             setBestellung(bestellung)

    // if (b.adressId) {
    //     const adr = await adressService.getById(b.adressId);
    //     setAdresse(adr);
    // }

    //         }catch(err) {
    //             console.error('Backend error:', err);
    //         }
    //     };
    //     loadData();
    //
    // }, []);
    const [cart, setCart] = useState([
        {
            id: 1,
            name: 'Pasta Carbonara',
            price: 12.5,
            amount: 2,
            notes: 'Extra Käse',
            description: 'Cremige italienische Pasta mit Speck und Parmesan.'
        },
        {
            id: 2,
            name: 'Margherita Pizza',
            price: 10,
            amount: 1,
            notes: 'Extra knusprig',
            description: 'Klassische Pizza mit Tomatensoße, Mozzarella und Basilikum.'
        }
    ]);

    const total = cart.reduce((sum, item) => sum + item.price * item.amount, 0);

    return (
        <Container>
            <Header>Deine Bestellung</Header>


            {cart.map(item => (
                <Bestellposition key={item.id}>
                    <BestellpositionHeader>
                        <BestellpositionName>{item.name}</BestellpositionName>
                        <Preis>€{item.price.toFixed(2)}</Preis>
                    </BestellpositionHeader>


                    <Beschreibung>{item.description}</Beschreibung>
                    <Aenderungen>Änderungen: {item.notes}</Aenderungen>
                    <Menge>Menge: {item.amount}</Menge>
                </Bestellposition>
            ))}


            <Footer>
                <TotalText>Gesamt: €{total.toFixed(2)}</TotalText>
                <BestellButton>Jetzt bestellen</BestellButton>
            </Footer>

            <AdresseContainer>
                <AdresseHeader>Lieferadresse:</AdresseHeader>
                <AdresseLine>Straße 12</AdresseLine>
                <AdresseLine>12345 Hamburg</AdresseLine>
                <AdresseLine>Deutschland</AdresseLine>
            </AdresseContainer>

        </Container>
    );
}
export default Bestellung;
