import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import colors from '../theme/colors';
import MenuSection from '../components/MenuSection';
import restaurantService from '../services/restaurantService';

// --- VERBESSERTE STYLED COMPONENTS ---

const Container = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px;
    font-family: 'Inter', sans-serif;
`;

const BackButton = styled.button`
    background: white;
    color: ${colors.text.primary};
    border: 1px solid ${colors.border.light};
    padding: 10px 20px;
    border-radius: 12px;
    cursor: pointer;
    margin-bottom: 25px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;
    box-shadow: 0 2px 5px rgba(0,0,0,0.05);

    &:hover {
        background: #f8f9fa;
        transform: translateX(-5px);
        border-color: ${colors.accent.orange};
    }
`;

const HeaderSection = styled.div`

    background: linear-gradient(135deg, #8a6d3b 0%, #b8860b 100%);

   
    box-shadow: inset 0 0 50px rgba(0,0,0,0.1), 0 10px 30px rgba(0,0,0,0.1);

    border-radius: 24px;
    padding: 60px 50px;
    margin-bottom: 40px;
    color: #ffffff; 
    position: relative;
    overflow: hidden;


    &::after {
        content: "";
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
        pointer-events: none;
    }
`;

const BadgeContainer = styled.div`
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin: 20px 0;
`;

const KochstilBadge = styled.span`
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(5px);
    color: white;
    padding: 8px 18px;
    border-radius: 100px;
    font-size: 0.85rem;
    font-weight: 600;
    border: 1px solid rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    gap: 6px;
`;

const ContentGrid = styled.div`
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    gap: 30px;
    margin-bottom: 50px;
    @media (max-width: 968px) { grid-template-columns: 1fr; }
`;

const InfoCard = styled.div`
    background: white;
    border-radius: 24px;
    padding: 35px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
    border: 1px solid ${colors.border.light};
    transition: transform 0.3s ease;

    &:hover {
        transform: translateY(-5px);
    }
`;

const CardTitle = styled.h2`
    color: ${colors.text.primary};
    font-size: 1.4rem;
    margin-bottom: 25px;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 10px;

    &::after {
        content: "";
        flex: 1;
        height: 1px;
        background: #eee;
    }
`;

const InfoRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 15px 0;
    border-bottom: 1px solid #f5f5f5;
    &:last-child { border-bottom: none; }
`;

const Label = styled.span`
    font-weight: 600;
    color: ${colors.text.secondary};
    display: flex;
    align-items: center;
    gap: 8px;
`;

const Value = styled.span`
    color: ${colors.text.primary};
    text-align: right;
    font-weight: 500;
`;

const LoadingState = styled.div`
    text-align: center;
    padding: 150px 20px;
    font-size: 1.5rem;
    color: ${colors.text.light};
`;

// --- HAUPTKOMPONENTE (LOGIK UNVERÄNDERT) ---

function RestaurantDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRestaurantData = async () => {
            try {
                setLoading(true);
                const data = await restaurantService.getById(id);
                setRestaurant(data);
            } catch (err) {
                console.error("❌ Ladefehler:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchRestaurantData();
    }, [id]);

    if (loading) {
        return (
            <Container>
                <LoadingState>
                    <div style={{fontSize: '3rem', marginBottom: '20px'}}>🍳</div>
                    Dein Genuss-Moment wird vorbereitet...
                </LoadingState>
            </Container>
        );
    }

    if (!restaurant) {
        return (
            <Container>
                <BackButton onClick={() => navigate('/kunde')}>← Zurück</BackButton>
                <div style={{textAlign: 'center', padding: '50px'}}>
                    <h2>Restaurant nicht gefunden</h2>
                </div>
            </Container>
        );
    }

    const totalDishes = restaurant.menue?.reduce((sum, menu) => sum + (menu.gericht?.length || 0), 0) || 0;

    const renderAddress = () => {
        if (!restaurant.adresse) return "Wird geladen...";
        const { straße, hausnummer, postleitzahl, ort } = restaurant.adresse;
        if (!straße && !ort) return "Adresse nicht verfügbar";
        return (
            <div style={{lineHeight: '1.5'}}>
                {straße} {hausnummer}<br/>
                <span style={{color: colors.text.light}}>{postleitzahl} {ort}</span>
            </div>
        );
    };
    
    return (
        <Container>
            <BackButton onClick={() => navigate('/kunde')}>
                <span>←</span> Zurück zur Übersicht
            </BackButton>

            <HeaderSection>
                <h1 style={{ fontSize: '3.2rem', marginBottom: '10px', fontWeight: '800' }}>
                    {restaurant.name}
                </h1>

                <BadgeContainer>
                    {restaurant.kochstile?.map((stil, idx) => (
                        <KochstilBadge key={idx}>
                            🍳 {stil.kochstil}
                        </KochstilBadge>
                    ))}
                    <KochstilBadge style={{background: colors.accent.orange, border: 'none'}}>
                        ⭐ 4.9 (Top Rated)
                    </KochstilBadge>
                </BadgeContainer>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', opacity: 0.9 }}>
                    <p style={{ fontSize: '1.1rem' }}>
                        <strong>{restaurant.klassifizierung || 'Premium Gastronomie'}</strong>
                    </p>
                    <span>•</span>
                    <p style={{ fontSize: '1.1rem' }}>
                        👨‍🍳 Chef: {restaurant.kuechenchef || 'Unser Küchenteam'}
                    </p>
                </div>
            </HeaderSection>

            <ContentGrid>
                <InfoCard>
                    <CardTitle>📍 Standort & Kontakt</CardTitle>
                    <InfoRow>
                        <Label>🏠 Adresse</Label>
                        <Value>{renderAddress()}</Value>
                    </InfoRow>
                    <InfoRow>
                        <Label>📞 Telefon</Label>
                        <Value>{restaurant.telefon || '+49 (0) 123 456789'}</Value>
                    </InfoRow>
                    <InfoRow>
                        <Label>📧 E-Mail</Label>
                        <Value>{restaurant.email || `info@${restaurant.name.toLowerCase().replace(/\s/g, '')}.de`}</Value>
                    </InfoRow>
                </InfoCard>

                <InfoCard>
                    <CardTitle>🕐 Öffnungszeiten</CardTitle>
                    <InfoRow>
                        <Label>Mo - Fr</Label>
                        <Value>11:30 - 22:00 Uhr</Value>
                    </InfoRow>
                    <InfoRow>
                        <Label>Samstag</Label>
                        <Value>12:00 - 23:30 Uhr</Value>
                    </InfoRow>
                    <InfoRow>
                        <Label>Sonntag</Label>
                        <Value style={{color: colors.accent.orange}}>12:00 - 21:00 Uhr</Value>
                    </InfoRow>
                </InfoCard>
            </ContentGrid>

            {/* Speisekarte */}
            <div style={{marginTop: '60px'}}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px'}}>
                    <span style={{background: '#eee', padding: '5px 15px', borderRadius: '10px', fontSize: '0.9rem', fontWeight: '600'}}>
                        {totalDishes} Gerichte
                    </span>
                </div>
                <MenuSection restaurant={restaurant} />
            </div>
        </Container>
    );
}

export default RestaurantDetail;