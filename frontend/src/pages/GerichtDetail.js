import React, { useState } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import colors from '../theme/colors';

const Container = styled.div`
    max-width: 1200px;
    margin: 0 auto;
`;

const BackButton = styled.button`
    background: ${colors.gradients.primary};
    color: ${colors.text.white};
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    cursor: pointer;
    margin-bottom: 30px;
    font-size: 1em;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: ${colors.shadows.primarySmall};

    &:hover {
        transform: translateY(-2px);
        box-shadow: ${colors.shadows.primaryMedium};
    }
`;

const HeaderSection = styled.div`
    background: ${colors.gradients.primary};
    border-radius: 16px;
    padding: 40px;
    margin-bottom: 30px;
    color: ${colors.text.white};
    box-shadow: ${colors.shadows.medium};
    position: relative;
`;

const EditButton = styled.button`
    position: absolute;
    top: 20px;
    right: 20px;
    background: ${colors.overlay.medium};
    color: ${colors.text.white};
    border: 2px solid ${colors.text.white};
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.95em;
    font-weight: 600;
    transition: all 0.3s ease;

    &:hover {
        background: ${colors.text.white};
        color: ${colors.primary.dark};
        transform: translateY(-2px);
    }
`;

const GerichtName = styled.h1`
    font-size: 2.5em;
    margin-bottom: 15px;
    font-weight: 700;
`;

const TagsContainer = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: 20px;
`;

const CategoryTag = styled.span`
    background: ${colors.gradients.accent};
    color: ${colors.text.white};
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 0.95em;
    font-weight: 600;
`;

const PriceTag = styled.span`
    background: ${colors.overlay.medium};
    color: ${colors.text.white};
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 1.2em;
    font-weight: 700;
`;

const Description = styled.p`
    font-size: 1.2em;
    line-height: 1.6;
    color: ${colors.primary.light};
    margin-bottom: 20px;
`;

const RestaurantLink = styled.button`
    background: transparent;
    color: ${colors.text.white};
    border: 2px solid ${colors.text.white};
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.95em;
    font-weight: 600;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 8px;

    &:hover {
        background: ${colors.text.white};
        color: ${colors.primary.dark};
    }
`;

const ContentGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
    margin-bottom: 40px;

    @media (max-width: 968px) {
        grid-template-columns: 1fr;
    }
`;

const InfoCard = styled.div`
    background: ${colors.background.card};
    border-radius: 12px;
    padding: 30px;
    box-shadow: ${colors.shadows.medium};
`;

const CardTitle = styled.h2`
    color: ${colors.text.primary};
    font-size: 1.5em;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 3px solid ${colors.accent.orange};
    display: inline-block;
`;

const InfoRow = styled.div`
    display: flex;
    margin: 15px 0;
    align-items: flex-start;
`;

const Label = styled.span`
    font-weight: 600;
    min-width: 140px;
    color: ${colors.text.primary};
    font-size: 1em;
`;

const Value = styled.span`
    color: ${colors.text.secondary};
    flex: 1;
`;

const FullWidthCard = styled(InfoCard)`
    grid-column: 1 / -1;
`;

const ReviewsList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const ReviewItem = styled.div`
    padding: 20px;
    background: ${colors.background.light};
    border-radius: 10px;
    border: 1px solid ${colors.border.light};
`;

const ReviewHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
`;

const ReviewAuthor = styled.span`
    font-weight: 600;
    color: ${colors.text.primary};
    font-size: 1.05em;
`;

const ReviewRating = styled.span`
    color: ${colors.accent.orange};
    font-weight: 700;
    font-size: 1.1em;
`;

const ReviewText = styled.p`
    color: ${colors.text.secondary};
    line-height: 1.6;
    margin-bottom: 8px;
`;

const ReviewDate = styled.span`
    color: ${colors.text.muted};
    font-size: 0.85em;
`;

const AllergenTag = styled.span`
    display: inline-block;
    background: ${colors.status.warning};
    color: ${colors.text.white};
    padding: 6px 12px;
    border-radius: 15px;
    font-size: 0.85em;
    font-weight: 600;
    margin-right: 8px;
    margin-bottom: 8px;
`;

const LabelTag = styled.span`
    display: inline-block;
    background: ${colors.status.success};
    color: ${colors.text.white};
    padding: 6px 12px;
    border-radius: 15px;
    font-size: 0.85em;
    font-weight: 600;
    margin-right: 8px;
    margin-bottom: 8px;
`;

const EmptyState = styled.div`
    text-align: center;
    padding: 40px;
    color: ${colors.text.light};
    font-size: 1em;
`;

// Mock-Daten für Gerichte
const mockGerichte = {
    1: {
        id: 1,
        name: "Pizza Margherita",
        description: "Klassische Pizza mit Tomatensauce, Mozzarella und frischem Basilikum. Gebacken im traditionellen Steinofen bei 450°C für den perfekten knusprigen Boden.",
        price: 9.50,
        category: "Hauptgericht",
        restaurantId: 1,
        restaurantName: "Bella Italia",
        allergene: ["Gluten", "Milchprodukte"],
        labels: ["Vegetarisch"],
        nährwerte: {
            kalorien: "780 kcal",
            protein: "28g",
            kohlenhydrate: "95g",
            fett: "28g"
        },
        zutaten: "Pizzateig, Tomatensauce, Mozzarella, frisches Basilikum, Olivenöl, Salz",
        zubereitungszeit: "15-20 Minuten",
        bewertungen: [
            {
                autor: "Max Mustermann",
                rating: 5,
                kommentar: "Absolut authentisch! Die beste Pizza, die ich je gegessen habe.",
                datum: "vor 2 Tagen"
            },
            {
                autor: "Anna Schmidt",
                rating: 4,
                kommentar: "Sehr lecker, der Teig könnte etwas dünner sein.",
                datum: "vor 1 Woche"
            },
            {
                autor: "Thomas Weber",
                rating: 5,
                kommentar: "Genau wie in Italien! Sehr zu empfehlen.",
                datum: "vor 2 Wochen"
            }
        ]
    },
    2: {
        id: 2,
        name: "Spaghetti Carbonara",
        description: "Cremige Spaghetti mit knusprigem Speck, Ei, Parmesan und schwarzem Pfeffer. Nach traditionellem römischen Rezept zubereitet.",
        price: 12.90,
        category: "Hauptgericht",
        restaurantId: 1,
        restaurantName: "Bella Italia",
        allergene: ["Gluten", "Eier", "Milchprodukte"],
        labels: [],
        nährwerte: {
            kalorien: "950 kcal",
            protein: "35g",
            kohlenhydrate: "88g",
            fett: "48g"
        },
        zutaten: "Spaghetti, Guanciale (Schweinebacke), Eier, Pecorino Romano, schwarzer Pfeffer",
        zubereitungszeit: "20-25 Minuten",
        bewertungen: [
            {
                autor: "Julia Meier",
                rating: 5,
                kommentar: "Die Sauce ist perfekt cremig, ohne Sahne! Authentisch!",
                datum: "vor 3 Tagen"
            },
            {
                autor: "Peter Klein",
                rating: 4,
                kommentar: "Sehr gut, aber ich hätte mehr Speck erwartet.",
                datum: "vor 1 Woche"
            }
        ]
    }
};

function GerichtDetail() {
    const { restaurantId, gerichtId } = useParams();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);

    const gericht = mockGerichte[gerichtId];

    if (!gericht) {
        return (
            <Container>
                <BackButton onClick={() => navigate(`/restaurants/${restaurantId}`)}>
                    ← Zurück zum Restaurant
                </BackButton>
                <InfoCard>
                    <h2>Gericht nicht gefunden</h2>
                </InfoCard>
            </Container>
        );
    }

    const averageRating = gericht.bewertungen.length > 0
        ? (gericht.bewertungen.reduce((sum, r) => sum + r.rating, 0) / gericht.bewertungen.length).toFixed(1)
        : 0;

    return (
        <Container>
            <BackButton onClick={() => navigate(`/restaurants/${restaurantId}`)}>
                ← Zurück zum Restaurant
            </BackButton>

            <HeaderSection>
                <EditButton onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? '✓ Speichern' : ' Bearbeiten'}
                </EditButton>

                <GerichtName>{gericht.name}</GerichtName>
                <TagsContainer>
                    <CategoryTag>{gericht.category}</CategoryTag>
                    <PriceTag>{gericht.price.toFixed(2)} €</PriceTag>
                    {gericht.bewertungen.length > 0 && (
                        <CategoryTag>⭐ {averageRating} / 5.0</CategoryTag>
                    )}
                </TagsContainer>
                <Description>{gericht.description}</Description>
                <RestaurantLink onClick={() => navigate(`/restaurants/${restaurantId}`)}>
                     {gericht.restaurantName}
                </RestaurantLink>
            </HeaderSection>

            <ContentGrid>
                <InfoCard>
                    <CardTitle> Details</CardTitle>
                    <InfoRow>
                        <Label> Kategorie:</Label>
                        <Value>{gericht.category}</Value>
                    </InfoRow>
                    <InfoRow>
                        <Label> Preis:</Label>
                        <Value>{gericht.price.toFixed(2)} €</Value>
                    </InfoRow>
                </InfoCard>

                <InfoCard>
                    <CardTitle>🥘 Zutaten</CardTitle>
                    <InfoRow>
                        <Label> Zutaten </Label>
                        <Value>{gericht.zutaten}</Value>
                    </InfoRow>
                </InfoCard>

                <FullWidthCard>
                    <CardTitle> Allergene & Labels</CardTitle>
                    <div style={{ marginBottom: '15px' }}>
                        {gericht.allergene.length > 0 ? (
                            <>
                                <Label style={{ display: 'block', marginBottom: '10px' }}> Allergene:</Label>
                                {gericht.allergene.map((allergen, index) => (
                                    <AllergenTag key={index}>{allergen}</AllergenTag>
                                ))}
                            </>
                        ) : (
                            <EmptyState>Keine Allergene angegeben</EmptyState>
                        )}
                    </div>
                    <div>
                        {gericht.labels.length > 0 ? (
                            <>
                                <Label style={{ display: 'block', marginBottom: '10px' }}>✓ Labels:</Label>
                                {gericht.labels.map((label, index) => (
                                    <LabelTag key={index}>{label}</LabelTag>
                                ))}
                            </>
                        ) : null}
                    </div>
                </FullWidthCard>

                <FullWidthCard>
                    <CardTitle>⭐ Bewertungen ({gericht.bewertungen.length})</CardTitle>
                    {gericht.bewertungen.length > 0 ? (
                        <ReviewsList>
                            {gericht.bewertungen.map((review, index) => (
                                <ReviewItem key={index}>
                                    <ReviewHeader>
                                        <ReviewAuthor>{review.autor}</ReviewAuthor>
                                        <ReviewRating>⭐ {review.rating}/5</ReviewRating>
                                    </ReviewHeader>
                                    <ReviewText>{review.kommentar}</ReviewText>
                                    <ReviewDate>{review.datum}</ReviewDate>
                                </ReviewItem>
                            ))}
                        </ReviewsList>
                    ) : (
                        <EmptyState>Noch keine Bewertungen vorhanden</EmptyState>
                    )}
                </FullWidthCard>
            </ContentGrid>
        </Container>
    );
}

export default GerichtDetail;