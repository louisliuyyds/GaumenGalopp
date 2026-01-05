import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import colors from '../theme/colors';
import restaurantService from '../services/restaurantService';
import bestellungService from '../services/bestellungService';



const Container = styled.div`
    max-width: 1400px;
    margin: 0 auto;
    padding: 30px 20px;
    background: ${colors.background.main};
    min-height: 100vh;
    font-family: 'Inter', -apple-system, sans-serif;
`;

const HeroSection = styled.div`
    background: ${colors.gradients.luxury || 'linear-gradient(135deg, #1a1a1a 0%, #3a3a3a 100%)'};
    border-radius: 24px;
    padding: 80px 40px;
    margin-bottom: 50px;
    text-align: center;
    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
    position: relative;
    overflow: hidden;

    &::after {
        content: "";
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        background: url('https://www.transparenttextures.com/patterns/cubes.png');
        opacity: 0.05;
    }
`;

const HeroTitle = styled.h1`
    color: white;
    font-size: 3.5rem;
    margin-bottom: 15px;
    font-weight: 800;
    letter-spacing: -1px;
    position: relative;
    z-index: 1;
`;

const HeroSubtitle = styled.p`
    color: rgba(255, 255, 255, 0.9);
    font-size: 1.25rem;
    margin-bottom: 40px;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
    position: relative;
    z-index: 1;
`;

const SearchWrapper = styled.div`
    position: relative;
    max-width: 650px;
    margin: 0 auto;
    z-index: 1;
`;

const SearchInput = styled.input`
    width: 100%;
    padding: 20px 30px;
    border: none;
    border-radius: 100px;
    font-size: 1.1rem;
    background: white;
    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    transition: all 0.3s ease;

    &:focus {
        outline: none;
        box-shadow: 0 10px 30px rgba(255, 107, 53, 0.3);
        transform: translateY(-2px);
    }
`;

const SectionTitle = styled.h2`
    color: ${colors.text.primary};
    font-size: 2rem;
    margin: 40px 0 25px 0;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 15px;
`;

const CategoryBar = styled.div`
    display: flex;
    gap: 12px;
    margin-bottom: 35px;
    overflow-x: auto;
    padding: 5px 5px 15px 5px;
    scrollbar-width: none;
    &::-webkit-scrollbar { display: none; }
`;

const CategoryButton = styled.button`
    padding: 12px 24px;
    border-radius: 100px;
    border: 1px solid ${props => props.$active ? 'transparent' : colors.border.light};
    background: ${props => props.$active ? colors.gradients.accent : 'white'};
    color: ${props => props.$active ? 'white' : colors.text.primary};
    cursor: pointer;
    font-weight: 600;
    box-shadow: ${props => props.$active ? '0 4px 15px rgba(255, 107, 53, 0.3)' : '0 2px 5px rgba(0,0,0,0.05)'};
    white-space: nowrap;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 20px rgba(0,0,0,0.1);
        border-color: ${props => !props.$active && colors.accent.orange};
    }
`;

const RestaurantGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 35px;
`;

const RestaurantCard = styled.div`
    background: white;
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
    border: 1px solid ${colors.border.light};
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    position: relative;

    &:hover {
        transform: translateY(-12px);
        box-shadow: 0 20px 40px rgba(0,0,0,0.12);
    }
`;

const CardImage = styled.div`
    height: 180px;
    background: ${colors.gradients.primary || 'linear-gradient(45deg, #f3f4f6, #e5e7eb)'};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 4rem;
    position: relative;

    &::after {
        content: "⭐ 4.8";
        position: absolute;
        top: 15px;
        right: 15px;
        background: white;
        padding: 5px 12px;
        border-radius: 100px;
        font-size: 0.8rem;
        font-weight: 700;
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    }
`;

const CardContent = styled.div`
    padding: 24px;

    .klass {
        color: ${colors.accent.orange};
        font-weight: 700;
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        margin-bottom: 8px;
    }

    h3 {
        margin: 0 0 12px 0;
        font-size: 1.5rem;
        color: ${colors.text.primary};
        font-weight: 700;
    }
`;

const InfoRow = styled.div`
    display: flex;
    align-items: center;
    gap: 15px;
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #f0f0f0;
    color: ${colors.text.light};
    font-size: 0.85rem;
`;

const KochstilBadge = styled.span`
    background: #fff5f2;
    color: ${colors.accent.orange};
    padding: 6px 12px;
    border-radius: 8px;
    font-size: 0.75rem;
    font-weight: 600;
    display: inline-block;
    margin-right: 8px;
    margin-bottom: 8px;
    border: 1px solid rgba(255, 107, 53, 0.1);
`;

// --- HAUPTKOMPONENTE

function KundeHome() {
    const navigate = useNavigate();
    const [restaurants, setRestaurants] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('Alle');
    const [searchQuery, setSearchQuery] = useState('');

    const TEST_KUNDEN_ID = 20;

    const getDeliveryTime = (restaurantId) => {
        const seed = restaurantId * 7;
        const min = 15 + (seed % 20);
        return `${min}-${min + 10} Min`;
    };

    useEffect(() => {
        const loadDashboardData = async () => {
            setLoading(true);
            try {
                const [resData, orderData] = await Promise.all([
                    restaurantService.getAll(),
                    bestellungService.getByKunde(TEST_KUNDEN_ID)
                ]);
                setRestaurants(resData || []);
                setRecentOrders(Array.isArray(orderData) ? orderData.slice(0, 4) : []);
            } catch (err) {
                console.error("Datenladefehler:", err);
            } finally {
                setLoading(false);
            }
        };
        loadDashboardData();
    }, []);

    const categories = ['Alle', ...new Set(restaurants.map(r => r.klassifizierung).filter(Boolean))];
    categories.sort((a, b) => {
        if (a === 'Alle') return -1;
        if (b === 'Alle') return 1;
        return (parseInt(a.match(/\d+/) || 0)) - (parseInt(b.match(/\d+/) || 0));
    });

    const filteredRestaurants = restaurants.filter(res => {
        const matchesCategory = filter === 'Alle' || res.klassifizierung === filter;
        const searchLower = searchQuery.toLowerCase();
        const matchesName = res.name.toLowerCase().includes(searchLower);
        const matchesKochstil = res.kochstile?.some(stil => stil.kochstil.toLowerCase().includes(searchLower));
        return matchesCategory && (searchQuery === '' || matchesName || matchesKochstil);
    });

    if (loading) return (
        <Container style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <div style={{textAlign: 'center'}}>
                <span style={{fontSize: '3rem'}}>🍽️</span>
                <p style={{marginTop: '20px', fontWeight: '600', color: colors.text.light}}>GaumenGalopp wird vorbereitet...</p>
            </div>
        </Container>
    );

    return (
        <Container>
            <HeroSection>
                <HeroTitle>Hungrig auf Exzellenz?</HeroTitle>
                <HeroSubtitle>Entdecke die besten Restaurants in deiner Umgebung und lass es dir blitzschnell liefern.</HeroSubtitle>
                <SearchWrapper>
                    <SearchInput
                        placeholder="Nach Restaurant oder Küche suchen..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </SearchWrapper>
            </HeroSection>

            <SectionTitle>
                Küchen entdecken
                {searchQuery && (
                    <span style={{ fontSize: '0.9rem', color: colors.accent.orange, fontWeight: '500', marginLeft: 'auto' }}>
                        {filteredRestaurants.length} Treffer
                    </span>
                )}
            </SectionTitle>

            <CategoryBar>
                {categories.map(cat => (
                    <CategoryButton
                        key={cat}
                        $active={filter === cat}
                        onClick={() => setFilter(cat)}
                    >
                        {cat}
                    </CategoryButton>
                ))}
            </CategoryBar>

            <RestaurantGrid>
                {filteredRestaurants.map(res => (
                    <RestaurantCard
                        key={res.restaurantid}
                        onClick={() => navigate(`/kunde/restaurants/${res.restaurantid}`)}
                    >
                        <CardImage>
                            {(() => {
                                // 1. Wir sammeln alle Texte, die etwas über das Essen aussagen könnten
                                // Wir prüfen die Klassifizierung (als String oder Objekt-Eigenschaft)
                                const klassText = typeof res.klassifizierung === 'string'
                                    ? res.klassifizierung
                                    : (res.klassifizierung?.name || res.klassifizierung?.bezeichnung || "");

                                // Wir nehmen die Kochstile dazu (z.B. "Italienisch", "Vegan")
                                const stileText = res.kochstile?.map(s => s.kochstil).join(" ") || "";

                                // Alles kombinieren und in Kleinschreibung umwandeln für die Suche
                                const fullInfo = `${klassText} ${stileText}`.toLowerCase();

                                // 2. Zuordnung der Icons basierend auf Stichworten
                                if (fullInfo.includes('pizza') || fullInfo.includes('ital')) return '🍕';
                                if (
                                    fullInfo.includes('fast food') ||
                                    fullInfo.includes('imbiss') ||
                                    fullInfo.includes('pommes') ||
                                    fullInfo.includes('fritten') ||
                                    fullInfo.includes('snack') ||
                                    fullInfo.includes('hotdog')
                                ) return '🍟';
                                if (fullInfo.includes('burger') || fullInfo.includes('steak') || fullInfo.includes('amerika')) return '🍔';
                                if (fullInfo.includes('sushi') || fullInfo.includes('japan')) return '🍣';
                                if (fullInfo.includes('vietnam') || fullInfo.includes('asia') || fullInfo.includes('nudel') || fullInfo.includes('thai')) return '🍜';
                                if (fullInfo.includes('döner') || fullInfo.includes('türk') || fullInfo.includes('kebab') || fullInfo.includes('orient')) return '🥙';
                                if (fullInfo.includes('indisch') || fullInfo.includes('curry')) return '🍛';
                                if (fullInfo.includes('deutsch') || fullInfo.includes('schnitzel') || fullInfo.includes('hausmann')) return '🥩';
                                if (fullInfo.includes('salat') || fullInfo.includes('vegan') || fullInfo.includes('vegetar')) return '🥗';
                                if (fullInfo.includes('süß') || fullInfo.includes('eis') || fullInfo.includes('nachtisch') || fullInfo.includes('crepe')) return '🍦';
                                if (fullInfo.includes('caf') || fullInfo.includes('kaffee') || fullInfo.includes('kuchen')) return '☕';

                                // 3. Absolut sicherer Fallback (Ein Teller mit Besteck)
                                return '🍽️';
                            })()}
                        </CardImage>
                        <CardContent>
                            <div className="klass">{res.klassifizierung || 'Gastronomie'}</div>
                            <h3>{res.name}</h3>

                            <div style={{ minHeight: '40px' }}>
                                {res.kochstile?.map((stil, idx) => {
                                    const isHighlighted = searchQuery && stil.kochstil.toLowerCase().includes(searchQuery.toLowerCase());
                                    return (
                                        <KochstilBadge
                                            key={idx}
                                            style={isHighlighted ? { background: colors.accent.orange, color: 'white' } : {}}
                                        >
                                            {stil.kochstil}
                                        </KochstilBadge>
                                    );
                                })}
                            </div>

                            <div style={{ color: colors.text.light, fontSize: '0.85rem', marginTop: '10px' }}>
                                📍 {res.adresse ? `${res.adresse.straße}, ${res.adresse.ort}` : 'Adresse unbekannt'}
                            </div>

                            <InfoRow>
                                <span>🏎️ <strong>{getDeliveryTime(res.restaurantid)}</strong></span>
                                <span>•</span>
                                <span>💳 Kartenzahlung</span>
                            </InfoRow>
                        </CardContent>
                    </RestaurantCard>
                ))}
            </RestaurantGrid>

            {filteredRestaurants.length === 0 && (
                <div style={{ textAlign: 'center', padding: '80px 0', opacity: 0.6 }}>
                    <div style={{fontSize: '4rem', marginBottom: '20px'}}>🔍</div>
                    <h3>Keine Ergebnisse gefunden</h3>
                    <p>Versuche es mit einem anderen Suchbegriff oder Filter.</p>
                </div>
            )}
        </Container>
    );
}

export default KundeHome;