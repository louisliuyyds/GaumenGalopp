import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import colors from '../theme/colors';
import {restaurantService} from "../services";
import { useSearchParams } from 'react-router-dom';
import kochstilService from '../services/kochstilService';

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

const FilterSection = styled.div`

`

function Restaurants() {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [allKochstile, setAllKochstile] = useState([]);
    const [selectedKochstil, setSelectedKochstil] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const load = async () => {
            const response = await kochstilService.getAll();
            setAllKochstile(response.data);

            // URL-Parameter auslesen
            const cuisineParam = searchParams.get('cuisine');
            if (cuisineParam) {
                const match = response.data.find(
                    k => k.kochstil.toLowerCase() === cuisineParam.toLowerCase()
                );
                if (match) setSelectedKochstil(match.stilid);
            }
        };
        load();
    }, [searchParams]);


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

    // Lade Restaurants
    useEffect(() => {
        const loadRestaurants = async () => {
            const response = await restaurantService.getAll();
            setRestaurants(response.data);
        };
        loadRestaurants();
    }, []);

    // Filter Restaurants
    const filteredRestaurants = restaurants.filter(restaurant => {
        if (!selectedKochstil) return true;
        return restaurant.kochstile?.some(k => k.stilid === selectedKochstil);
    });

// Filter-Auswahl
    const handleFilterChange = (stilId) => {
        setSelectedKochstil(stilId);
        if (stilId) {
            const kochstil = allKochstile.find(k => k.stilid === stilId);
            setSearchParams({ cuisine: kochstil.kochstil });
        } else {
            setSearchParams({});
        }
    };

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
            <FilterSection>
                <button
                    onClick={() => handleFilterChange(null)}
                    style={{
                        backgroundColor: !selectedKochstil ? '#3498db' : '#ecf0f1',
                        color: !selectedKochstil ? 'white' : '#333'
                    }}
                >
                    Alle ({restaurants.length})
                </button>

                {allKochstile.map(k => {
                    const count = restaurants.filter(r =>
                        r.kochstile?.some(rk => rk.stilid === k.stilid)
                    ).length;

                    return (
                        <button
                            key={k.stilid}
                            onClick={() => handleFilterChange(k.stilid)}
                            style={{
                                backgroundColor: selectedKochstil === k.stilid ? '#3498db' : '#ecf0f1',
                                color: selectedKochstil === k.stilid ? 'white' : '#333'
                            }}
                        >
                            {k.kochstil} ({count})
                        </button>
                    );
                })}
            </FilterSection>
            <RestaurantGrid>
                {restaurants.map((restaurant) => (
                    <RestaurantCard
                        key={restaurant.restaurantid}
                        onClick={() => handleEditRestaurant(restaurant.restaurantid)}
                    >
                        <RestaurantName>{restaurant.name}</RestaurantName>
                        <RestaurantType>{restaurant.klassifizierung}</RestaurantType>
                        <RestaurantInfo>{restaurant.kuechenchef}</RestaurantInfo>
                        <RestaurantInfo>{restaurant.telefon}</RestaurantInfo>
                        <RestaurantInfo>Adresse-ID: {restaurant.adresseid}</RestaurantInfo>
                    </RestaurantCard>
                ))}
            </RestaurantGrid>
        </Container>
    );
}

export default Restaurants;
