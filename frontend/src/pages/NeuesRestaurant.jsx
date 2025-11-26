import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import restaurantService from '../services/restaurantService';

const Container = styled.div`
    max-width: 1400px;
    margin: 0 auto;
`;

const BackButton = styled.button`
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    cursor: pointer;
    margin-bottom: 30px;
    font-size: 1em;
    font-weight: 600;
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }
`;

const HeaderSection = styled.div`
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 16px;
    padding: 40px;
    margin-bottom: 30px;
    color: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    position: relative;
`;

const EditRestaurantButton = styled.button`
    position: absolute;
    top: 20px;
    right: 20px;
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: 2px solid white;
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.95em;
    font-weight: 600;
    transition: all 0.3s ease;

    &:hover {
        background: white;
        color: #667eea;
        transform: translateY(-2px);
    }
`;

const RestaurantName = styled.h1`
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

const CuisineTag = styled.span`
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 0.95em;
    font-weight: 600;
`;

const ClassificationTag = styled.span`
    background: rgba(255, 255, 255, 0.2);
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 0.95em;
    font-weight: 600;
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
    background: white;
    border-radius: 12px;
    padding: 30px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const CardTitle = styled.h2`
    color: #2d3748;
    font-size: 1.5em;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 3px solid #f5576c;
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
    color: #2d3748;
    font-size: 1em;
`;

const Value = styled.span`
    color: #4a5568;
    flex: 1;
`;

const LoadingSpinner = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 400px;
    font-size: 1.5em;
    color: #4a5568;
`;

const ErrorMessage = styled.div`
    background: #fee;
    color: #c33;
    padding: 20px;
    border-radius: 8px;
    margin: 20px 0;
    border-left: 4px solid #c33;
`;

function RestaurantDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadRestaurantData();
    }, [id]);

    const loadRestaurantData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Restaurant-Daten laden
            const restaurantData = await restaurantService.getById(id);
            setRestaurant(restaurantData);

        } catch (err) {
            setError(err.message || 'Fehler beim Laden der Restaurant-Daten');
        } finally {
            setLoading(false);
        }
    };

    const handleEditRestaurant = () => {
        navigate(`/restaurants/${id}/edit`);
    };

    if (loading) {
        return (
            <Container>
                <BackButton onClick={() => navigate('/restaurants')}>
                    ← Zurück zur Übersicht
                </BackButton>
                <LoadingSpinner>Lädt Restaurant-Daten...</LoadingSpinner>
            </Container>
        );
    }

    if (error || !restaurant) {
        return (
            <Container>
                <BackButton onClick={() => navigate('/restaurants')}>
                    ← Zurück zur Übersicht
                </BackButton>
                <ErrorMessage>
                    <h2>❌ Fehler</h2>
                    <p>{error || 'Restaurant nicht gefunden'}</p>
                </ErrorMessage>
            </Container>
        );
    }

    return (
        <Container>
            <BackButton onClick={() => navigate('/restaurants')}>
                ← Zurück zur Übersicht
            </BackButton>

            <HeaderSection>
                <EditRestaurantButton onClick={handleEditRestaurant}>
                    ✏️ Restaurant bearbeiten
                </EditRestaurantButton>

                <RestaurantName>{restaurant.name}</RestaurantName>
                <TagsContainer>
                    {restaurant.klassifizierung && (
                        <ClassificationTag>{restaurant.klassifizierung}</ClassificationTag>
                    )}
                </TagsContainer>
            </HeaderSection>

            <ContentGrid>
                <InfoCard>
                    <CardTitle>📞 Kontakt & Standort</CardTitle>
                    <InfoRow>
                        <Label>📞 Telefon:</Label>
                        <Value>{restaurant.telefon || 'Nicht angegeben'}</Value>
                    </InfoRow>
                    <InfoRow>
                        <Label>👨‍🍳 Küchenchef:</Label>
                        <Value>{restaurant.kuechenchef || 'Nicht angegeben'}</Value>
                    </InfoRow>
                    <InfoRow>
                        <Label>📍 Adresse-ID:</Label>
                        <Value>{restaurant.adresseid || 'Nicht angegeben'}</Value>
                    </InfoRow>
                </InfoCard>

                <InfoCard>
                    <CardTitle>ℹ️ Restaurant-Info</CardTitle>
                    <InfoRow>
                        <Label>🆔 Restaurant-ID:</Label>
                        <Value>{restaurant.restaurantid}</Value>
                    </InfoRow>
                    <InfoRow>
                        <Label>🏷️ Klassifizierung:</Label>
                        <Value>{restaurant.klassifizierung || 'Nicht angegeben'}</Value>
                    </InfoRow>
                </InfoCard>
            </ContentGrid>
        </Container>
    );
}

export default RestaurantDetail;
