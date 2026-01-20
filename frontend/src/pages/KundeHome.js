import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import colors from '../theme/colors';
import kochstilService from '../services/kochstilService';
import restaurantService from '../services/restaurantService';
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
    padding-right: 120px;
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

const SearchButton = styled.button`
    position: absolute;
    right: 5px;
    top: 50%;
    transform: translateY(-50%);
    background: ${colors.gradients.accent};
    color: ${colors.text.white};
    border: none;
    padding: 12px 28px;
    border-radius: 50px;
    cursor: pointer;
    font-size: 1em;
    font-weight: 600;
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-50%) scale(1.05);
        box-shadow: ${colors.shadows.accentHover};
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

const LoadingMessage = styled.div`
    text-align: center;
    padding: 50px;
    font-size: 1.2em;
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

function KundeHome() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [topCategories, setTopCategories] = useState([]);
    const [featuredRestaurants, setFeaturedRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);

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

                const counts = kochstile.map(k => ({
                    ...k,
                    count: restaurants.filter(r =>
                        r.kochstil?.some(rk => Number(rk.stilid) === Number(k.stilid))
                    ).length
                }));

                const top6 = counts
                    .filter(k => k.count > 0)
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 6);

                setTopCategories(top6);
                setFeaturedRestaurants(restaurants.slice(0, 4));

            } catch (error) {
                console.error('Fehler beim Laden:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigate(`/kunde/restaurants?search=${searchQuery}`);
        }
    };

    const handleCategoryClick = (kochstilName) => {
        navigate(`/kunde/restaurants?cuisine=${kochstilName}`);
    };

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
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <SearchButton onClick={handleSearch}>🔍 Suchen</SearchButton>
                </SearchBar>
            </HeroSection>

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
                                basePath="/kunde/restaurants"
                            />
                        ))}
                    </RestaurantsGrid>
                )}
            </FeaturedSection>
        </Container>
    );
}

export default KundeHome;