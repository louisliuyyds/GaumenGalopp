import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import colors from '../theme/colors';
import bestellungService from '../services/bestellungService';
import restaurantService from '../services/restaurantService';
import { useAuth } from '../context/AuthContext';


// --- STYLED COMPONENTS ---
const SearchBox = styled.div`
    background: ${colors.background.card};
    padding: 30px;
    border-radius: 15px;
    border: 2px solid ${colors.border.light};
    margin-bottom: 30px;
    display: flex;
    gap: 15px;
    align-items: center;
`;

const Input = styled.input`
    padding: 12px 20px;
    border-radius: 10px;
    border: 2px solid ${colors.border.medium};
    font-size: 1rem;
    flex: 1;
    transition: border-color 0.2s;
    &:focus { outline: none; border-color: ${colors.accent.orange}; }
`;

const Button = styled.button`
    background: ${colors.gradients.accent};
    color: white;
    border: none;
    padding: 12px 25px;
    border-radius: 10px;
    cursor: pointer;
    font-weight: bold;
    transition: transform 0.2s, box-shadow 0.2s;
    &:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3); }
    &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

const SortInfo = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    margin-bottom: 15px;
    font-size: 0.85rem;
    color: ${colors.text.light};
    font-weight: 500;
    padding-right: 5px;
    &:before { content: '🔃'; font-size: 1rem; }
`;

const OrderCard = styled.div`
    background: ${colors.background.card};
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 15px;
    border-left: 6px solid ${props => props.$statusColor || colors.accent.orange};
    box-shadow: ${colors.shadows.small};
    transition: all 0.2s;
    cursor: pointer;
    &:hover { transform: translateX(5px); box-shadow: ${colors.shadows.large}; }
`;

const OrderHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
`;

const OrderTitle = styled.div`
    font-weight: 700;
    font-size: 1.2rem;
    color: ${colors.text.primary};
    margin-bottom: 4px;
`;

const OrderTime = styled.div`
    font-size: 0.85rem;
    color: ${colors.text.light};
    display: flex;
    align-items: center;
    gap: 5px;
    &:before { content: '📅'; }
`;

const StatusBadge = styled.div`
    display: inline-block;
    padding: 6px 14px;
    border-radius: 20px;
    font-weight: 600;
    font-size: 0.85rem;
    background: ${props => props.$bgColor || colors.accent.orange};
    color: white;
    text-transform: capitalize;
`;

const PriceTag = styled.div`
    font-weight: 700;
    font-size: 1.1rem;
    color: ${colors.text.primary};
    margin-top: 8px;
`;

const ItemsList = styled.div`
    margin-top: 20px;
    background: ${colors.background.hover};
    border-radius: 12px;
    padding: 15px;
`;

const ItemRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid ${colors.border.light};
    &:last-child { border-bottom: none; }
`;

const ItemInfo = styled.div` display: flex; gap: 15px; align-items: center; `;
const QuantityBadge = styled.span` background: ${colors.accent.orange}; color: white; padding: 2px 8px; border-radius: 6px; font-weight: bold; font-size: 0.85rem; `;
const ItemName = styled.span` font-weight: 500; color: ${colors.text.primary}; `;

const ModalOverlay = styled.div` position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; `;
const ModalContent = styled.div` background: ${colors.background.card}; border-radius: 20px; padding: 40px; max-width: 700px; width: 90%; max-height: 85vh; overflow-y: auto; box-shadow: 0 10px 30px rgba(0,0,0,0.2); `;
const ModalHeader = styled.div` display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; border-bottom: 2px solid ${colors.border.light}; padding-bottom: 20px; `;
const ModalTitle = styled.h2` margin: 0; color: ${colors.text.primary}; `;
const CloseButton = styled.button` background: none; border: none; font-size: 2.5rem; cursor: pointer; color: ${colors.text.light}; line-height: 1; `;
const InfoSection = styled.div` margin-bottom: 25px; `;
const InfoLabel = styled.div` font-size: 0.8rem; color: ${colors.text.light}; text-transform: uppercase; margin-bottom: 5px; font-weight: 600; `;
const InfoValue = styled.div` font-size: 1.1rem; font-weight: 500; color: ${colors.text.primary}; `;
const TotalPrice = styled.div` background: ${colors.gradients.accent}; color: white; padding: 15px; border-radius: 10px; text-align: center; font-size: 1.4rem; font-weight: bold; margin-top: 20px; `;
const EmptyState = styled.div` text-align: center; padding: 50px; color: ${colors.text.light}; `;

// --- HAUPTKOMPONENTE ---
function Bestellhistorie() {
    const [bestellungen, setBestellungen] = useState([]);
    const [statusMsg, setStatusMsg] = useState('Geben Sie eine Kunden-ID ein.');
    const [loading, setLoading] = useState(false);
    const [selectedBestellung, setSelectedBestellung] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);
    const { user } = useAuth();
    const kundenId = user?.user_id;

    const getStatusColor = (status) => {
        const statusMap = { 'zugestellt': colors.accent.green, 'storniert': colors.accent.red };
        return statusMap[status] || colors.text.secondary;
    };

    const formatStatus = (status) => {
        const statusMap = { 'zugestellt': 'Erfolgreich', 'storniert': 'Storniert' };
        return statusMap[status] || status;
    };

    useEffect(() => {
        if (kundenId) {
            handleSearch();
        }
    }, []);

    const handleSearch = async () => {
        if (!kundenId) {
            setStatusMsg('Bitte geben Sie eine Kunden-ID ein.');
            return;
        }

        setLoading(true);
        setStatusMsg('Lade Historie...');

        try {
            const data = await bestellungService.getByKunde(kundenId);
            const relevante = data.filter(b => (b.status === 'zugestellt' || b.status === 'storniert') &&
                b.restaurantid != null);

            if (relevante.length === 0) {
                setStatusMsg('Keine abgeschlossenen Bestellungen gefunden.');
                setBestellungen([]);
                return;
            }

            relevante.sort((a, b) => new Date(b.bestellzeit) - new Date(a.bestellzeit));

            const restaurantIds = [...new Set(relevante.map(b => b.restaurantid))];
            const nameMap = {};

            await Promise.all(restaurantIds.map(async (id) => {
                try {
                    const res = await restaurantService.getById(id);
                    nameMap[id] = res?.data?.name || res?.name || 'Restaurant';
                } catch { nameMap[id] = 'Restaurant'; }
            }));

            // Hole auch die Details für jede Bestellung, um den Gesamtpreis zu bekommen
            const bestellungenMitDetails = await Promise.all(relevante.map(async (b) => {
                try {
                    const details = await bestellungService.getDetails(b.bestellungid);

                    // Berechne Gesamtpreis aus Positionen, falls nicht vorhanden
                    let gesamtpreis = details.gesamtpreis || b.gesamtpreis;
                    if (!gesamtpreis && details.positionen && details.positionen.length > 0) {
                        gesamtpreis = details.positionen.reduce((sum, pos) => {
                            return sum + (pos.zwischensumme || 0);
                        }, 0);
                    }

                    return {
                        ...b,
                        restaurantName: nameMap[b.restaurantid],
                        gesamtpreis: gesamtpreis
                    };
                } catch (err) {
                    console.error(`Fehler bei Bestellung ${b.bestellungid}:`, err);
                    return {
                        ...b,
                        restaurantName: nameMap[b.restaurantid]
                    };
                }
            }));

            setBestellungen(bestellungenMitDetails);
        } catch (err) {
            console.error(err);
            setStatusMsg('Fehler beim Abrufen der Daten.');
        } finally { setLoading(false); }
    };

    const handleOrderClick = async (bestellung) => {
        // Behalte die ursprünglichen Daten
        const originalData = {
            bestellungid: bestellung.bestellungid,
            gesamtpreis: bestellung.gesamtpreis,
            restaurantName: bestellung.restaurantName,
            status: bestellung.status,
            bestellzeit: bestellung.bestellzeit
        };

        setSelectedBestellung({...originalData, positionen: []});
        setModalLoading(true);

        try {
            const details = await bestellungService.getDetails(bestellung.bestellungid);
            setSelectedBestellung({
                ...originalData,
                adresseVoll: details.lieferadresse?.vollstaendige_adresse || 'Nicht verfügbar',
                lieferantName: details.lieferant?.vollstaendiger_name || 'Nicht verfügbar',
                positionen: details.positionen || [],
                // Falls die Details bessere Werte haben, verwende diese
                restaurantName: details.restaurant?.name || originalData.restaurantName,
                gesamtpreis: details.gesamtpreis || originalData.gesamtpreis
            });
        } catch (err) {
            console.error("Fehler beim Laden:", err);
            setSelectedBestellung({
                ...originalData,
                adresseVoll: 'Nicht verfügbar',
                lieferantName: 'Nicht verfügbar',
                positionen: []
            });
        } finally {
            setModalLoading(false);
        }
    };

    return (
        <div>
            <h1 style={{ color: colors.text.primary, fontWeight: '700' }}>📋 Meine Bestellungen</h1>

            {bestellungen.length > 0 ? (
                <>
                    <SortInfo>Sortierung: Neueste zuerst</SortInfo>
                    {bestellungen.map((b) => (
                        <OrderCard key={b.bestellungid} $statusColor={getStatusColor(b.status)} onClick={() => handleOrderClick(b)}>
                            <OrderHeader>
                                <div>
                                    <OrderTitle>{b.restaurantName}</OrderTitle>
                                    <OrderTime>
                                        {new Date(b.bestellzeit).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </OrderTime>
                                </div>
                                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                                    <StatusBadge $bgColor={getStatusColor(b.status)}>{formatStatus(b.status)}</StatusBadge>
                                    {b.gesamtpreis != null && b.gesamtpreis > 0 && (
                                        <PriceTag>{Number(b.gesamtpreis).toFixed(2)} €</PriceTag>
                                    )}
                                </div>
                            </OrderHeader>
                        </OrderCard>
                    ))}
                </>
            ) : (
                <EmptyState>{statusMsg}</EmptyState>
            )}

            {selectedBestellung && (
                <ModalOverlay onClick={() => setSelectedBestellung(null)}>
                    <ModalContent onClick={e => e.stopPropagation()}>
                        <ModalHeader>
                            <ModalTitle>Details zur Bestellung</ModalTitle>
                            <CloseButton onClick={() => setSelectedBestellung(null)}>&times;</CloseButton>
                        </ModalHeader>
                        {modalLoading ? <p>Lade Details...</p> : (
                            <>
                                <InfoSection><InfoLabel>Restaurant</InfoLabel><InfoValue>{selectedBestellung.restaurantName}</InfoValue></InfoSection>
                                <InfoSection><InfoLabel>Lieferadresse</InfoLabel><InfoValue>{selectedBestellung.adresseVoll}</InfoValue></InfoSection>
                                <InfoSection>
                                    <InfoLabel>📦 Deine Bestellung</InfoLabel>
                                    <ItemsList>
                                        {selectedBestellung.positionen.length > 0 ? (
                                            selectedBestellung.positionen.map((item, index) => (
                                                <ItemRow key={index}>
                                                    <ItemInfo>
                                                        <QuantityBadge>{item.menge}x</QuantityBadge>
                                                        <ItemName>
                                                            {item.gericht?.name}
                                                            {item.aenderungswunsch && (
                                                                <div style={{ fontSize: '0.8rem', color: colors.accent.orange, fontStyle: 'italic' }}>
                                                                    Notiz: {item.aenderungswunsch}
                                                                </div>
                                                            )}
                                                        </ItemName>
                                                    </ItemInfo>
                                                    <div style={{ fontWeight: '600' }}>{item.zwischensumme?.toFixed(2)} €</div>
                                                </ItemRow>
                                            ))
                                        ) : (
                                            <div style={{ textAlign: 'center', padding: '20px', color: colors.text.light }}>
                                                Keine Bestellung
                                            </div>
                                        )}
                                    </ItemsList>
                                </InfoSection>
                                <InfoSection><InfoLabel>Lieferant</InfoLabel><InfoValue>{selectedBestellung.lieferantName}</InfoValue></InfoSection>
                                <TotalPrice>
                                    Bestell-Nr: #{selectedBestellung.bestellungid}
                                    {selectedBestellung.gesamtpreis && Number(selectedBestellung.gesamtpreis) > 0 && (
                                        <>
                                            <br />
                                            Gesamtbetrag: {Number(selectedBestellung.gesamtpreis).toFixed(2)} €
                                        </>
                                    )}
                                </TotalPrice>
                            </>
                        )}
                    </ModalContent>
                </ModalOverlay>
            )}
        </div>
    );
}

export default Bestellhistorie;