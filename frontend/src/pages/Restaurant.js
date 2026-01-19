import React, { useEffect, useMemo, useState } from "react";
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

const FilterSection = styled.div``;

function Restaurants() {
    const [restaurants, setRestaurants] = useState([]);
    const [allKochstile, setAllKochstile] = useState([]);
    const [selectedKochstil, setSelectedKochstil] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    // Stabiler: tatsächlichen String als Trigger nutzen, nicht das SearchParams-Objekt
    const cuisineParam = searchParams.get("cuisine");

    const handleEditRestaurant = (restaurantid) => {
        navigate(`/restaurants/${restaurantid}/edit`);
    };

    const fetchRestaurants = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await restaurantService.getAll();
            const data = Array.isArray(response?.data)
                ? response.data
                : Array.isArray(response)
                    ? response
                    : [];

            setRestaurants(data);
            console.log("Restaurants geladen:", data);
            // Debug: hilft sofort zu sehen, ob kochstile wirklich drin sind
            // console.log("Sample restaurant:", data?.[0]);
            // console.log("Sample kochstile:", data?.[0]?.kochstile);
        } catch (err) {
            console.error("Fehler beim Laden:", err);
            setError("Fehler beim Laden der Restaurants.");
        } finally {
            setLoading(false);
        }
    };

    // Restaurants beim Start laden
    useEffect(() => {
        fetchRestaurants();
    }, []);

    // Kochstile laden + URL->stilid synchronisieren
    useEffect(() => {
        const loadKochstile = async () => {
            try {
                const response = await kochstilService.getAll();
                const kochstile = Array.isArray(response?.data) ? response.data : [];
                setAllKochstile(kochstile);

                if (cuisineParam) {
                    const match = kochstile.find(
                        (k) =>
                            (k.kochstil ?? "").toLowerCase() === cuisineParam.toLowerCase()
                    );
                    setSelectedKochstil(match ? Number(match.stilid) : null);
                } else {
                    setSelectedKochstil(null);
                }
            } catch (e) {
                console.error("Fehler beim Laden der Kochstile:", e);
                setAllKochstile([]);
                setSelectedKochstil(null);
            }
        };

        loadKochstile();
    }, [cuisineParam]);

    const filteredRestaurants = useMemo(() => {
        const list = Array.isArray(restaurants) ? restaurants : [];

        // Kein Filter aktiv -> alles anzeigen
        if (selectedKochstil == null) return list;

        // Robust: Number-Vergleich, damit String/Number egal ist
        return list.filter((restaurant) =>
            restaurant.kochstile?.some(
                (k) => Number(k.stilid) === Number(selectedKochstil)
            )
        );
    }, [restaurants, selectedKochstil]);

    const handleFilterChange = (stilId) => {
        const normalizedId = stilId == null ? null : Number(stilId);
        setSelectedKochstil(normalizedId);

        if (normalizedId == null) {
            setSearchParams({});
            return;
        }

        const kochstil = allKochstile.find(
            (k) => Number(k.stilid) === normalizedId
        );

        if (kochstil?.kochstil) {
            setSearchParams({ cuisine: kochstil.kochstil });
        } else {
            setSearchParams({});
        }
    };

    // Optional: Delete-Handler bleibt, auch wenn du aktuell keinen Button nutzt
    const handleDelete = async (id, name) => {
        if (window.confirm(`Möchten Sie das Restaurant "${name}" wirklich löschen?`)) {
            try {
                await restaurantService.delete(id);
                console.log("Restaurant gelöscht:", id);
                await fetchRestaurants();
            } catch (err) {
                console.error("Fehler beim Löschen:", err);
                alert("Fehler beim Löschen des Restaurants");
            }
        }
    };

    if (loading) {
        return (
            <Container>
                <div>Lade Restaurants...</div>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <div>{error}</div>
                <button onClick={fetchRestaurants}>Erneut versuchen</button>
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
                        backgroundColor: selectedKochstil == null ? "#3498db" : "#ecf0f1",
                        color: selectedKochstil == null ? "white" : "#333",
                    }}
                >
                    Alle ({restaurants.length})
                </button>

                {(allKochstile ?? []).map((k) => {
                    const count = (restaurants ?? []).filter((r) =>
                        r.kochstile?.some((rk) => Number(rk.stilid) === Number(k.stilid))
                    ).length;

                    const isActive =
                        selectedKochstil != null &&
                        Number(selectedKochstil) === Number(k.stilid);

                    return (
                        <button
                            key={k.stilid}
                            onClick={() => handleFilterChange(k.stilid)}
                            style={{
                                backgroundColor: isActive ? "#3498db" : "#ecf0f1",
                                color: isActive ? "white" : "#333",
                            }}
                        >
                            {k.kochstil} ({count})
                        </button>
                    );
                })}
            </FilterSection>

            <RestaurantGrid>
                {filteredRestaurants.map((restaurant) => (
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
