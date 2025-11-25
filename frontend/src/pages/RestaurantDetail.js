import React, { useState } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import colors from '../theme/colors';
import MenuSection from "../components/MenuSection";

const Container = styled.div`
    max-width: 1400px;
    margin: 0 auto;
`;

const BackButton = styled.button`
    background: ${colors.gradients.primary};
    color: ${colors.text.white};
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    cursor: pointer;
    margin-bottom: 30px;
    font-size: 1em;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: ${colors.shadows.primarySmall};

    &:hover {
        transform: translateY(-2px);
        box-shadow: ${colors.shadows.primaryMedium};
    }
`;

const HeaderSection = styled.div`
    background: ${colors.gradients.primary};
    border-radius: 16px;
    padding: 40px;
    margin-bottom: 30px;
    color: ${colors.text.white};
    box-shadow: ${colors.shadows.medium};
    position: relative;
`;

const EditRestaurantButton = styled.button`
    position: absolute;
    top: 20px;
    right: 20px;
    background: ${colors.overlay.medium};
    color: ${colors.text.white};
    border: 2px solid ${colors.text.white};
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.95em;
    font-weight: 600;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;

    &:hover {
        background: ${colors.text.white};
        color: ${colors.primary.dark};
        transform: translateY(-2px);
        box-shadow: ${colors.shadows.medium};
    }
`;

const RestaurantName = styled.h1`
    font-size: 2.5em;
    margin-bottom: 15px;
    font-weight: 700;
`;

const TagsContainer = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: 20px;
`;

const CuisineTag = styled.span`
    background: ${colors.gradients.accent};
    color: ${colors.text.white};
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 0.95em;
    font-weight: 600;
`;

const Rating = styled.div`
    font-size: 1.3em;
    color: ${colors.accent.gold};
`;

const PriceTag = styled.span`
    background: ${colors.overlay.medium};
    color: ${colors.text.white};
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 0.95em;
    font-weight: 600;
`;

const Description = styled.p`
    font-size: 1.1em;
    line-height: 1.6;
    color: ${colors.primary.light};
`;

const ContentGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
    margin-bottom: 40px;

    @media (max-width: 968px) {
        grid-template-columns: 1fr;
    }
`;

const InfoCard = styled.div`
    background: ${colors.background.card};
    border-radius: 12px;
    padding: 30px;
    box-shadow: ${colors.shadows.medium};
`;

const CardTitle = styled.h2`
    color: ${colors.text.primary};
    font-size: 1.5em;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 3px solid ${colors.accent.orange};
    display: inline-block;
`;

const InfoRow = styled.div`
    display: flex;
    margin: 15px 0;
    align-items: flex-start;
`;

const Label = styled.span`
    font-weight: 600;
    min-width: 140px;
    color: ${colors.text.primary};
    font-size: 1em;
`;

const Value = styled.span`
    color: ${colors.text.secondary};
    flex: 1;
`;


// Mock-Daten bleiben gleich...
const mockRestaurants = [
    {
        id: 1,
        name: "Bella Italia",
        cuisine: "Italienisch",
        address: "Hauptstraße 15, 10115 Berlin",
        phone: "+49 30 12345678",
        email: "info@bella-italia.de",
        rating: 4.5,
        priceRange: "€€",
        openingHours: "Mo-So: 11:00 - 23:00",
        description: "Authentische italienische Küche im Herzen Berlins. Unsere Pizza wird im traditionellen Steinofen gebacken und unsere Pasta ist hausgemacht.",
        specialties: "Pizza, Pasta, Antipasti",
        capacity: 80,
        chef: "Giovanni Rossi",
        gerichte: [
            {
                id: 1,
                name: "Pizza Margherita",
                description: "Klassische Pizza mit Tomatensauce, Mozzarella und frischem Basilikum",
                price: 9.50,
                category: "Hauptgericht"
            },
            {
                id: 2,
                name: "Spaghetti Carbonara",
                description: "Spaghetti mit Speck, Ei, Parmesan und schwarzem Pfeffer",
                price: 12.90,
                category: "Hauptgericht"
            },
            {
                id: 3,
                name: "Tiramisu",
                description: "Italienisches Dessert mit Mascarpone, Löffelbiskuits und Espresso",
                price: 6.50,
                category: "Dessert"
            },
            {
                id: 4,
                name: "Bruschetta",
                description: "Geröstetes Brot mit Tomaten, Knoblauch, Basilikum und Olivenöl",
                price: 7.90,
                category: "Vorspeise"
            }
        ]
    },
    {
        id: 2,
        name: "Sushi Heaven",
        cuisine: "Japanisch",
        address: "Friedrichstraße 42, 10117 Berlin",
        phone: "+49 30 23456789",
        email: "kontakt@sushi-heaven.de",
        rating: 4.8,
        priceRange: "€€€",
        openingHours: "Di-So: 12:00 - 22:00",
        description: "Frisches Sushi und authentische japanische Spezialitäten. Alle Zutaten werden täglich frisch geliefert.",
        specialties: "Sushi, Sashimi, Ramen",
        capacity: 50,
        chef: "Takeshi Yamamoto",
        gerichte: [
            {
                id: 5,
                name: "California Roll",
                description: "Inside-Out-Roll mit Surimi, Avocado und Gurke",
                price: 8.90,
                category: "Sushi"
            },
            {
                id: 6,
                name: "Lachs Sashimi",
                description: "6 Stück frischer norwegischer Lachs",
                price: 14.50,
                category: "Sashimi"
            },
            {
                id: 7,
                name: "Miso Suppe",
                description: "Traditionelle japanische Suppe mit Tofu und Algen",
                price: 4.50,
                category: "Vorspeise"
            }
        ]
    },
];

function RestaurantDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const restaurant = mockRestaurants.find(r => r.id === parseInt(id));

    if (!restaurant) {
        return (
            <Container>
                <BackButton onClick={() => navigate('/restaurants')}>
                    ← Zurück zur Übersicht
                </BackButton>
                <InfoCard>
                    <h2>Restaurant nicht gefunden</h2>
                </InfoCard>
            </Container>
        );
    }

    const handleEditRestaurant = () => {
        navigate(`/restaurants/${id}/edit`);
    };

    return (
        <Container>
            <BackButton onClick={() => navigate('/restaurants')}>
                ← Zurück zur Übersicht
            </BackButton>

            <HeaderSection>
                <EditRestaurantButton onClick={handleEditRestaurant}>
                    Restaurant bearbeiten
                </EditRestaurantButton>

                <RestaurantName>{restaurant.name}</RestaurantName>
                <TagsContainer>
                    <CuisineTag>{restaurant.cuisine}</CuisineTag>
                    <PriceTag>{restaurant.priceRange}</PriceTag>
                    <Rating>⭐ {restaurant.rating} / 5.0</Rating>
                </TagsContainer>
                <Description>{restaurant.description}</Description>
            </HeaderSection>

            <ContentGrid>
                <InfoCard>
                    <CardTitle>📞 Kontakt & Standort</CardTitle>
                    <InfoRow>
                        <Label>📍 Adresse:</Label>
                        <Value>{restaurant.address}</Value>
                    </InfoRow>
                    <InfoRow>
                        <Label>📞 Telefon:</Label>
                        <Value>{restaurant.phone}</Value>
                    </InfoRow>
                    <InfoRow>
                        <Label>✉️ Email:</Label>
                        <Value>{restaurant.email}</Value>
                    </InfoRow>
                    <InfoRow>
                        <Label>👨‍🍳 Küchenchef:</Label>
                        <Value>{restaurant.chef}</Value>
                    </InfoRow>
                </InfoCard>

                <InfoCard>
                    <CardTitle>🕐 Öffnungszeiten & Details</CardTitle>
                    <InfoRow>
                        <Label>🕐 Öffnungszeiten:</Label>
                        <Value>{restaurant.openingHours}</Value>
                    </InfoRow>
                    <InfoRow>
                        <Label>👥 Kapazität:</Label>
                        <Value>{restaurant.capacity} Personen</Value>
                    </InfoRow>
                    <InfoRow>
                        <Label>🍽️ Spezialitäten:</Label>
                        <Value>{restaurant.specialties}</Value>
                    </InfoRow>
                </InfoCard>

            </ContentGrid>
            <MenuSection restaurant={restaurant} />

        </Container>
    );
}

export default RestaurantDetail;