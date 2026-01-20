import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import colors from '../theme/colors';

const Card = styled.div`
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
`;

const Content = styled.div`
    padding: 25px;
`;

const RestaurantName = styled.h3`
    color: ${colors.text.primary};
    font-size: 1.4em;
    font-weight: 700;
    margin-bottom: 10px;
`;

const CuisineTag = styled.span`
    display: inline-block;
    background: ${colors.accent.orange};
    color: ${colors.text.white};
    padding: 5px 12px;
    border-radius: 15px;
    font-size: 0.8em;
    font-weight: 600;
    margin-right: 5px;
    margin-bottom: 5px;
`;

const InfoRow = styled.div`
    color: ${colors.text.secondary};
    font-size: 0.95em;
    margin: 8px 0;
    display: flex;
    align-items: flex-start;
    gap: 8px;
    line-height: 1.4;
`;

const Footer = styled.div`
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

const ChefInfo = styled.div`
    color: ${colors.text.secondary};
    font-size: 0.9em;
    margin: 8px 0;
    display: flex;
    align-items: center;
    gap: 8px;
`;

// Icon-Mapping für Kochstile
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

/**
 * RestaurantCard - Wiederverwendbare Restaurant-Karte
 *
 * @param {Object} restaurant - Restaurant-Objekt aus der API
 * @param {string} basePath - Base-Pfad für Navigation (z.B. "/kunde/restaurants" oder "/restaurants")
 */
function RestaurantCard({ restaurant, basePath = "/restaurants" }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`${basePath}/${restaurant.restaurantid}`);
    };

    // Icon basierend auf erstem Kochstil
    const icon = restaurant.kochstil && restaurant.kochstil.length > 0
        ? iconMap[restaurant.kochstil[0].kochstil] || '🍽️'
        : '🍽️';

    // Vollständige Adresse formatieren
    const formatAddress = () => {
        if (!restaurant.adresse) return null;

        const { straße, hausnummer, postleitzahl, ort } = restaurant.adresse;

        if (!straße && !ort) return null;

        return (
            <>
                {straße && hausnummer && `${straße} ${hausnummer}`}
                {straße && hausnummer && (postleitzahl || ort) && <br />}
                {postleitzahl && `${postleitzahl} `}
                {ort}
            </>
        );
    };

    const address = formatAddress();

    return (
        <Card onClick={handleClick}>
            <RestaurantImage $gradient={colors.gradients.luxury}>
                <span>{icon}</span>
            </RestaurantImage>
            <Content>
                <RestaurantName>{restaurant.name}</RestaurantName>

                {/* Kochstile */}
                {restaurant.kochstil && restaurant.kochstil.length > 0 && (
                    <div style={{ marginBottom: '10px' }}>
                        {restaurant.kochstil.map(k => (
                            <CuisineTag key={k.stilid}>
                                {k.kochstil}
                            </CuisineTag>
                        ))}
                    </div>
                )}

                {/* Küchenchef */}
                {restaurant.kuechenchef && (
                    <ChefInfo>
                        👨‍🍳 {restaurant.kuechenchef}
                    </ChefInfo>
                )}

                {/* Adresse */}
                {address && (
                    <InfoRow>
                        <span>📍</span>
                        <span>{address}</span>
                    </InfoRow>
                )}

                {/* Telefon */}
                {restaurant.telefon && (
                    <InfoRow>
                        📞 {restaurant.telefon}
                    </InfoRow>
                )}

                <Footer>
                    <Rating>⭐ 4.5</Rating>
                    <DeliveryTime>🕐 30-40 Min</DeliveryTime>
                </Footer>
            </Content>
        </Card>
    );
}

export default RestaurantCard;