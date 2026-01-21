import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import colors from "../theme/colors";

const Card = styled.div`
    background: ${colors.background.card};
    border-radius: 16px;
    overflow: hidden;
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

const Header = styled.div`
    display: flex;
    gap: 12px;
    padding: 16px 18px 10px 18px;
    align-items: flex-start;
`;

const IconBadge = styled.div`
    width: 44px;
    height: 44px;
    border-radius: 14px;
    background: ${colors.gradients.luxury};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.6em;
    flex: 0 0 auto;
    box-shadow: ${colors.shadows.small};
    border: 1px solid ${colors.border.light};
`;

const TitleBlock = styled.div`
    flex: 1 1 auto;
    min-width: 0;
`;

const TitleRow = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: baseline;
`;

const RestaurantName = styled.h3`
    color: ${colors.text.primary};
    font-size: 1.15em;
    font-weight: 800;
    margin: 0;
    line-height: 1.2;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const Michelin = styled.div`
    flex: 0 0 auto;
    color: ${colors.text.secondary};
    font-size: 0.9em;
    font-weight: 800;
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    gap: 6px;
`;

const MichelinStar = styled.span`
    color: ${colors.accent.orange};
    font-weight: 900;
`;

const MetaRow = styled.div`
    margin-top: 8px;
    color: ${colors.text.light};
    font-size: 0.92em;
    font-weight: 700;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
`;

const Dot = styled.span`
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: ${colors.border.light};
    display: inline-block;
`;

const Content = styled.div`
    padding: 0 18px 16px 18px;
`;

const CuisineLine = styled.div`
    margin-top: 10px;
    color: ${colors.text.secondary};
    font-size: 0.92em;
    font-weight: 800;
    display: flex;
    gap: 8px;
    align-items: center;
`;

const CuisinePill = styled.span`
    display: inline-flex;
    align-items: center;
    padding: 4px 10px;
    border-radius: 999px;
    background: ${colors.background.page};
    border: 1px solid ${colors.border.light};
    color: ${colors.text.secondary};
    font-size: 0.82em;
    font-weight: 800;
`;

const AddressRow = styled.div`
    margin-top: 10px;
    color: ${colors.text.secondary};
    font-size: 0.92em;
    line-height: 1.35;
    display: flex;
    gap: 8px;
    align-items: flex-start;
`;

const Divider = styled.div`
    height: 1px;
    background: ${colors.border.light};
    margin: 14px 18px 0 18px;
`;

const FooterHint = styled.div`
    padding: 10px 18px 14px 18px;
    display: flex;
    justify-content: flex-end;
    color: ${colors.text.light};
    font-size: 0.85em;
    font-weight: 800;
`;

const iconMap = {
    Italienisch: "🍕",
    Japanisch: "🍣",
    Amerikanisch: "🍔",
    Französisch: "🥐",
    Chinesisch: "🥡",
    Indisch: "🍛",
    Deutsch: "🥨",
    Griechisch: "🥙",
    Thai: "🍜",
    Mexikanisch: "🌮",
    Spanisch: "🥘",
    Türkisch: "🥙",
    Vegetarisch: "🥗",
    Vegan: "🌱",
    "Fast Food": "🍟",
};

const parseMichelinStars = (klassifizierung) => {
    if (!klassifizierung) return null;
    const m = String(klassifizierung).match(/(\d+)/);
    return m ? Number(m[1]) : null;
};

function RestaurantCard({ restaurant, basePath = "/restaurants" }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`${basePath}/${restaurant.restaurantid}`);
    };

    const kochstile = Array.isArray(restaurant.kochstil) ? restaurant.kochstil : [];
    const icon =
        kochstile.length > 0 ? iconMap[kochstile[0].kochstil] || "🍽️" : "🍽️";

    const michelinStars = parseMichelinStars(restaurant.klassifizierung);

    // Compact address: "Straße Hausnr · Ort"
    const addressText = (() => {
        const a = restaurant.adresse;
        if (!a) return null;
        const line1 = [a.straße, a.hausnummer].filter(Boolean).join(" ");
        const city = [a.ort].filter(Boolean).join(" ");
        if (!line1 && !city) return null;
        return [line1, city].filter(Boolean).join(" · ");
    })();

    const primaryCuisine = kochstile[0]?.kochstil;
    const extraCuisineCount = Math.max(kochstile.length - 1, 0);

    // Echte Bewertungen aus API
    const rating = restaurant.bewertungen?.durchschnitt_gesamt || 0;
    const ratingCount = restaurant.bewertungen?.anzahl_gesamt || 0;
    const hasRatings = ratingCount > 0;

    return (
        <Card onClick={handleClick}>
            <Header>
                <IconBadge aria-hidden="true">{icon}</IconBadge>

                <TitleBlock>
                    <TitleRow>
                        <RestaurantName title={restaurant.name}>{restaurant.name}</RestaurantName>

                        <Michelin title="Michelin-Klassifizierung">
                            Michelin <MichelinStar>★</MichelinStar>
                            {michelinStars != null ? michelinStars : restaurant.klassifizierung}
                        </Michelin>
                    </TitleRow>

                    {/* Echte Bewertungen */}
                    <MetaRow>
                        {hasRatings ? (
                            <span title={`${ratingCount} Bewertungen`}>⭐ {rating.toFixed(1)}</span>
                        ) : (
                            <span title="Noch keine Bewertungen">⭐ Noch keine Bewertungen</span>
                        )}
                        </MetaRow>
                </TitleBlock>
            </Header>

            <Content>
                {/* Kochstile: 1 + "+n" */}
                {primaryCuisine && (
                    <CuisineLine>
                        <CuisinePill>{primaryCuisine}</CuisinePill>
                        {extraCuisineCount > 0 && (
                            <CuisinePill
                                title={kochstile.map((k) => k.kochstil).join(", ")}
                            >
                                +{extraCuisineCount}
                            </CuisinePill>
                        )}
                    </CuisineLine>
                )}

                {/* Address: compact, single line */}
                {addressText && (
                    <AddressRow>
                        <span aria-hidden="true">📍</span>
                        <span>{addressText}</span>
                    </AddressRow>
                )}
            </Content>

            <Divider />
            <FooterHint>Mehr →</FooterHint>
        </Card>
    );
}

export default RestaurantCard;