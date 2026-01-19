import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import colors from '../theme/colors';

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
`;

const CategoryCount = styled.div`
    color: ${colors.text.light};
    font-size: 0.9em;
    margin-top: 5px;
`;

const FeaturedSection = styled.div`
    margin-bottom: 50px;
`;

const RestaurantsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 25px;
`;

const RestaurantCard = styled.div`
    background: ${colors.background.card};
    border-radius: 16px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 2px solid ${colors.border.light};
    box-shadow: ${colors.shadows.small};

    &:hover {
        transform: translateY(-8px);
        box-shadow: ${colors.shadows.large};
        border-color: ${colors.accent.orange};
    }
`;

const RestaurantImage = styled.div`
    height: 200px;
    background: ${props => props.$gradient || colors.gradients.primary};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 4em;
    position: relative;
`;

const FavoriteButton = styled.button`
    position: absolute;
    top: 15px;
    right: 15px;
    background: ${colors.background.card};
    border: none;
    width: 45px;
    height: 45px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1.3em;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    box-shadow: ${colors.shadows.small};

    &:hover {
        transform: scale(1.1);
        box-shadow: ${colors.shadows.medium};
    }
`;

const RestaurantContent = styled.div`
    padding: 25px;
`;

const RestaurantHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
`;

const RestaurantName = styled.h3`
    color: ${colors.text.primary};
    font-size: 1.4em;
    font-weight: 700;
    margin-bottom: 5px;
`;

const CuisineTag = styled.span`
    background: ${colors.accent.orange};
    color: ${colors.text.white};
    padding: 5px 12px;
    border-radius: 15px;
    font-size: 0.8em;
    font-weight: 600;
`;

const RestaurantInfo = styled.div`
    color: ${colors.text.secondary};
    font-size: 0.95em;
    margin: 8px 0;
    display: flex;
    align-items: center;
    gap: 8px;
`;

const RestaurantFooter = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 15px;
    padding-top: 15px;
    border-top: 2px solid ${colors.border.light};
`;

const Rating = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    color: ${colors.accent.orange};
    font-weight: 700;
    font-size: 1.1em;
`;

const DeliveryTime = styled.div`
    color: ${colors.text.light};
    font-size: 0.9em;
    font-weight: 600;
`;

const PromoSection = styled.div`
    background: ${colors.gradients.accent};
    border-radius: 16px;
    padding: 40px;
    margin-bottom: 40px;
    text-align: center;
    color: ${colors.text.white};
    box-shadow: ${colors.shadows.gold};
`;

const PromoTitle = styled.h2`
    font-size: 2em;
    margin-bottom: 15px;
    font-weight: 700;
`;

const PromoText = styled.p`
    font-size: 1.2em;
    margin-bottom: 20px;
`;

const PromoButton = styled.button`
    background: ${colors.text.white};
    color: ${colors.accent.orange};
    border: none;
    padding: 14px 32px;
    border-radius: 25px;
    cursor: pointer;
    font-size: 1.1em;
    font-weight: 700;
    transition: all 0.3s ease;
    box-shadow: ${colors.shadows.medium};

    &:hover {
        transform: translateY(-3px);
        box-shadow: ${colors.shadows.large};
    }
`;

// Mock-Daten
const categories = [
    { name: 'Italienisch', icon: '🍕', count: 42 },
    { name: 'Japanisch', icon: '🍣', count: 28 },
    { name: 'Amerikanisch', icon: '🍔', count: 35 },
    { name: 'Französisch', icon: '🥐', count: 18 },
    { name: 'Chinesisch', icon: '🥡', count: 31 },
    { name: 'Indisch', icon: '🍛', count: 22 },
];

const featuredRestaurants = [
    {
        id: 1,
        name: 'Bella Italia',
        cuisine: 'Italienisch',
        rating: 4.8,
        deliveryTime: '25-35 Min',
        distance: '2.3 km',
        icon: '🍕',
        gradient: colors.gradients.luxury,
        isFavorite: true
    },
    {
        id: 2,
        name: 'Sushi Heaven',
        cuisine: 'Japanisch',
        rating: 4.9,
        deliveryTime: '30-40 Min',
        distance: '3.1 km',
        icon: '🍣',
        gradient: colors.gradients.luxury,
        isFavorite: false
    },
    {
        id: 3,
        name: 'Burger Palace',
        cuisine: 'Amerikanisch',
        rating: 4.6,
        deliveryTime: '20-30 Min',
        distance: '1.8 km',
        icon: '🍔',
        gradient: colors.gradients.luxury,
        isFavorite: false
    },
    {
        id: 4,
        name: 'Le Bistro',
        cuisine: 'Französisch',
        rating: 4.7,
        deliveryTime: '35-45 Min',
        distance: '4.2 km',
        icon: '🥐',
        gradient: colors.gradients.luxury,
        isFavorite: true
    },
];

function Kundehome() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [favorites, setFavorites] = useState([1, 4]);

    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigate(`/kunde/restaurants?search=${searchQuery}`);
        }
    };

    const handleCategoryClick = (category) => {
        navigate(`/kunde/restaurants?cuisine=${category}`);
    };

    const toggleFavorite = (restaurantId, e) => {
        e.stopPropagation();
        setFavorites(prev => 
            prev.includes(restaurantId) 
                ? prev.filter(id => id !== restaurantId)
                : [...prev, restaurantId]
        );
    };

    return (
        <Container>
            <HeroSection>
                <HeroTitle> Willkommen bei GaumenGalopp</HeroTitle>
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
                <SectionTitle> Küchen entdecken</SectionTitle>
                <CategoriesGrid>
                    {categories.map((category, index) => (
                        <CategoryCard 
                            key={index}
                            onClick={() => handleCategoryClick(category.name)}
                        >
                            <CategoryIcon>{category.icon}</CategoryIcon>
                            <CategoryName>{category.name}</CategoryName>
                            <CategoryCount>{category.count} Restaurants</CategoryCount>
                        </CategoryCard>
                    ))}
                </CategoriesGrid>
            </CategorySection>

            <FeaturedSection>
                <SectionTitle> Beliebte Restaurants</SectionTitle>
                <RestaurantsGrid>
                    {featuredRestaurants.map((restaurant) => (
                        <RestaurantCard
                            key={restaurant.id}
                            onClick={() => navigate(`/kunde/restaurants/${restaurant.id}`)}
                        >
                            <RestaurantImage $gradient={restaurant.gradient}>
                                <span>{restaurant.icon}</span>
                            </RestaurantImage>
                            <RestaurantContent>
                                <RestaurantHeader>
                                    <div>
                                        <RestaurantName>{restaurant.name}</RestaurantName>
                                        <CuisineTag>{restaurant.cuisine}</CuisineTag>
                                    </div>
                                </RestaurantHeader>
                                <RestaurantInfo>
                                    📍 {restaurant.distance}
                                </RestaurantInfo>
                                <RestaurantFooter>
                                    <Rating>
                                        ⭐ {restaurant.rating}
                                    </Rating>
                                    <DeliveryTime>
                                        🕐 {restaurant.deliveryTime}
                                    </DeliveryTime>
                                </RestaurantFooter>
                            </RestaurantContent>
                        </RestaurantCard>
                    ))}
                </RestaurantsGrid>
            </FeaturedSection>
        </Container>
    );
}

export default Kundehome;