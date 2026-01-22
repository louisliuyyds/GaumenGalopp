import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import colors from '../theme/colors';
import kochstilService from '../services/kochstilService';
import restaurantService from '../services/restaurantService';
import gerichtService from '../services/gerichtService';
import RestaurantCard from '../components/RestaurantCard';

const Container = styled.div`
    max-width: 1400px;
    margin: 0 auto;
`;

const HeroSection = styled.div`
    background: ${colors.gradients.luxury};
    border-radius: 20px;
    padding: 60px 40px;
    margin-bottom: 40px;
    text-align: center;
    box-shadow: ${colors.shadows.large};
    position: relative;
    overflow: hidden;
`;

const HeroTitle = styled.h1`
    color: ${colors.text.primary};
    font-size: 3em;
    margin-bottom: 15px;
    font-weight: 700;
`;

const HeroSubtitle = styled.p`
    color: ${colors.text.secondary};
    font-size: 1.3em;
    margin-bottom: 30px;
    line-height: 1.6;
`;

const SearchBar = styled.div`
    max-width: 600px;
    margin: 0 auto;
    position: relative;
`;

const SearchInput = styled.input`
    width: 100%;
    padding: 18px 24px;
    border: 3px solid ${colors.border.medium};
    border-radius: 50px;
    font-size: 1.1em;
    transition: all 0.3s ease;
    background: ${colors.background.card};
    color: ${colors.text.primary};
    box-shadow: ${colors.shadows.medium};

    &:focus {
        outline: none;
        border-color: ${colors.accent.orange};
        box-shadow: ${colors.shadows.gold};
    }

    &::placeholder {
        color: ${colors.text.muted};
    }
`;

const CategorySection = styled.div`
    margin-bottom: 50px;
`;

const SectionTitle = styled.h2`
    color: ${colors.text.primary};
    font-size: 2em;
    margin-bottom: 25px;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 12px;
`;

const CategoriesGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 20px;
    margin-bottom: 40px;
`;

const CategoryCard = styled.div`
    background: ${colors.background.card};
    border-radius: 16px;
    padding: 30px 20px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 2px solid ${colors.border.light};
    box-shadow: ${colors.shadows.small};

    &:hover {
        transform: translateY(-8px);
        box-shadow: ${colors.shadows.large};
        border-color: ${colors.accent.orange};
        background: ${colors.gradients.card};
    }
`;

const CategoryIcon = styled.div`
    font-size: 3em;
    margin-bottom: 15px;
`;

const CategoryName = styled.div`
    color: ${colors.text.primary};
    font-size: 1.1em;
    font-weight: 600;
    margin-bottom: 5px;
`;

const CategoryCount = styled.div`
    color: ${colors.text.light};
    font-size: 0.9em;
`;

const FeaturedSection = styled.div`
    margin-bottom: 50px;
`;

const RestaurantsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 25px;
`;

const GerichteGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
`;

const GerichtCard = styled.div`
    background: ${colors.background.card};
    border-radius: 16px;
    padding: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 2px solid ${colors.border.light};
    box-shadow: ${colors.shadows.small};

    &:hover {
        transform: translateY(-6px);
        box-shadow: ${colors.shadows.large};
        border-color: ${colors.accent.orange};
    }
`;

const GerichtIcon = styled.div`
    font-size: 2.5em;
    text-align: center;
    margin-bottom: 12px;
`;

const GerichtName = styled.h4`
    color: ${colors.text.primary};
    font-size: 1.1em;
    font-weight: 700;
    margin-bottom: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const GerichtInfo = styled.div`
    color: ${colors.text.light};
    font-size: 0.9em;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 8px;
`;

const GerichtRestaurant = styled.div`
    color: ${colors.text.secondary};
    font-size: 0.85em;
    font-weight: 600;
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid ${colors.border.light};
`;

const LoadingMessage = styled.div`
    text-align: center;
    padding: 50px;
    font-size: 1.2em;
    color: ${colors.text.light};
`;

const SearchResultsHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
`;

const ResultCount = styled.div`
    color: ${colors.accent.orange};
    font-size: 1em;
    font-weight: 600;
`;

const EmptyState = styled.div`
    text-align: center;
    padding: 80px 20px;
    color: ${colors.text.light};
`;

// Icon-Mapping für Kategorien
const iconMap = {
    'Italienisch': '🍕',
    'Japanisch': '🍣',
    'Amerikanisch': '🍔',
    'Französisch': '🥐',
    'Chinesisch': '🥡',
    'Indisch': '🍛',
    'Deutsch': '🥨',
    'Griechisch': '🥙',
    'Thai': '🍜',
    'Mexikanisch': '🌮',
    'Spanisch': '🥘',
    'Türkisch': '🥙',
    'Vegetarisch': '🥗',
    'Vegan': '🌱'
};

// Emoji-Mapping für Gerichte nach Kategorie
const gerichtIconMap = {
    'Vorspeise': '🥗',
    'Hauptgericht': '🍽️',
    'Dessert': '🍰',
    'Getränk': '🥤',
    'Beilage': '🍚'
};

function KundeHome() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [topCategories, setTopCategories] = useState([]);
    const [allRestaurants, setAllRestaurants] = useState([]);
    const [featuredRestaurants, setFeaturedRestaurants] = useState([]);
    const [topGerichte, setTopGerichte] = useState([]);
    const [searchedGerichte, setSearchedGerichte] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searching, setSearching] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);

                const [kochstileRes, restaurantsRes] = await Promise.all([
                    kochstilService.getAll(),
                    restaurantService.getAll()
                ]);

                const kochstile = kochstileRes.data || kochstileRes || [];
                const restaurants = restaurantsRes.data || restaurantsRes || [];

                // Kochstile mit Restaurant-Counts
                const counts = kochstile.map(k => ({
                    ...k,
                    count: restaurants.filter(r =>
                        r.kochstil?.some(rk => Number(rk.stilid) === Number(k.stilid))
                    ).length
                }));

                // ✅ FIX 1: Max 5 statt 6 Kochstile
                const top5 = counts
                    .filter(k => k.count > 0)
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 5);

                setTopCategories(top5);
                setAllRestaurants(restaurants);
                setFeaturedRestaurants(restaurants.slice(0, 4));

                // Top-Gerichte laden (von den ersten 5 Restaurants)
                await loadTopGerichte(restaurants.slice(0, 5));

            } catch (error) {
                console.error('Fehler beim Laden:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const loadTopGerichte = async (restaurants) => {
        try {
            const gerichtePromises = restaurants.map(async (restaurant) => {
                try {
                    const favorites = await restaurantService.getCustomerFavorites(restaurant.restaurantid);
                    const favData = favorites.data || favorites || [];

                    // Füge Restaurant-Info zu jedem Gericht hinzu
                    return favData.map(gericht => ({
                        ...gericht,
                        restaurantid: restaurant.restaurantid,
                        restaurantname: restaurant.name
                    }));
                } catch (err) {
                    console.error(`Fehler beim Laden der Gerichte für Restaurant ${restaurant.restaurantid}:`, err);
                    return [];
                }
            });

            const gerichteArrays = await Promise.all(gerichtePromises);
            const alleGerichte = gerichteArrays.flat();

            // Sortiere nach Bewertung und nimm die Top 8
            const sortiert = alleGerichte
                .sort((a, b) => b.durchschnitt_kunden - a.durchschnitt_kunden)
                .slice(0, 8);

            setTopGerichte(sortiert);
        } catch (error) {
            console.error('Fehler beim Laden der Top-Gerichte:', error);
        }
    };

    // NEU: Live-Suche mit API
    useEffect(() => {
        const searchGerichte = async () => {
            if (!searchQuery || searchQuery.length < 2) {
                setSearchedGerichte([]);
                return;
            }

            setSearching(true);
            try {
                const response = await gerichtService.searchGerichte(searchQuery);
                const data = response.data || response || [];
                setSearchedGerichte(data);
            } catch (error) {
                console.error('Fehler bei der Gerichtssuche:', error);
                setSearchedGerichte([]);
            } finally {
                setSearching(false);
            }
        };

        // Debounce: Warte 300ms nach letzter Eingabe
        const timeoutId = setTimeout(() => {
            searchGerichte();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const handleCategoryClick = (kochstilName) => {
        navigate(`/kunde/restaurants?cuisine=${kochstilName}`);
    };

    const handleGerichtClick = (gericht) => {
        // Navigiere zum Restaurant mit dem Gericht
        navigate(`/restaurants/${gericht.restaurantid}`);
    };

    // ✅ FIX 2: Live-Filterung statt Navigate
    const filteredRestaurants = searchQuery
        ? allRestaurants.filter(res => {
            const query = searchQuery.toLowerCase();
            const matchName = res.name.toLowerCase().includes(query);
            const matchKochstil = res.kochstil?.some(k =>
                k.kochstil.toLowerCase().includes(query)
            );
            return matchName || matchKochstil;
        })
        : [];

    // Verwende API-Suchergebnisse statt lokale Filterung
    const filteredGerichte = searchedGerichte;

    const hasSearchResults = filteredRestaurants.length > 0 || filteredGerichte.length > 0;

    if (loading) {
        return (
            <Container>
                <LoadingMessage>Lädt deine Lieblingsorte...</LoadingMessage>
            </Container>
        );
    }

    return (
        <Container>
            <HeroSection>
                <HeroTitle>🍽️ Willkommen bei GaumenGalopp</HeroTitle>
                <HeroSubtitle>
                    Entdecke die besten Restaurants in deiner Nähe und bestelle dein Lieblingsessen
                </HeroSubtitle>
                <SearchBar>
                    <SearchInput
                        type="text"
                        placeholder="Restaurant, Küche oder Gericht suchen..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </SearchBar>
            </HeroSection>

            {/* Suchergebnisse anzeigen wenn aktiv */}
            {searchQuery && (
                <>
                    {searching && (
                        <LoadingMessage>Suche läuft...</LoadingMessage>
                    )}
                    {!searching && hasSearchResults ? (
                        <>
                            {filteredRestaurants.length > 0 && (
                                <FeaturedSection>
                                    <SearchResultsHeader>
                                        <SectionTitle>🔍 Restaurants</SectionTitle>
                                        <ResultCount>{filteredRestaurants.length} Treffer</ResultCount>
                                    </SearchResultsHeader>
                                    <RestaurantsGrid>
                                        {filteredRestaurants.map(restaurant => (
                                            <RestaurantCard
                                                key={restaurant.restaurantid}
                                                restaurant={restaurant}
                                                basePath="/restaurants"
                                            />
                                        ))}
                                    </RestaurantsGrid>
                                </FeaturedSection>
                            )}

                            {filteredGerichte.length > 0 && (
                                <FeaturedSection>
                                    <SearchResultsHeader>
                                        <SectionTitle>🍴 Gerichte</SectionTitle>
                                        <ResultCount>{filteredGerichte.length} Treffer</ResultCount>
                                    </SearchResultsHeader>
                                    <GerichteGrid>
                                        {filteredGerichte.map(gericht => (
                                            <GerichtCard
                                                key={gericht.gerichtid}
                                                onClick={() => handleGerichtClick(gericht)}
                                            >
                                                <GerichtIcon>
                                                    {gerichtIconMap[gericht.kategorie] || '🍽️'}
                                                </GerichtIcon>
                                                <GerichtName>{gericht.name}</GerichtName>
                                                {gericht.beschreibung && (
                                                    <div style={{
                                                        color: colors.text.light,
                                                        fontSize: '0.85em',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                        marginTop: '8px'
                                                    }}>
                                                        {gericht.beschreibung}
                                                    </div>
                                                )}
                                                <GerichtRestaurant>
                                                    📍 {gericht.restaurantname}
                                                </GerichtRestaurant>
                                            </GerichtCard>
                                        ))}
                                    </GerichteGrid>
                                </FeaturedSection>
                            )}
                        </>
                    ) : !searching && (
                        <EmptyState>
                            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔍</div>
                            <h3>Keine Ergebnisse gefunden</h3>
                            <p>Versuche es mit einem anderen Suchbegriff.</p>
                        </EmptyState>
                    )}
                </>
            )}

            {/* Standard-Ansicht ohne Suche */}
            {!searchQuery && (
                <>
                    <CategorySection>
                        <SectionTitle>🌍 Küchen entdecken</SectionTitle>
                        <CategoriesGrid>
                            {topCategories.map(category => (
                                <CategoryCard
                                    key={category.stilid}
                                    onClick={() => handleCategoryClick(category.kochstil)}
                                >
                                    <CategoryIcon>{iconMap[category.kochstil] || '🍽️'}</CategoryIcon>
                                    <CategoryName>{category.kochstil}</CategoryName>
                                    <CategoryCount>{category.count} Restaurants</CategoryCount>
                                </CategoryCard>
                            ))}
                        </CategoriesGrid>
                    </CategorySection>

                    {/* NEU: Bestbewertete Gerichte */}
                    {topGerichte.length > 0 && (
                        <FeaturedSection>
                            <SectionTitle>🌟 Bestbewertete Gerichte</SectionTitle>
                            <GerichteGrid>
                                {topGerichte.map(gericht => (
                                    <GerichtCard
                                        key={`${gericht.restaurantid}-${gericht.gerichtid}`}
                                        onClick={() => handleGerichtClick(gericht)}
                                    >
                                        <GerichtIcon>
                                            {gerichtIconMap[gericht.kategorie] || '🍽️'}
                                        </GerichtIcon>
                                        <GerichtName>{gericht.name}</GerichtName>
                                        <GerichtInfo>
                                            <span>⭐ {gericht.durchschnitt_kunden?.toFixed(1) || 'N/A'}</span>
                                            <span>•</span>
                                            <span>{gericht.anzahl_bewertungen} Bewertungen</span>
                                        </GerichtInfo>
                                        {gericht.beschreibung && (
                                            <div style={{
                                                color: colors.text.light,
                                                fontSize: '0.85em',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                marginTop: '8px'
                                            }}>
                                                {gericht.beschreibung}
                                            </div>
                                        )}
                                        <GerichtRestaurant>
                                            📍 {gericht.restaurantname}
                                        </GerichtRestaurant>
                                    </GerichtCard>
                                ))}
                            </GerichteGrid>
                        </FeaturedSection>
                    )}

                    <FeaturedSection>
                        <SectionTitle>⭐ Beliebte Restaurants</SectionTitle>
                        {featuredRestaurants.length === 0 ? (
                            <LoadingMessage>Keine Restaurants verfügbar</LoadingMessage>
                        ) : (
                            <RestaurantsGrid>
                                {featuredRestaurants.map(restaurant => (
                                    <RestaurantCard
                                        key={restaurant.restaurantid}
                                        restaurant={restaurant}
                                        basePath="/restaurants"
                                    />
                                ))}
                            </RestaurantsGrid>
                        )}
                    </FeaturedSection>
                </>
            )}
        </Container>
    );
}

export default KundeHome;