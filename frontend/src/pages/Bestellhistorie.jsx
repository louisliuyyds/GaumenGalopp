import React, { useState } from 'react';
import styled from 'styled-components';
import colors from '../theme/colors';
import bestellungService from '../services/bestellungService';
import restaurantService from '../services/restaurantService';
import lieferantService from '../services/lieferantService';
import adresseService from '../services/adresseService';

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

    &:focus {
        outline: none;
        border-color: ${colors.accent.orange};
    }
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

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
    }

    &:active {
        transform: translateY(0);
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
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

    &:hover {
        transform: translateX(5px);
        box-shadow: ${colors.shadows.large};
    }
`;

const OrderHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
`;

const OrderTitle = styled.div`
    font-weight: 700;
    font-size: 1.1rem;
    color: ${colors.text.primary};
    margin-bottom: 8px;
`;

const OrderTime = styled.div`
    font-size: 0.85rem;
    color: ${colors.text.light};
    display: flex;
    align-items: center;
    gap: 5px;

    &:before {
        content: '🕐';
    }
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
    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
`;

const CustomerInfo = styled.div`
    font-size: 0.8rem;
    color: ${colors.text.secondary};
    margin-top: 6px;
    display: flex;
    align-items: center;
    gap: 5px;

    &:before {
        content: '👤';
    }
`;

const EmptyState = styled.div`
    text-align: center;
    padding: 60px 20px;
    color: ${colors.text.light};

    &:before {
        content: '📦';
        display: block;
        font-size: 4rem;
        margin-bottom: 20px;
    }
`;

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.2s;

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;

const ModalContent = styled.div`
    background: ${colors.background.card};
    border-radius: 20px;
    padding: 40px;
    max-width: 700px;
    width: 90%;
    max-height: 85vh;
    overflow-y: auto;
    box-shadow: 0 10px 40px rgba(0,0,0,0.15);
    animation: slideUp 0.3s;

    @keyframes slideUp {
        from {
            transform: translateY(50px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
`;

const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 2px solid ${colors.border.light};
`;

const ModalTitle = styled.h2`
    color: ${colors.text.primary};
    margin: 0;
    font-size: 1.8rem;
`;

const CloseButton = styled.button`
    background: ${colors.background.hover};
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;

    &:hover {
        background: ${colors.border.medium};
        transform: rotate(90deg);
    }
`;

const InfoSection = styled.div`
    margin-bottom: 25px;
`;

const InfoLabel = styled.div`
    font-size: 0.85rem;
    color: ${colors.text.light};
    margin-bottom: 5px;
    text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 0.5px;
`;

const InfoValue = styled.div`
    font-size: 1.1rem;
    color: ${colors.text.primary};
    font-weight: 500;
`;

const TotalPrice = styled.div`
    background: ${colors.gradients.accent};
    color: white;
    padding: 20px;
    border-radius: 12px;
    text-align: center;
    margin-top: 30px;
    font-size: 1.5rem;
    font-weight: 700;
`;

function Bestellhistorie() {
    const [kundenId, setKundenId] = useState('');
    const [bestellungen, setBestellungen] = useState([]);
    const [statusMsg, setStatusMsg] = useState('Geben Sie eine Kunden-ID ein.');
    const [loading, setLoading] = useState(false);
    const [selectedBestellung, setSelectedBestellung] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);

    const getStatusColor = (status) => {
        const statusMap = {
            'in_zubereitung': colors.accent.yellow,
            'in_lieferung': colors.accent.blue,
            'abgeschlossen': colors.accent.green,
            'storniert': colors.accent.red,
            'ausstehend': colors.text.secondary
        };
        return statusMap[status] || colors.accent.orange;
    };

    const formatStatus = (status) => {
        const statusMap = {
            'in_zubereitung': 'In Zubereitung',
            'in_lieferung': 'In Lieferung',
            'abgeschlossen': 'Abgeschlossen',
            'storniert': 'Storniert',
            'ausstehend': 'Ausstehend'
        };
        return statusMap[status] || status;
    };

    const handleSearch = async () => {
        if (!kundenId) {
            setStatusMsg('Bitte geben Sie eine Kunden-ID ein.');
            return;
        }

        setLoading(true);
        setStatusMsg('Suche läuft...');

        try {
            const data = await bestellungService.getByKunde(kundenId);
            setBestellungen(data);

            if (data.length === 0) {
                setStatusMsg('Keine Bestellungen gefunden.');
            }
        } catch (err) {
            console.error("Fehler:", err);
            setStatusMsg('Fehler beim Laden der Daten');
            setBestellungen([]);
        } finally {
            setLoading(false);
        }
    };

    const handleOrderClick = async (bestellung) => {
        setSelectedBestellung(bestellung);
        setModalLoading(true);

        try {
            // Hole Bestelldetails und alle zugehörigen Namen parallel
            const [details, restaurant, allLieferanten, adresse] = await Promise.all([
                bestellungService.getDetails(bestellung.bestellungid),
                restaurantService.getById(bestellung.restaurantid),
                lieferantService.getAll(),
                adresseService.getById(bestellung.adressid)
            ]);

            // Extrahiere Daten aus Response
            const restaurantData = restaurant?.data || restaurant;
            const lieferantenData = allLieferanten?.data || allLieferanten;
            const adresseData = adresse?.data || adresse;

            // Finde den richtigen Lieferanten
            const lieferant = Array.isArray(lieferantenData)
                ? lieferantenData.find(l => l.lieferantid === bestellung.lieferantid)
                : null;

            // Füge Namen zu den Details hinzu
            setSelectedBestellung({
                ...details,
                restaurantName: restaurantData?.name || 'Unbekannt',
                restaurantTelefon: restaurantData?.telefon,
                lieferantName: lieferant
                    ? `${lieferant.vorname || ''} ${lieferant.nachname || ''}`.trim()
                    : 'Unbekannt',
                lieferantTelefon: lieferant?.telephone,
                adresseVoll: adresseData
                    ? `${adresseData.straße} ${adresseData.hausnummer}, ${adresseData.postleitzahl} ${adresseData.ort}`
                    : 'Unbekannt',
                adresseData: adresseData
            });
        } catch (err) {
            console.error("Fehler beim Laden der Details:", err);
        } finally {
            setModalLoading(false);
        }
    };

    const closeModal = () => {
        setSelectedBestellung(null);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div>
            <h1 style={{
                color: colors.text.primary,
                marginBottom: '20px',
                fontSize: '2rem',
                fontWeight: '700'
            }}>
                📋 Bestellhistorie
            </h1>

            <SearchBox>
                <Input
                    type="number"
                    placeholder="Kunden-ID eingeben..."
                    value={kundenId}
                    onChange={(e) => setKundenId(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                />
                <Button onClick={handleSearch} disabled={loading}>
                    {loading ? '⏳ Laden...' : '🔍 Suchen'}
                </Button>
            </SearchBox>

            <div>
                {bestellungen.length > 0 ? (
                    bestellungen.map((b) => (
                        <OrderCard
                            key={b.bestellungid}
                            $statusColor={getStatusColor(b.status)}
                            onClick={() => handleOrderClick(b)}
                        >
                            <OrderHeader>
                                <div>
                                    <OrderTitle>
                                        Bestellung #{b.bestellungid}
                                    </OrderTitle>
                                    <OrderTime>
                                        {new Date(b.bestellzeit).toLocaleString('de-DE', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </OrderTime>
                                    <CustomerInfo>
                                        Kunde: {b.kundenid}
                                    </CustomerInfo>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <StatusBadge $bgColor={getStatusColor(b.status)}>
                                        {formatStatus(b.status)}
                                    </StatusBadge>
                                </div>
                            </OrderHeader>
                        </OrderCard>
                    ))
                ) : (
                    <EmptyState>
                        <div style={{ fontSize: '1.2rem', fontWeight: '500' }}>
                            {statusMsg}
                        </div>
                    </EmptyState>
                )}
            </div>

            {selectedBestellung && (
                <ModalOverlay onClick={closeModal}>
                    <ModalContent onClick={(e) => e.stopPropagation()}>
                        <ModalHeader>
                            <ModalTitle>
                                Bestellung #{selectedBestellung.bestellungid}
                            </ModalTitle>
                            <CloseButton onClick={closeModal}>
                                ×
                            </CloseButton>
                        </ModalHeader>

                        {modalLoading ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: colors.text.light }}>
                                ⏳ Lade Details...
                            </div>
                        ) : (
                            <>
                                <InfoSection>
                                    <InfoLabel>Status</InfoLabel>
                                    <StatusBadge $bgColor={getStatusColor(selectedBestellung.status)}>
                                        {formatStatus(selectedBestellung.status)}
                                    </StatusBadge>
                                </InfoSection>

                                <InfoSection>
                                    <InfoLabel>Bestellzeit</InfoLabel>
                                    <InfoValue>
                                        {new Date(selectedBestellung.bestellzeit).toLocaleString('de-DE', {
                                            weekday: 'long',
                                            day: '2-digit',
                                            month: 'long',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </InfoValue>
                                </InfoSection>

                                <InfoSection>
                                    <InfoLabel>Kunden-ID</InfoLabel>
                                    <InfoValue>#{selectedBestellung.kundenid}</InfoValue>
                                </InfoSection>

                                <InfoSection>
                                    <InfoLabel>🏪 Restaurant</InfoLabel>
                                    <InfoValue>{selectedBestellung.restaurantName}</InfoValue>
                                    {selectedBestellung.restaurantTelefon && (
                                        <div style={{ fontSize: '0.9rem', color: colors.text.light, marginTop: '4px' }}>
                                            📞 {selectedBestellung.restaurantTelefon}
                                        </div>
                                    )}
                                </InfoSection>

                                <InfoSection>
                                    <InfoLabel>🚚 Lieferant</InfoLabel>
                                    <InfoValue>{selectedBestellung.lieferantName}</InfoValue>
                                    {selectedBestellung.lieferantTelefon && (
                                        <div style={{ fontSize: '0.9rem', color: colors.text.light, marginTop: '4px' }}>
                                            📞 {selectedBestellung.lieferantTelefon}
                                        </div>
                                    )}
                                </InfoSection>

                                <InfoSection>
                                    <InfoLabel>📍 Lieferadresse</InfoLabel>
                                    <InfoValue>{selectedBestellung.adresseVoll}</InfoValue>
                                    {selectedBestellung.adresseData?.land && (
                                        <div style={{ fontSize: '0.9rem', color: colors.text.light, marginTop: '4px' }}>
                                            🌍 {selectedBestellung.adresseData.land}
                                        </div>
                                    )}
                                </InfoSection>

                                {selectedBestellung.gesamtpreis && (
                                    <TotalPrice>
                                        Gesamtpreis: {selectedBestellung.gesamtpreis.toFixed(2)} €
                                    </TotalPrice>
                                )}
                            </>
                        )}
                    </ModalContent>
                </ModalOverlay>
            )}
        </div>
    );
}

export default Bestellhistorie;