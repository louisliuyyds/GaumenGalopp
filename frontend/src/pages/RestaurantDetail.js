import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import colors from '../theme/colors';
import { restaurantService } from '../services';
import restaurantOeffnungszeitService from '../services/restaurantOeffnungszeitService';
import oeffnungszeitDetailService from '../services/oeffnungszeitDetailService';
import { useAuth } from '../context/AuthContext';
import EditNavigationTabs from '../components/EditNavigationTabs';
import { warenkorbService } from "../services/warenkorbService";

// ==================== STYLED COMPONENTS ====================

const Container = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
`;

const BackButton = styled.button`
    background: white;
    color: ${colors.text.primary};
    border: 2px solid ${colors.border.light};
    padding: 12px 28px;
    border-radius: 12px;
    cursor: pointer;
    margin-bottom: 30px;
    font-size: 1em;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: ${colors.shadows.small};
    display: flex;
    align-items: center;
    gap: 8px;

    &:hover {
        background: #f8f9fa;
        transform: translateX(-5px);
        border-color: ${colors.accent.orange};
        box-shadow: ${colors.shadows.medium};
    }
`;

const AddButton = styled.button`
    background: ${colors.gradients.accent};
    color: white;
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 10px;
    cursor: pointer;
    font-weight: bold;
    font-size: 1.3rem;
    transition: all 0.2s ease;
    box-shadow: ${colors.shadows.small};

    &:hover {
        transform: scale(1.1) rotate(90deg);
        box-shadow: ${colors.shadows.medium};
    }

    &:active {
        transform: scale(0.95);
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
    }
`;

const RestaurantHeader = styled.div`
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

const RestaurantName = styled.h1`
    color: #ffffff;
    font-size: 2.8em;
    margin-bottom: 15px;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 15px;
    position: relative;
    z-index: 1;
`;

const RatingBadge = styled.div`
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(5px);
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    border: 1px solid rgba(255, 255, 255, 0.3);
`;

const RestaurantMeta = styled.div`
    display: flex;
    gap: 30px;
    flex-wrap: wrap;
    font-size: 1.1em;
    margin-top: 20px;
    position: relative;
    z-index: 1;
`;

const MetaItem = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    color: rgba(255, 255, 255, 0.95);
`;

const Section = styled.div`
    background: ${colors.background.card};
    border-radius: 16px;
    padding: 40px;
    margin-bottom: 35px;
    box-shadow: ${colors.shadows.medium};
    border: 2px solid ${colors.border.light};
    transition: all 0.3s ease;

    &:hover {
        box-shadow: ${colors.shadows.large};
    }
`;

const SectionTitle = styled.h2`
    color: ${colors.text.primary};
    font-size: 2.2em;
    margin-bottom: 30px;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 12px;
    position: relative;
    padding-bottom: 15px;

    &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 80px;
        height: 4px;
        background: ${colors.gradients.accent};
        border-radius: 2px;
    }
`;

const HighlightGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 25px;
`;

const HighlightCard = styled.div`
    background: white;
    border: 2px solid #f4c542;
    border-radius: 16px;
    padding: 25px;
    transition: all 0.3s ease;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(212, 175, 55, 0.15);

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 5px;
        background: linear-gradient(90deg, #8a6d3b 0%, #b8860b 50%, #8a6d3b 100%);
    }

    &:hover {
        transform: translateY(-8px);
        box-shadow: 0 12px 24px rgba(212, 175, 55, 0.3);
        border-color: #b8860b;
    }
`;

const CriticBadge = styled.div`
    background: linear-gradient(135deg, #8a6d3b 0%, #b8860b 100%);
    color: white;
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 700;
    display: inline-block;
    margin-bottom: 12px;
    box-shadow: 0 2px 8px rgba(138, 109, 59, 0.3);
`;

const FavoriteCard = styled.div`
    background: white;
    border: 2px solid ${colors.primary.light};
    border-radius: 16px;
    padding: 25px;
    transition: all 0.3s ease;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(52, 152, 219, 0.12);

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 5px;
        background: ${colors.gradients.primary};
    }

    &:hover {
        transform: translateY(-8px);
        box-shadow: 0 12px 24px rgba(52, 152, 219, 0.25);
        border-color: ${colors.primary.main};
    }
`;

const CustomerBadge = styled.div`
    background: ${colors.gradients.primary};
    color: white;
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 700;
    display: inline-block;
    margin-bottom: 12px;
    box-shadow: 0 2px 8px rgba(52, 152, 219, 0.3);
`;

const GerichtName = styled.h3`
    color: ${colors.text.primary};
    font-size: 1.4em;
    margin-bottom: 10px;
    font-weight: 700;
`;

const GerichtBeschreibung = styled.p`
    color: ${colors.text.light};
    font-size: 0.9em;
    margin-bottom: 12px;
    line-height: 1.4;
`;

const GerichtMeta = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid ${colors.border.light};
`;

const Rating = styled.div`
    font-size: 1.15em;
    font-weight: 700;
    color: ${colors.accent.orange};
    display: flex;
    align-items: center;
    gap: 6px;
`;

const ReviewCount = styled.span`
    font-size: 0.85em;
    color: ${colors.text.light};
`;

const Kommentar = styled.div`
    background: ${colors.background.main};
    padding: 12px;
    border-radius: 8px;
    margin-top: 10px;
    font-size: 0.9em;
    color: ${colors.text.secondary};
    font-style: italic;
    border-left: 3px solid ${colors.primary.main};
`;

const MenuSection = styled(Section)`
    margin-top: 40px;
`;

const MenuCategory = styled.div`
    margin-bottom: 35px;
`;

const CategoryTitle = styled.h3`
    color: ${colors.text.primary};
    font-size: 1.8em;
    margin-bottom: 25px;
    font-weight: 700;
    border-bottom: 3px solid ${colors.accent.orange};
    padding-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 10px;
`;

const GerichtItem = styled.div`
    padding: 25px;
    border-radius: 12px;
    margin-bottom: 18px;
    background: white;
    border: 2px solid ${colors.border.light};
    transition: all 0.3s ease;
    cursor: pointer;
    box-shadow: ${colors.shadows.small};

    &:hover {
        transform: translateX(8px);
        box-shadow: ${colors.shadows.medium};
        border-color: ${colors.accent.orange};
    }
`;

const LoadingState = styled.div`
    text-align: center;
    padding: 80px 20px;
    font-size: 1.3em;
    color: ${colors.text.light};
`;

const ErrorMessage = styled.div`
    background: ${colors.status.errorLight};
    color: ${colors.status.error};
    padding: 20px;
    border-radius: 8px;
    margin: 20px 0;
    text-align: center;
`;

const EmptyState = styled.div`
    text-align: center;
    padding: 40px;
    color: ${colors.text.light};
    font-size: 1.1em;
`;

const OpeningHoursSection = styled(Section)`
    margin-top: 40px;
`;

const HoursRow = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 15px 20px;
    border-radius: 8px;
    margin-bottom: 8px;
    background: white;
    border: 1px solid ${colors.border.light};
    transition: all 0.2s ease;

    &:hover {
        background: ${colors.background.main};
        border-color: ${colors.primary.light};
    }
`;

const DayLabel = styled.span`
    font-weight: 600;
    color: ${colors.text.primary};
`;

const TimeValue = styled.span`
    color: ${props => props.closed ? colors.status.error : colors.text.secondary};
    font-weight: ${props => props.closed ? '600' : '500'};
`;

const WOCHENTAGE = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];

function RestaurantDetails() {
    const { id } = useParams();
    const navigate = useNavigate();



    const [restaurant, setRestaurant] = useState(null);
    const [bewertungen, setBewertungen] = useState(null);
    const [kritikerHighlights, setKritikerHighlights] = useState([]);
    const [customerFavorites, setCustomerFavorites] = useState([]);
    const [openingHours, setOpeningHours] = useState([]);
    const [loadingHours, setLoadingHours] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { user, isRestaurant } = useAuth();
    const isOwnRestaurant = isRestaurant && user?.user_id === restaurant?.restaurantid;



    useEffect(() => {
        loadRestaurantData();
    }, [id]);

    const loadRestaurantData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Parallel laden für bessere Performance
            const [
                restaurantData,
                bewertungenData,
                highlightsData,
                favoritesData,
            ] = await Promise.all([
                restaurantService.getById(id),
                restaurantService.getRestaurantBewertungen(id).catch(() => null),
                restaurantService.getKritikerHighlights(id).catch(() => []),
                restaurantService.getCustomerFavorites(id).catch(() => []),
            ]);

            setRestaurant(restaurantData);
            setBewertungen(bewertungenData);
            setKritikerHighlights(highlightsData);
            setCustomerFavorites(favoritesData);

        } catch (err) {
            console.error('❌ Fehler beim Laden:', err);
            setError('Restaurant konnte nicht geladen werden.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRestaurantData();
    }, [id]);

// Öffnungszeiten laden
    useEffect(() => {
        const loadOpeningHours = async () => {
            try {
                setLoadingHours(true);
                const assignments = await restaurantOeffnungszeitService.getActiveForRestaurant(id);

                if (assignments && assignments.length > 0) {
                    const vorlageId = assignments[0].oeffnungszeitid;
                    const details = await oeffnungszeitDetailService.getByVorlageId(vorlageId);

                    if (details && details.length > 0) {
                        const sorted = [...details].sort((a, b) => a.wochentag - b.wochentag);
                        setOpeningHours(sorted);
                    }
                }
            } catch (err) {
                console.error('❌ Fehler beim Laden der Öffnungszeiten:', err);
            } finally {
                setLoadingHours(false);
            }
        };

        if (id) loadOpeningHours();
    }, [id]);

    const handleGerichtClick = (gerichtId) => {
        navigate(`/restaurants/${id}/gericht/${gerichtId}`);
    };

    const getActivePrice = (preisArray) => {
        if (!preisArray || preisArray.length === 0) return null;
        const activePrice = preisArray.find(p => p.istaktiv === true);
        return activePrice || preisArray[0]; // Fallback to first if no active
    };

    const getActivePriceId = (preisArray) => {
        if (!preisArray || preisArray.length === 0) return null;

        // Suche aktiven Preis (istaktiv: true)
        const activePrice = preisArray.find(p => p.istaktiv === true);
        if (activePrice) {
            return activePrice.preisid;
        }

        // Fallback: Ersten Preis nehmen
        return preisArray[0].preisid;
    };

    const handleAddToCart = async (gericht) => {
        if (!user || !user.user_id) {
            alert('Bitte melden Sie sich an, um Artikel in den Warenkorb zu legen.');
            return;
        }
        if (window.confirm('Artikel in den Warenkorb hinzufügen?')) {
            const kundenId = user.user_id; // ✅ Verwende die echte Kunden-ID aus dem Auth-Context
            try {
                const itemData = {
                    restaurantid: parseInt(restaurant.restaurantid),
                    gerichtid: parseInt(gericht.gerichtid),
                    preisid: getActivePriceId(gericht.preis),
                    menge: 1,
                    aenderungswunsch: null
                };

                console.log('Sending to cart:', itemData);
                console.log('KundenID:', kundenId);

                await warenkorbService.addItem(kundenId, itemData);
                alert('Artikel wurde dem Warenkorb hinzugefügt!');
            } catch (err) {
                console.error('Fehler beim Hinzufügen:', err);
                console.error('Fehlerdetails:', err.response?.data);
                alert('Fehler beim Hinzufügen des Artikels');
            }
        }
    };

    const renderSterne = (rating) => {
        return '⭐'.repeat(Math.round(rating));
    };

    if (loading) {
        return (
            <Container>
                <LoadingState>
                    <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🍽️</div>
                    Lade Restaurant...
                </LoadingState>
            </Container>
        );
    }

    if (error || !restaurant) {
        return (
            <Container>
                <BackButton onClick={() => navigate('/restaurants')}>
                    ← Zurück zur Übersicht
                </BackButton>
                <ErrorMessage>{error || 'Restaurant nicht gefunden'}</ErrorMessage>
            </Container>
        );
    }

    return (
        <Container>
            <BackButton onClick={() => navigate('/restaurants')}>
                ← Zurück zur Übersicht
            </BackButton>

            {/* RESTAURANT HEADER */}
            <RestaurantHeader>
                <RestaurantName>
                    {restaurant.name}
                    {bewertungen && bewertungen.anzahl_gesamt > 0 && (
                        <RatingBadge>
                            ⭐ {bewertungen.durchschnitt_gesamt}
                            <span style={{ fontSize: '0.85em', opacity: 0.9 }}>
                                ({bewertungen.anzahl_gesamt} Bewertungen)
                            </span>
                        </RatingBadge>
                    )}
                </RestaurantName>

                <RestaurantMeta>
                    {restaurant.klassifizierung && (
                        <MetaItem>🏷️ {restaurant.klassifizierung}</MetaItem>
                    )}
                    {restaurant.kuechenchef && (
                        <MetaItem>👨‍🍳 {restaurant.kuechenchef}</MetaItem>
                    )}
                    {restaurant.adresse && (
                        <MetaItem>
                            📍 {restaurant.adresse.straße} {restaurant.adresse.hausnummer},{' '}
                            {restaurant.adresse.postleitzahl} {restaurant.adresse.ort}
                        </MetaItem>
                    )}
                    {restaurant.telefon && (
                        <MetaItem>📞 {restaurant.telefon}</MetaItem>
                    )}
                </RestaurantMeta>
                {isOwnRestaurant && (
                    <div style={{ marginTop: '20px' }}>
                        <button
                            onClick={() => navigate(`/restaurants/${id}/edit`)}
                            style={{
                                background: 'rgba(255,255,255,0.95)',
                                color: '#8a6d3b',
                                border: '2px solid rgba(255,255,255,0.3)',
                                padding: '10px 20px',
                                borderRadius: '8px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                fontSize: '0.95em',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                            onMouseOver={(e) => {
                                e.target.style.background = 'white';
                                e.target.style.transform = 'translateY(-1px)';
                                e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.background = 'rgba(255,255,255,0.95)';
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
                            }}
                        >
                            ✏️ Restaurant bearbeiten
                        </button>
                    </div>
                )}
            </RestaurantHeader>

            {/* KRITIKER HIGHLIGHTS */}
            {kritikerHighlights.length > 0 && (
                <Section>
                    <SectionTitle>⭐ Kritiker-Highlights</SectionTitle>
                    <HighlightGrid>
                        {kritikerHighlights.map((gericht) => (
                            <HighlightCard
                                key={gericht.gerichtid}
                                onClick={() => handleGerichtClick(gericht.gerichtid)}
                            >
                                <CriticBadge>Kritiker-Empfehlung</CriticBadge>
                                <GerichtName>{gericht.name}</GerichtName>
                                {gericht.beschreibung && (
                                    <GerichtBeschreibung>
                                        {gericht.beschreibung}
                                    </GerichtBeschreibung>
                                )}
                                {gericht.kategorie && (
                                    <div style={{ fontSize: '0.85em', color: colors.text.light, marginBottom: '10px' }}>
                                        {gericht.kategorie}
                                    </div>
                                )}
                                <GerichtMeta>
                                    <Rating>
                                        {renderSterne(gericht.durchschnitt)} {gericht.durchschnitt}
                                    </Rating>
                                    <ReviewCount>
                                        {gericht.anzahl_bewertungen} Kritiker
                                    </ReviewCount>
                                </GerichtMeta>
                            </HighlightCard>
                        ))}
                    </HighlightGrid>
                </Section>
            )}

            {/* CUSTOMER FAVORITES */}
            {customerFavorites.length > 0 && (
                <Section>
                    <SectionTitle>👥 Customer Favorites</SectionTitle>
                    <HighlightGrid>
                        {customerFavorites.map((gericht) => (
                            <FavoriteCard
                                key={gericht.gerichtid}
                                onClick={() => handleGerichtClick(gericht.gerichtid)}
                            >
                                <CustomerBadge>Kundenliebling</CustomerBadge>
                                <GerichtName>{gericht.name}</GerichtName>
                                {gericht.beschreibung && (
                                    <GerichtBeschreibung>
                                        {gericht.beschreibung}
                                    </GerichtBeschreibung>
                                )}
                                {gericht.kategorie && (
                                    <div style={{ fontSize: '0.85em', color: colors.text.light, marginBottom: '10px' }}>
                                        {gericht.kategorie}
                                    </div>
                                )}
                                <GerichtMeta>
                                    <Rating>
                                        {renderSterne(gericht.durchschnitt_kunden)} {gericht.durchschnitt_kunden}
                                    </Rating>
                                    <ReviewCount>
                                        {gericht.anzahl_bewertungen} Bewertungen
                                    </ReviewCount>
                                </GerichtMeta>
                                {gericht.beispiel_kommentare && gericht.beispiel_kommentare.length > 0 && (
                                    <Kommentar>
                                        "{gericht.beispiel_kommentare[0]}"
                                    </Kommentar>
                                )}
                            </FavoriteCard>
                        ))}
                    </HighlightGrid>
                </Section>
            )}
            {/* ÖFFNUNGSZEITEN */}
            <OpeningHoursSection>
                <SectionTitle>🕐 Öffnungszeiten</SectionTitle>
                {loadingHours ? (
                    <EmptyState>Lade Öffnungszeiten...</EmptyState>
                ) : openingHours.length > 0 ? (
                    openingHours.map((day) => (
                        <HoursRow key={day.wochentag}>
                            <DayLabel>{WOCHENTAGE[day.wochentag - 1]}</DayLabel>
                            <TimeValue closed={day.ist_geschlossen}>
                                {day.ist_geschlossen
                                    ? 'Geschlossen'
                                    : `${day.oeffnungszeit?.slice(0, 5)} - ${day.schliessungszeit?.slice(0, 5)} Uhr`
                                }
                            </TimeValue>
                        </HoursRow>
                    ))
                ) : (
                    <EmptyState>Keine Öffnungszeiten hinterlegt</EmptyState>
                )}
            </OpeningHoursSection>

            {/* MENÜ ÜBERSICHT */}
            {restaurant.menue && restaurant.menue.length > 0 && (
                <MenuSection>
                    <SectionTitle>📋 Menü</SectionTitle>
                    {restaurant.menue.map((menu) => (
                        <div key={menu.menuid}>
                            {menu.gericht && menu.gericht.length > 0 && (
                                <MenuCategory>
                                    <CategoryTitle>{menu.name}</CategoryTitle>
                                    {menu.gericht.map((gericht) => (
                                        <GerichtItem
                                            key={gericht.gerichtid}
                                            onClick={() => handleGerichtClick(gericht.gerichtid)}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                                <div style={{ flex: 1 }}>
                                                    <GerichtName style={{ fontSize: '1.2em', marginBottom: '5px' }}>
                                                        {gericht.name}
                                                    </GerichtName>
                                                    {gericht.beschreibung && (
                                                        <GerichtBeschreibung>
                                                            {gericht.beschreibung}
                                                        </GerichtBeschreibung>
                                                    )}
                                                    {gericht.kategorie && (
                                                        <div style={{ fontSize: '0.85em', color: colors.text.light, marginTop: '8px' }}>
                                                            🏷️ {gericht.kategorie}
                                                        </div>
                                                    )}
                                                </div>
                                                {gericht.preis && gericht.preis.length > 0 && (
                                                    <div style={{
                                                        fontSize: '1.4em',
                                                        fontWeight: '700',
                                                        color: colors.accent.orange,
                                                        marginLeft: '20px',
                                                        marginRight: '10px',
                                                        minWidth: '80px',
                                                        textAlign: 'right'
                                                    }}>
                                                        {getActivePrice(gericht.preis)?.betrag.toFixed(2)}€
                                                    </div>
                                                )}

                                            <AddButton
                                                title="In den Warenkorb"
                                                onClick={() => handleAddToCart(gericht)}
                                                disabled={!getActivePriceId(gericht.preis)}
                                             >
                                                +
                                            </AddButton>

                                            </div>

                                        </GerichtItem>
                                    ))}
                                </MenuCategory>
                            )}
                        </div>
                    ))}
                </MenuSection>
            )}

            {(!restaurant.menue || restaurant.menue.length === 0) && (
                <EmptyState>
                    Dieses Restaurant hat noch keine Gerichte im Menü.
                </EmptyState>
            )}
        </Container>
    );
}

export default RestaurantDetails;