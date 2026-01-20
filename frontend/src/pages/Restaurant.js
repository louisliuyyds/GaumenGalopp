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

    const cuisineParam = searchParams.get("cuisine");

    const handleEditRestaurant = (restaurantid) => {
        navigate(`/restaurants/${restaurantid}/edit`);
    };

    // 1) Daten laden: Restaurants + Kochstile parallel
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);

                const [restaurantsRes, kochstileRes] = await Promise.all([
                    restaurantService.getAll(),
                    kochstilService.getAll(),
                ]);

                const restaurantsData = Array.isArray(restaurantsRes?.data)
                    ? restaurantsRes.data
                    : Array.isArray(restaurantsRes)
                        ? restaurantsRes
                        : [];

                const kochstileData = Array.isArray(kochstileRes?.data)
                    ? kochstileRes.data
                    : Array.isArray(kochstileRes)
                        ? kochstileRes
                        : [];

                setRestaurants(restaurantsData);
                setAllKochstile(kochstileData);

                // 2) URL Param auswerten -> stilid setzen
                if (cuisineParam) {
                    const match = kochstileData.find(
                        (k) => (k.kochstil ?? "").toLowerCase() === cuisineParam.toLowerCase()
                    );
                    const nextSelected = match ? Number(match.stilid) : null;
                    setSelectedKochstil(nextSelected);

                    console.log("URL cuisineParam:", cuisineParam);
                    console.log("Match:", match);
                    console.log("selectedKochstil set to:", nextSelected);
                } else {
                    setSelectedKochstil(null);
                    console.log("No cuisineParam -> selectedKochstil null");
                }

                // 3) Debug: sind Kochstile wirklich in den Restaurants drin?
                const withKochstil = restaurantsData.filter(
                    (r) => (r.kochstil?.length ?? 0) > 0
                ).length;
                console.log(
                    "Restaurants total:",
                    restaurantsData.length,
                    "with kochstil:",
                    withKochstil
                );
                console.log("Sample restaurant[0]:", restaurantsData[0]);
            } catch (err) {
                console.error("Fehler beim Laden:", err);
                setError("Fehler beim Laden der Daten.");
            } finally {
                setLoading(false);
            }
        };

        loadData();
        // WICHTIG: nur auf cuisineParam hören, nicht auf searchParams-Objekt
    }, [cuisineParam]);

    // 4) Filter (robust: Number-Vergleich)
    const filteredRestaurants = useMemo(() => {
        if (selectedKochstil == null) return restaurants;

        const filtered = restaurants.filter((restaurant) =>
            restaurant.kochstil?.some(
                (k) => Number(k.stilid) === Number(selectedKochstil)
            )
        );

        console.log(
            "Filter active stilid:",
            selectedKochstil,
            "filtered:",
            filtered.length,
            "of",
            restaurants.length
        );

        return filtered;
    }, [restaurants, selectedKochstil]);

    // 5) Button/Filter setzen + URL synchronisieren
    const handleFilterChange = (stilId) => {
        const normalizedId = stilId == null ? null : Number(stilId);
        setSelectedKochstil(normalizedId);

        if (normalizedId == null) {
            setSearchParams({});
            return;
        }

        const kochstil = allKochstile.find((k) => Number(k.stilid) === normalizedId);
        if (kochstil?.kochstil) {
            setSearchParams({ cuisine: kochstil.kochstil });
        } else {
            setSearchParams({});
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
                {/* Reload durch URL neu setzen ist ok, oder einfach window.location.reload() */}
                <button onClick={() => window.location.reload()}>Erneut versuchen</button>
            </Container>
        );
    }

    return (
        <Container>
            <Header>Unsere Ultra High Quality Arschgeilen Restaurants</Header>

            {/* Debug-Box – kannst du später entfernen */}
            <div style={{ background: "#f4f4f4", padding: 10, marginBottom: 20 }}>
                <div>
                    <strong>Debug:</strong> cuisineParam = {String(cuisineParam || "")}
                </div>
                <div>selectedKochstil = {String(selectedKochstil)}</div>
                <div>
                    total = {restaurants.length} | filtered = {filteredRestaurants.length}
                </div>
            </div>

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
                    const count = restaurants.filter((r) =>
                        r.kochstil?.some((rk) => Number(rk.stilid) === Number(k.stilid))
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

                        {/* Optional: Kochstile anzeigen (hilft beim Debuggen) */}
                        {restaurant.kochstil?.length > 0 && (
                            <div style={{ marginTop: 10, marginBottom: 10 }}>
                                {restaurant.kochstil.map((k) => (
                                    <span
                                        key={k.stilid}
                                        style={{
                                            background: "#e0e0e0",
                                            padding: "4px 8px",
                                            borderRadius: 6,
                                            marginRight: 6,
                                            fontSize: "0.85em",
                                            display: "inline-block",
                                        }}
                                    >
                    {k.kochstil} (#{k.stilid})
                  </span>
                                ))}
                            </div>
                        )}

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
