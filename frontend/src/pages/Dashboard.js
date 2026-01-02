import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import colors from '../theme/colors';
import restaurantService from '../services/restaurantService';
import bestellungService from '../services/bestellungService';

// --- STYLED COMPONENTS ---
const Container = styled.div` max-width: 1400px; margin: 0 auto; padding: 20px; `;
const WelcomeSection = styled.div` background: ${colors.gradients.luxury}; border-radius: 20px; padding: 40px; margin-bottom: 30px; box-shadow: ${colors.shadows.large}; `;
const WelcomeTitle = styled.h1` color: ${colors.text.primary}; font-size: 2.5em; margin-bottom: 10px; font-weight: 700; `;
const WelcomeSubtitle = styled.p` color: ${colors.text.secondary}; font-size: 1.2em; `;
const StatsGrid = styled.div` display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 25px; margin-bottom: 40px; `;
const StatCard = styled.div` background: ${colors.background.card}; border-radius: 16px; padding: 30px; box-shadow: ${colors.shadows.medium}; border-left: 5px solid ${props => props.$color || colors.accent.orange}; transition: all 0.3s ease; cursor: pointer; &:hover { transform: translateY(-5px); box-shadow: ${colors.shadows.large}; } `;
const StatHeader = styled.div` display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; `;
const StatIcon = styled.div` font-size: 2.5em; opacity: 0.8; `;
const StatValue = styled.div` font-size: 2.5em; font-weight: 700; color: ${colors.text.primary}; margin-bottom: 5px; `;
const StatLabel = styled.div` font-size: 0.95em; color: ${colors.text.secondary}; font-weight: 500; `;
const StatTrend = styled.div` font-size: 0.85em; color: ${props => props.$positive ? '#22c55e' : '#ef4444'}; margin-top: 8px; font-weight: 600; `;
const SectionTitle = styled.h2` color: ${colors.text.primary}; font-size: 1.8em; margin-bottom: 25px; display: flex; align-items: center; gap: 10px; &::before { content: ''; width: 4px; height: 30px; background: ${colors.accent.orange}; border-radius: 2px; } `;
const ContentGrid = styled.div` display: grid; grid-template-columns: 2fr 1fr; gap: 30px; margin-bottom: 40px; @media (max-width: 1200px) { grid-template-columns: 1fr; } `;
const Card = styled.div` background: ${colors.background.card}; border-radius: 16px; padding: 30px; box-shadow: ${colors.shadows.medium}; `;
const StatusSummary = styled.div` display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 15px; margin-bottom: 25px; `;
const MiniStat = styled.div` background: ${colors.background.light}; padding: 15px; border-radius: 12px; border: 1px solid ${colors.border.light}; text-align: center; .count { font-size: 1.8em; font-weight: 700; color: ${props => props.$color}; } .label { font-size: 0.75em; color: ${colors.text.light}; text-transform: uppercase; font-weight: 600; margin-top: 5px;} `;
const QuickActionsGrid = styled.div` display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; `;
const ActionButton = styled.button` background: ${colors.gradients.primary}; color: white; border: none; padding: 20px; border-radius: 12px; cursor: pointer; font-size: 1em; font-weight: 600; transition: all 0.3s ease; box-shadow: ${colors.shadows.small}; display: flex; flex-direction: column; align-items: center; gap: 8px; text-align: center; &:hover { transform: translateY(-3px); box-shadow: ${colors.shadows.medium}; } `;
const RestaurantList = styled.div` display: flex; flex-direction: column; gap: 15px; `;

const RestaurantItem = styled.div`
    padding: 15px; border-radius: 10px;
    background: ${props => props.$isSelected ? colors.border.light : colors.background.light};
    border: 2px solid ${props => props.$isSelected ? colors.accent.orange : 'transparent'};
    display: flex; justify-content: space-between; align-items: center; transition: all 0.2s ease; cursor: pointer;
    &:hover { background: ${colors.border.light}; transform: translateX(5px); }
`;

const RestaurantInfo = styled.div` flex: 1; .name { font-weight: 600; color: ${colors.text.primary}; margin-bottom: 5px; } .details { font-size: 0.85em; color: ${colors.text.light}; } `;
const RestaurantStats = styled.div` text-align: right; .dishes { font-size: 1.2em; font-weight: 700; color: ${colors.accent.orange}; } .label { font-size: 0.8em; color: ${colors.text.light}; } `;
const RecentOrdersList = styled.div` display: flex; flex-direction: column; gap: 12px; max-height: 500px; overflow-y: auto; padding-right: 5px; `;

const OrderItem = styled.div`
    padding: 18px; border-radius: 12px; background: ${colors.background.light};
    border-left: 5px solid ${props =>
            props.$status === 'zugestellt' ? '#22c55e' :
                    props.$status === 'in_zubereitung' ? '#f59e0b' :
                            props.$status === 'unterwegs' ? '#06b6d4' :
                                    props.$status === 'bestellt' ? '#3b82f6' : '#6b7280'};
    transition: transform 0.2s;
    &:hover { transform: scale(1.01); }
`;

const OrderHeader = styled.div` display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; `;
const OrderId = styled.span` font-weight: 700; color: ${colors.text.primary}; display: block; `;
const OrderStatus = styled.span` font-size: 0.75em; padding: 5px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px; background: ${props => props.$status === 'zugestellt' ? '#dcfce7' : props.$status === 'in_zubereitung' ? '#fef3c7' : props.$status === 'unterwegs' ? '#cffafe' : props.$status === 'bestellt' ? '#dbeafe' : '#f3f4f6'}; color: ${props => props.$status === 'zugestellt' ? '#166534' : props.$status === 'in_zubereitung' ? '#92400e' : props.$status === 'unterwegs' ? '#0891b2' : props.$status === 'bestellt' ? '#1e40af' : '#374151'}; font-weight: 800; `;
const OrderDetails = styled.div` font-size: 0.95em; color: ${colors.text.secondary}; display: flex; justify-content: space-between; align-items: center; `;
const LoadingState = styled.div` text-align: center; padding: 100px; color: ${colors.text.light}; font-size: 1.5em; `;

const ClearFilterBtn = styled.button`
    background: none; border: 1px solid ${colors.accent.orange}; color: ${colors.accent.orange};
    padding: 5px 10px; border-radius: 15px; font-size: 0.7em; cursor: pointer; font-weight: 600;
    &:hover { background: ${colors.accent.orange}; color: white; }
`;

// --- HAUPTKOMPONENTE ---

function Dashboard() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [restaurants, setRestaurants] = useState([]);
    const [orders, setOrders] = useState([]);
    const [globalRecentOrders, setGlobalRecentOrders] = useState([]);
    const [displayOrders, setDisplayOrders] = useState([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [selectedDetails, setSelectedDetails] = useState(null);
    const [stats, setStats] = useState({ totalRestaurants: 0, todayOrders: 0, totalRevenue: 0 });

    const getRelativeTime = (dateString) => {
        const now = new Date();
        const past = new Date(dateString);
        const diffInMs = now - past;
        const diffInMins = Math.floor(diffInMs / (1000 * 60));
        if (diffInMins < 1) return 'Gerade eben';
        if (diffInMins < 60) return `Vor ${diffInMins} Min.`;
        if (diffInMins < 1440) return `Vor ${Math.floor(diffInMins / 60)} Std.`;
        return past.toLocaleDateString('de-DE');
    };

    const enrichOrders = async (ordersList) => {
        return await Promise.all(ordersList.map(async (o) => {
            try {
                const details = await bestellungService.getDetails(o.bestellungid);
                let finalPrice = details.gesamtpreis || o.gesamtpreis;
                if (!finalPrice && details.positionen) {
                    finalPrice = details.positionen.reduce((sum, pos) =>
                        sum + (pos.zwischensumme || (pos.menge * (pos.preis_betrag || 0))), 0);
                }
                return { ...o, displayPrice: finalPrice || 0 };
            } catch { return { ...o, displayPrice: 0 }; }
        }));
    };

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                setLoading(true);
                const [restaurantsData, ordersData] = await Promise.all([
                    restaurantService.getAll(),
                    bestellungService.getAll()
                ]);

                const latest = [...(ordersData || [])]
                    .sort((a, b) => new Date(b.bestellzeit) - new Date(a.bestellzeit))
                    .slice(0, 10);

                const enriched = await enrichOrders(latest);
                setGlobalRecentOrders(enriched);
                setDisplayOrders(enriched);

                setRestaurants(restaurantsData || []);
                setOrders(ordersData || []);

                const today = new Date().toDateString();

                setStats({
                    totalRestaurants: (restaurantsData || []).length,
                    todayOrders: (ordersData || []).filter(o => new Date(o.bestellzeit).toDateString() === today).length,
                    totalRevenue: enriched.reduce((sum, o) => sum + o.displayPrice, 0)
                });
            } catch (error) { console.error('❌ Fehler:', error); }
            finally { setLoading(false); }
        };
        loadDashboardData();
    }, []);

    useEffect(() => {
        if (!selectedRestaurant) {
            setDisplayOrders(globalRecentOrders);
            setSelectedDetails(null);
            return;
        }

        const filterAndLoad = async () => {
            try {
                const detailsResponse = await restaurantService.getById(selectedRestaurant.restaurantid);
                setSelectedDetails(detailsResponse.data);

                const resOrders = orders
                    .filter(o => o.restaurantid === selectedRestaurant.restaurantid)
                    .sort((a, b) => new Date(b.bestellzeit) - new Date(a.bestellzeit))
                    .slice(0, 10);

                const enriched = await enrichOrders(resOrders);
                setDisplayOrders(enriched);
            } catch (error) { console.error("Fehler beim Laden der Details:", error); }
        };
        filterAndLoad();
    }, [selectedRestaurant, orders, globalRecentOrders]);

    const relevantOrdersForStats = selectedRestaurant
        ? orders.filter(o => o.restaurantid === selectedRestaurant.restaurantid)
        : orders;

    const statusCounts = relevantOrdersForStats.reduce((acc, o) => {
        const s = o.status ? o.status.toLowerCase() : 'unbekannt';
        acc[s] = (acc[s] || 0) + 1;
        return acc;
    }, {});

    const topRestaurants = [...restaurants]
        .map(r => ({ ...r, orderCount: orders.filter(o => o.restaurantid === r.restaurantid).length }))
        .sort((a, b) => b.orderCount - a.orderCount).slice(0, 5);

    /* Gerichte-Anzahl Logik auskommentiert, da API-Daten unvollständig
       const currentDishCount = selectedDetails
           ? (selectedDetails.menue?.reduce((sum, m) => sum + (m.gericht?.length || 0), 0) || 0)
           : 0;
    */

    return (
        <Container>
            <WelcomeSection>
                <WelcomeTitle>🎯 Verwaltungs-Dashboard</WelcomeTitle>
                <WelcomeSubtitle>Status-Check für GaumenGalopp am {new Date().toLocaleDateString('de-DE')}</WelcomeSubtitle>
            </WelcomeSection>

            <StatsGrid>
                <StatCard $color="#3b82f6" onClick={() => navigate('/restaurants')}>
                    <StatHeader><StatIcon>🏪</StatIcon></StatHeader>
                    <StatValue>{stats.totalRestaurants}</StatValue>
                    <StatLabel>Restaurants</StatLabel>
                    <StatTrend $positive>📈 Aktiv</StatTrend>
                </StatCard>

                {/* AUSKOMMENTIERTE GERICHTE-KARTE
                    <StatCard $color="#22c55e" onClick={() => navigate('/restaurants')}>
                        <StatHeader><StatIcon>🍽️</StatIcon></StatHeader>
                        <StatValue>{currentDishCount}</StatValue>
                        <StatLabel>{selectedRestaurant ? `Gerichte: ${selectedRestaurant.name}` : "Gerichte gesamt"}</StatLabel>
                        <StatTrend $positive>✨ Verfügbar</StatTrend>
                    </StatCard>
                */}

                <StatCard $color="#f59e0b">
                    <StatHeader><StatIcon>📦</StatIcon></StatHeader>
                    <StatValue>{selectedRestaurant ? relevantOrdersForStats.length : stats.todayOrders}</StatValue>
                    <StatLabel>{selectedRestaurant ? `Bestellungen: ${selectedRestaurant.name}` : "Bestellungen heute"}</StatLabel>
                </StatCard>

                <StatCard $color="#8b5cf6">
                    <StatHeader><StatIcon>💰</StatIcon></StatHeader>
                    <StatValue>{displayOrders.reduce((sum, o) => sum + o.displayPrice, 0).toLocaleString('de-DE', {minimumFractionDigits: 2})}€</StatValue>
                    <StatLabel>Umsatzvolumen (Auswahl)</StatLabel>
                </StatCard>
            </StatsGrid>

            <ContentGrid>
                <Card>
                    <SectionTitle>🏆 Top Restaurants (Klick zum Filtern)</SectionTitle>
                    <RestaurantList>
                        {topRestaurants.map((res, idx) => (
                            <RestaurantItem
                                key={res.restaurantid}
                                $isSelected={selectedRestaurant?.restaurantid === res.restaurantid}
                                onClick={() => setSelectedRestaurant(selectedRestaurant?.restaurantid === res.restaurantid ? null : res)}
                            >
                                <RestaurantInfo>
                                    <div className="name">#{idx + 1} {res.name}</div>
                                    <div className="details">{res.klassifizierung || 'Gastronomie'}</div>
                                </RestaurantInfo>
                                <RestaurantStats>
                                    <div className="dishes">{res.orderCount}</div>
                                    <div className="label">Verkäufe</div>
                                </RestaurantStats>
                            </RestaurantItem>
                        ))}
                    </RestaurantList>
                </Card>

                <Card>
                    <SectionTitle>⚡ Schnellzugriff</SectionTitle>
                    <QuickActionsGrid>
                        <ActionButton onClick={() => navigate('/neuesRestaurant')}><span>➕</span>Restaurant</ActionButton>
                        <ActionButton onClick={() => navigate('/restaurants')}><span>🍕</span>Speisen</ActionButton>
                        <ActionButton onClick={() => navigate('/kunde')}><span>👁️</span>Live-Ansicht</ActionButton>
                        <ActionButton onClick={() => navigate('/bestellhistorie')}><span>📜</span>Historie</ActionButton>
                    </QuickActionsGrid>
                </Card>
            </ContentGrid>

            <Card>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                    <SectionTitle style={{ marginBottom: 0 }}>
                        {selectedRestaurant ? `Historie: ${selectedRestaurant.name}` : "Die letzten 10 Bestellungen"}
                    </SectionTitle>
                    {selectedRestaurant && <ClearFilterBtn onClick={() => setSelectedRestaurant(null)}>Filter aufheben</ClearFilterBtn>}
                </div>

                <StatusSummary>
                    <MiniStat $color="#3b82f6"><div className="count">{statusCounts['bestellt'] || 0}</div><div className="label">Bestellt</div></MiniStat>
                    <MiniStat $color="#f59e0b"><div className="count">{statusCounts['in_zubereitung'] || 0}</div><div className="label">Zubereitung</div></MiniStat>
                    <MiniStat $color="#06b6d4"><div className="count">{statusCounts['unterwegs'] || 0}</div><div className="label">Unterwegs</div></MiniStat>
                    <MiniStat $color="#22c55e"><div className="count">{statusCounts['zugestellt'] || 0}</div><div className="label">Erledigt</div></MiniStat>
                </StatusSummary>

                <RecentOrdersList>
                    {displayOrders.length > 0 ? displayOrders.map(order => (
                        <OrderItem key={order.bestellungid} $status={order.status ? order.status.toLowerCase() : ''}>
                            <OrderHeader>
                                <div>
                                    <OrderId>Bestellung #{order.bestellungid}</OrderId>
                                    <div style={{fontSize: '0.8em', color: colors.text.light}}>{getRelativeTime(order.bestellzeit)}</div>
                                </div>
                                <OrderStatus $status={order.status ? order.status.toLowerCase() : ''}>
                                    {order.status ? order.status.replace('_', ' ') : 'Unbekannt'}
                                </OrderStatus>
                            </OrderHeader>
                            <OrderDetails>
                                <span>👤 Kunde ID: {order.kundenid}</span>
                                <span style={{fontWeight: '800', fontSize: '1.2em', color: colors.text.primary}}>
                                    {parseFloat(order.displayPrice || 0).toLocaleString('de-DE', {minimumFractionDigits: 2})}€
                                </span>
                            </OrderDetails>
                        </OrderItem>
                    )) : (
                        <div style={{ textAlign: 'center', padding: '40px', color: colors.text.light }}>
                            Keine aktuellen Bestellungen für diese Auswahl gefunden.
                        </div>
                    )}
                </RecentOrdersList>
            </Card>
        </Container>
    );
}

export default Dashboard;