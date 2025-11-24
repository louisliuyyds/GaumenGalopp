import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import colors from '../theme/colors';

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

const RestaurantGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 25px;
    margin-top: 20px;
`;

const RestaurantCard = styled.div`
    background: ${colors.background.card};
    border-radius: 12px;
    padding: 25px;
    box-shadow: ${colors.shadows.medium};
    cursor: pointer;
    transition: all 0.3s ease;
    border: 2px solid transparent;

    &:hover {
        transform: translateY(-8px);
        box-shadow: ${colors.shadows.large};
        border-color: ${colors.accent.orange};
    }
`;

const RestaurantName = styled.h2`
    color: ${colors.text.primary};
    margin-bottom: 15px;
    font-size: 1.6em;
    font-weight: 600;
`;

const RestaurantInfo = styled.p`
    color: ${colors.text.light};
    margin: 8px 0;
    font-size: 0.95em;
    display: flex;
    align-items: center;
    gap: 8px;
`;

const RestaurantType = styled.span`
    display: inline-block;
    background: ${colors.gradients.accent};
    color: ${colors.text.white};
    padding: 6px 14px;
    border-radius: 15px;
    font-size: 0.85em;
    margin-top: 10px;
    font-weight: 600;
`;

const Rating = styled.div`
    color: ${colors.accent.gold};
    font-size: 1.2em;
    margin-top: 12px;
    font-weight: 600;
`;

const mockRestaurants = [
    {
        id: 1,
        name: "Bella Italia",
        cuisine: "Italienisch",
        address: "Hauptstraße 15, Berlin",
        rating: 4.5,
        priceRange: "€€",
    },
    {
        id: 2,
        name: "Sushi Heaven",
        cuisine: "Japanisch",
        address: "Friedrichstraße 42, Berlin",
        rating: 4.8,
        priceRange: "€€€",
    },
    {
        id: 3,
        name: "Burger Palace",
        cuisine: "Amerikanisch",
        address: "Alexanderplatz 8, Berlin",
        rating: 4.2,
        priceRange: "€",
    },
    {
        id: 4,
        name: "La Petite France",
        cuisine: "Französisch",
        address: "Unter den Linden 23, Berlin",
        rating: 4.7,
        priceRange: "€€€€",
    },
    {
        id: 5,
        name: "Taj Mahal",
        cuisine: "Indisch",
        address: "Kurfürstendamm 99, Berlin",
        rating: 4.4,
        priceRange: "€€",
    },
    {
        id: 6,
        name: "Dragon Wok",
        cuisine: "Chinesisch",
        address: "Potsdamer Platz 5, Berlin",
        rating: 4.3,
        priceRange: "€€",
    },
];

function Restaurants() {
    const navigate = useNavigate();

    const handleRestaurantClick = (id) => {
        navigate(`/restaurants/${id}`);
    };

    return (
        <Container>
            <Header>Unsere Ultra High Quality Arschgeilen Restaurants</Header>
            <RestaurantGrid>
                {mockRestaurants.map((restaurant) => (
                    <RestaurantCard
                        key={restaurant.id}
                        onClick={() => handleRestaurantClick(restaurant.id)}
                    >
                        <RestaurantName>{restaurant.name}</RestaurantName>
                        <RestaurantType>{restaurant.cuisine}</RestaurantType>
                        <RestaurantInfo>📍 {restaurant.address}</RestaurantInfo>
                        <RestaurantInfo>💰 {restaurant.priceRange}</RestaurantInfo>
                        <Rating>⭐ {restaurant.rating}</Rating>
                    </RestaurantCard>
                ))}
            </RestaurantGrid>
        </Container>
    );
}

export default Restaurants;