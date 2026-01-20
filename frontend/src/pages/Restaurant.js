import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate, useSearchParams } from "react-router-dom";
import colors from "../theme/colors";
import { restaurantService } from "../services";
import kochstilService from "../services/kochstilService";

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

const FilterSection = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 30px;
    padding: 20px;
    background: ${colors.background.card};
    border-radius: 12px;
    box-shadow: ${colors.shadows.small};
`;

const FilterButton = styled.button`
    padding: 10px 20px;
    border: 2px solid ${props => props.$active ? colors.primary.main : colors.border.light};
    border-radius: 8px;
    background: ${props => props.$active ? colors.primary.main : 'white'};
    color: ${props => props.$active ? 'white' : colors.text.primary};
    cursor: pointer;
    font-size: 0.95em;
    font-weight: 600;
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: ${colors.shadows.small};
        border-color: ${colors.primary.main};
    }
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

const CuisineTag = styled.span`
    display: inline-block;
    background: ${colors.background.light};
    color: ${colors.text.secondary};
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 0.8em;
    margin-right: 5px;
    margin-top: 5px;
    font-weight: 500;
`;

const LoadingMessage = styled.div`
    text-align: center;
    padding: 50px;
    font-size: 1.2em;
    color: ${colors.text.light};
`;

const ErrorMessage = styled.div`
    background: ${colors.status.errorLight};
    color: ${colors.status.error};
    padding: 20px;
    border-radius: 8px;
    margin: 20px 0;
    text-align: center;
`;

function Restaurants() {
    const [restaurants, setRestaurants] = useState([]);
    const [allKochstile, setAllKochstile] = useState([]);
    const [selectedKochstil, setSelectedKochstil] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    // Laden der Daten beim Mount (nur einmal)
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);

                const [restaurantsRes, kochstileRes] = await Promise.all([
                    restaurantService.getAll(),
                    kochstilService.getAll(),
                ]);

                const restaurantsData = restaurantsRes.data || restaurantsRes || [];
                const kochstileData = kochstileRes.data || kochstileRes || [];

                setRestaurants(restaurantsData);
                setAllKochstile(kochstileData);
            } catch (err) {
                console.error('Fehler beim Laden:', err);
                setError('Fehler beim Laden der Restaurants.');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []); // Nur beim Mount

    // URL-Parameter auswerten (separate useEffect)
    useEffect(() => {
        const cuisineParam = searchParams.get('cuisine');

        if (cuisineParam && allKochstile.length > 0) {
            const match = allKochstile.find(
                k => k.kochstil.toLowerCase() === cuisineParam.toLowerCase()
            );
            setSelectedKochstil(match ? match.stilid : null);
        } else if (!cuisineParam) {
            setSelectedKochstil(null);
        }
    }, [searchParams, allKochstile]); // Nur bei URL- oder Kochstil-Änderung

    // Restaurants filtern
    const filteredRestaurants = restaurants.filter(restaurant => {
        if (!selectedKochstil) return true;
        return restaurant.kochstil?.some(
            k => Number(k.stilid) === Number(selectedKochstil)
        );
    });

    // Filter ändern
    const handleFilterChange = (stilId) => {
        setSelectedKochstil(stilId);

        if (stilId) {
            const kochstil = allKochstile.find(k => k.stilid === stilId);
            if (kochstil) {
                setSearchParams({ cuisine: kochstil.kochstil });
            }
        } else {
            setSearchParams({});
        }
    };

    if (loading) {
        return (
            <Container>
                <LoadingMessage>Lade Restaurants...</LoadingMessage>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <ErrorMessage>{error}</ErrorMessage>
            </Container>
        );
    }

    return (
        <Container>
            <Header>Restaurants</Header>

            <FilterSection>
                <FilterButton
                    $active={!selectedKochstil}
                    onClick={() => handleFilterChange(null)}
                >
                    Alle ({restaurants.length})
                </FilterButton>

                {allKochstile.map(k => {
                    const count = restaurants.filter(r =>
                        r.kochstil?.some(rk => Number(rk.stilid) === Number(k.stilid))
                    ).length;

                    if (count === 0) return null;

                    return (
                        <FilterButton
                            key={k.stilid}
                            $active={selectedKochstil === k.stilid}
                            onClick={() => handleFilterChange(k.stilid)}
                        >
                            {k.kochstil} ({count})
                        </FilterButton>
                    );
                })}
            </FilterSection>

            <RestaurantGrid>
                {filteredRestaurants.map((restaurant) => (
                    <RestaurantCard
                        key={restaurant.restaurantid}
                        onClick={() => navigate(`/restaurants/${restaurant.restaurantid}`)}
                    >
                        <RestaurantName>{restaurant.name}</RestaurantName>

                        {restaurant.klassifizierung && (
                            <RestaurantType>{restaurant.klassifizierung}</RestaurantType>
                        )}

                        {restaurant.kochstil && restaurant.kochstil.length > 0 && (
                            <div style={{ marginTop: '10px' }}>
                                {restaurant.kochstil.map(k => (
                                    <CuisineTag key={k.stilid}>
                                        {k.kochstil}
                                    </CuisineTag>
                                ))}
                            </div>
                        )}

                        {restaurant.kuechenchef && (
                            <RestaurantInfo>👨‍🍳 {restaurant.kuechenchef}</RestaurantInfo>
                        )}
                        {restaurant.telefon && (
                            <RestaurantInfo>📞 {restaurant.telefon}</RestaurantInfo>
                        )}
                        {restaurant.adresse && (
                            <RestaurantInfo>
                                📍 {restaurant.adresse.ort}
                            </RestaurantInfo>
                        )}
                    </RestaurantCard>
                ))}
            </RestaurantGrid>

            {filteredRestaurants.length === 0 && (
                <LoadingMessage>
                    Keine Restaurants gefunden {selectedKochstil && 'für diese Kategorie'}.
                </LoadingMessage>
            )}
        </Container>
    );
}

export default Restaurants;