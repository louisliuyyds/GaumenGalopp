import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import colors from '../theme/colors';
import {restaurantService} from "../services";

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

function Restaurants() {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    // Navigation zur Edit-Seite mit der Restaurant-ID
    const handleEditRestaurant = (restaurantid) => {
        navigate(`/restaurants/${restaurantid}/edit`);
    };

    //Al the functions that handle updating the Data
    const fetchRestaurants = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await restaurantService.getAll();
            setRestaurants(data);
            console.log('Restaurants geladen:', data);
        } catch (err) {
            console.error('Fehler beim Laden:', err);
            setError('Fehler beim Laden der Restaurants. Bitte versuchen Sie es später erneut.');
        } finally {
            setLoading(false);
        }
    };

    // Beim ersten Laden ausführen
    useEffect(() => {
        fetchRestaurants();
    }, []);

    // Restaurant löschen
    const handleDelete = async (id, name) => {
        if (window.confirm(`Möchten Sie das Restaurant "${name}" wirklich löschen?`)) {
            try {
                await restaurantService.delete(id);
                console.log('Restaurant gelöscht:', id);
                // Liste neu laden
                await fetchRestaurants();
            } catch (err) {
                console.error('Fehler beim Löschen:', err);
                alert('Fehler beim Löschen des Restaurants');
            }
        }
    };

    // Anzeige während des Ladens
    if (loading) {
        return (
            <Container>
                <div>Lade Restaurants...</div>
            </Container>
        );
    }

    // Fehleranzeige
    if (error) {
        return (
            <Container>
                <div>{error}</div>
                <button onClick={fetchRestaurants}>
                    Erneut versuchen
                </button>
            </Container>
        );
    }

    return (
        <Container>
            <Header>Unsere Ultra High Quality Arschgeilen Restaurants</Header>
            <RestaurantGrid>
                {restaurants.map((restaurant) => (
                    <RestaurantCard
                        key={restaurant.restaurantid}
                        onClick={() => handleEditRestaurant(restaurant.restaurantid)}
                    >
                        <RestaurantName>{restaurant.name}</RestaurantName>
                        <RestaurantType>{restaurant.klassifizierung}</RestaurantType>
                        <RestaurantInfo>👨‍🍳 {restaurant.kuechenchef}</RestaurantInfo>
                        <RestaurantInfo>📞 {restaurant.telefon}</RestaurantInfo>
                        <RestaurantInfo>🏠 Adresse-ID: {restaurant.adresseid}</RestaurantInfo>
                    </RestaurantCard>
                ))}
            </RestaurantGrid>
        </Container>
    );
}

export default Restaurants;
