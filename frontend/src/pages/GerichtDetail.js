import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import colors from "../theme/colors";
import { 
    gerichtService, 
    labelService, 
    labelGerichtService, 
    bewertungService, 
    kundeService, 
    preisService 
} from "../services";

// ============================================
// STYLED COMPONENTS
// ============================================

// 1. Container - Hauptlayout
const Container = styled.div`
    max-width: 900px;
    margin: 0 auto;
`;

// 2. Button - Universeller Button mit Varianten
const Button = styled.button`
    background: ${({ variant }) => 
        variant === 'back' ? colors.gradients.primary : 
        variant === 'add' ? colors.gradients.accent : 
        colors.accent.orange
    };
    color: white;
    border: none;
    padding: ${({ variant }) => variant === 'add' ? '0' : '12px 24px'};
    width: ${({ variant }) => variant === 'add' ? '40px' : 'auto'};
    height: ${({ variant }) => variant === 'add' ? '40px' : 'auto'};
    border-radius: ${({ variant }) => variant === 'add' ? '10px' : '8px'};
    cursor: pointer;
    margin-bottom: ${({ variant }) => variant === 'back' ? '30px' : '0'};
    margin-top: ${({ variant }) => variant === 'retry' ? '10px' : '0'};
    font-size: ${({ variant }) => variant === 'add' ? '1.3rem' : '1em'};
    font-weight: ${({ variant }) => variant === 'add' ? 'bold' : '600'};
    transition: all 0.3s ease;
    box-shadow: ${({ variant }) => 
        variant === 'back' ? '0 4px 10px rgba(26, 58, 46, 0.2)' : 
        variant === 'add' ? colors.shadows.small : 
        'none'
    };

    &:hover {
        transform: ${({ variant }) => 
            variant === 'add' ? 'scale(1.1) rotate(90deg)' : 'translateY(-2px)'
        };
        box-shadow: ${({ variant }) => 
            variant === 'back' ? '0 6px 15px rgba(26, 58, 46, 0.3)' : 
            variant === 'add' ? colors.shadows.medium : 
            'none'
        };
        opacity: ${({ variant }) => variant === 'retry' ? '0.9' : '1'};
    }

    &:active {
        transform: ${({ variant }) => variant === 'add' ? 'scale(0.95)' : 'none'};
    }
`;

// 3. Card - Universelle Karte
const Card = styled.div`
    background: ${({ variant }) => variant === 'bewertung' ? '#f8f9fa' : 'white'};
    border-radius: ${({ variant }) => variant === 'bewertung' ? '8px' : '12px'};
    padding: ${({ variant }) => variant === 'bewertung' ? '20px' : '40px'};
    box-shadow: ${({ variant }) => 
        variant === 'bewertung' ? 'none' : '0 4px 15px rgba(0, 0, 0, 0.08)'
    };
    margin-bottom: ${({ variant }) => variant === 'bewertung' ? '15px' : '30px'};
    border-left: ${({ variant }) => 
        variant === 'bewertung' ? `4px solid ${colors.primary}` : 'none'
    };
`;

// 4. Header - Überschriften
const Header = styled.h1`
    color: #1a3a2e;
    font-size: ${({ level }) => level === 2 ? '1.8em' : '2.5em'};
    margin-bottom: 20px;
    display: ${({ level }) => level === 2 ? 'flex' : 'block'};
    align-items: ${({ level }) => level === 2 ? 'center' : 'normal'};
    gap: ${({ level }) => level === 2 ? '10px' : '0'};
`;

// 5. InfoSection - Informationsbereich
const InfoSection = styled.div`
    margin: 25px 0;
    padding: 20px;
    background: ${colors.background.light};
    border-radius: 8px;
    border-left: 4px solid ${colors.accent.orange};
`;

// 6. InfoLabel - Label für Informationen
const InfoLabel = styled.h3`
    color: ${colors.text.secondary};
    font-size: 0.9em;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 8px;
    font-weight: 600;
`;

// 7. InfoValue - Werte und Beschreibungen
const InfoValue = styled.p`
    color: ${({ isDescription }) => 
        isDescription ? colors.text.light : colors.text.primary
    };
    font-size: ${({ isDescription }) => isDescription ? '1.05em' : '1.1em'};
    margin: 5px 0;
    line-height: ${({ isDescription }) => isDescription ? '1.6' : 'normal'};
    margin-top: ${({ isDescription }) => isDescription ? '10px' : '0'};
`;

// 8. PreisTag - Preisanzeige
const PreisTag = styled.div`
    display: inline-block;
    background: ${colors.gradients.accent};
    color: ${colors.text.white};
    padding: 10px 20px;
    border-radius: 20px;
    font-size: 1.3em;
    font-weight: 700;
    margin-top: 15px;
`;

// 9. LabelContainer - Container für Label-Tags
const LabelContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 15px;
    margin-bottom: 15px;
`;

// 10. LabelTag - Einzelnes Label
const LabelTag = styled.div`
    display: inline-block;
    background: ${colors.gradients.accent};
    color: ${colors.text.white};
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 0.95em;
    font-weight: 600;
`;

// 11. MessageBox - Nachrichten und Fehler
const MessageBox = styled.div`
    background: ${({ variant }) => variant === 'error' ? '#fee' : 'transparent'};
    border: ${({ variant }) => variant === 'error' ? '1px solid #fcc' : 'none'};
    border-radius: 8px;
    padding: ${({ variant }) => variant === 'error' ? '20px' : '40px'};
    color: ${({ variant }) => variant === 'error' ? '#c33' : '#666'};
    text-align: center;
    font-size: 1.1em;
`;

// 12. BewertungHeader - Kopfzeile der Bewertung
const BewertungHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
`;

// 13. BenutzerName - Name des Benutzers
const BenutzerName = styled.span`
    font-weight: 600;
    color: #1a3a2e;
    font-size: 1.1em;
`;

// 14. Sterne - Sternebewertung
const Sterne = styled.div`
    color: #ffc107;
    font-size: 1.2em;
`;

// 15. TextContent - Text für Kommentare und Datum
const TextContent = styled.p`
    color: ${({ variant }) => variant === 'datum' ? '#999' : '#555'};
    font-size: ${({ variant }) => variant === 'datum' ? '0.9em' : '1em'};
    line-height: ${({ variant }) => variant === 'datum' ? 'normal' : '1.6'};
    margin-top: 10px;
`;

// 16. StatsContainer - Statistik-Bereich
const StatsContainer = styled.div`
    display: flex;
    gap: 30px;
    padding: 20px;
    background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%);
    border-radius: 8px;
    color: white;
    margin-bottom: 20px;
`;

// Zusätzliche Hilfs-Komponenten (nicht in den 16 gezählt)
const StatItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const StatValue = styled.span`
    font-size: 2em;
    font-weight: bold;
`;

const StatLabel = styled.span`
    font-size: 0.9em;
    opacity: 0.9;
`;

// ============================================
// HAUPTKOMPONENTE
// ============================================

function GerichtDetail() {
    // URL-Parameter und Navigation
    const { restaurantId, gerichtId } = useParams();
    const navigate = useNavigate();

    // State für Hauptdaten
    const [gericht, setGericht] = useState(null);
    const [bewertung, setBewertungen] = useState([]);
    const [labels, setLabels] = useState([]);
    const [preis, setPreis] = useState(null);
    const [kunden, setKunden] = useState({});

    // Loading-States
    const [loading, setLoading] = useState(true);
    const [loadingBewertungen, setLoadingBewertungen] = useState(true);
    const [loadingLabels, setLoadingLabels] = useState(true);
    const [loadingPreis, setLoadingPreis] = useState(true);

    // Error-States
    const [error, setError] = useState(null);
    const [bewertungError, setBewertungError] = useState(null);

    // ========================================
    // FETCH-FUNKTIONEN
    // ========================================

    // Gericht laden
    const fetchGericht = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await gerichtService.getById(gerichtId);
            setGericht(data);
            console.log('Gericht geladen:', data);
        } catch (err) {
            console.error('Fehler beim Laden des Gerichts:', err);
            setError('Fehler beim Laden des Gerichts. Bitte versuchen Sie es später erneut.');
        } finally {
            setLoading(false);
        }
    };

    // Preis laden
    const fetchPreis = async () => {
        try {
            setLoadingPreis(true);
            const preisData = await preisService.getByGericht(gerichtId);
            
            if (preisData && preisData.length > 0) {
                setPreis(preisData[0]);
            } else if (!Array.isArray(preisData)) {
                setPreis(preisData);
            } else {
                setPreis(null);
            }
        } catch (err) {
            console.error('Fehler beim Laden des Preises:', err);
            setPreis(null);
        } finally {
            setLoadingPreis(false);
        }
    };

    // Labels laden
    const fetchLabels = async () => {
        try {
            setLoadingLabels(true);
            const labelGerichtResponse = await labelGerichtService.getByGerichtId(gerichtId);
            const labelGerichtData = labelGerichtResponse.data || labelGerichtResponse;
            const labelGerichtArray = Array.isArray(labelGerichtData) ? labelGerichtData : [];
            
            if (labelGerichtArray.length > 0) {
                const labelPromises = labelGerichtArray.map(async (labelGericht) => {
                    try {
                        return await labelService.getById(labelGericht.labelid);
                    } catch (err) {
                        console.error(`Fehler beim Laden von Label ${labelGericht.labelid}:`, err);
                        return null;
                    }
                });
                
                const loadedLabels = await Promise.all(labelPromises);
                const validLabels = loadedLabels.filter(label => label !== null);
                setLabels(validLabels);
            } else {
                setLabels([]);
            }
        } catch (err) {
            console.error('Fehler beim Laden der Labels:', err);
            setLabels([]);
        } finally {
            setLoadingLabels(false);
        }
    };
    
    // Bewertungen laden
    const fetchBewertung = async () => {
        try {
            setLoadingBewertungen(true);
            setBewertungError(null);
            const response = await bewertungService.getByGericht(gerichtId);
            const data = response.data || response;
            const bewertungen = Array.isArray(data) ? data : [];
            setBewertungen(bewertungen);
            
            if (bewertungen.length > 0) {
                await fetchKundenFuerBewertungen(bewertungen);
            }
        } catch (err) {
            console.error('Fehler beim Laden der Bewertungen:', err);
            setBewertungError('Fehler beim Laden der Bewertungen. Bitte versuchen Sie es später erneut.');
        } finally {
            setLoadingBewertungen(false);
        }
    };

    // Kundendaten für Bewertungen laden
    const fetchKundenFuerBewertungen = async (bewertungen) => {
        try {
            const kundenMap = {};
            const kundenIds = [...new Set(bewertungen.map(b => b.kundenid))];
            
            await Promise.all(
                kundenIds.map(async (kundenid) => {
                    try {
                        const kundeData = await kundeService.getKuerzelById(kundenid);
                        kundenMap[kundenid] = kundeData;
                    } catch (err) {
                        console.error(`Fehler beim Laden von Kunde ${kundenid}:`, err);
                        kundenMap[kundenid] = { namenskuerzel: 'Unbekannt' };
                    }
                })
            );
            
            setKunden(kundenMap);
        } catch (err) {
            console.error('Fehler beim Laden der Kunden:', err);
        }
    };

    // ========================================
    // HILFSFUNKTIONEN
    // ========================================

    // Sterne rendern (⭐⭐⭐☆☆)
    const renderSterne = (anzahl) => {
        return '⭐'.repeat(anzahl) + '☆'.repeat(5 - anzahl);
    };

    // Bewertungsstatistik berechnen
    const berechneStatistik = () => {
        if (!bewertung || bewertung.length === 0) {
            return { durchschnitt: 0, anzahl: 0 };
        }
        const summe = bewertung.reduce((acc, b) => acc + b.rating, 0);
        const durchschnitt = (summe / bewertung.length).toFixed(1);
        return { durchschnitt, anzahl: bewertung.length };
    };

    // Datum formatieren
    const formatDatum = (datum) => {
        if (!datum) return '';
        const date = new Date(datum);
        return date.toLocaleDateString('de-DE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // ========================================
    // EVENT HANDLER
    // ========================================

    const handleDelete = async () => {
        if (window.confirm(`Möchten Sie das Gericht "${gericht?.name}" wirklich löschen?`)) {
            try {
                await gerichtService.delete(gerichtId);
                navigate(`/restaurants/${restaurantId}`);
            } catch (err) {
                console.error('Fehler beim Löschen:', err);
                alert('Fehler beim Löschen des Gerichts');
            }
        }
    };

    const handleEdit = () => {
        navigate(`/restaurants/${restaurantId}/gerichte/${gerichtId}/edit`);
    };

    const handleAddToCart = () => {
        console.log('➕ Gericht hinzugefügt:', gericht.name);
        // TODO: Warenkorb-Logik implementieren
    };

    const handleBackToRestaurant = () => {
        navigate(`/restaurants/${restaurantId}`);
    };

    // ========================================
    // EFFECTS
    // ========================================

    useEffect(() => {
        fetchGericht();
        fetchBewertung();
        fetchLabels();
        fetchPreis();
    }, [gerichtId]);

    // ========================================
    // RENDER-LOGIK
    // ========================================

    // Loading-State
    if (loading) {
        return (
            <Container>
                <MessageBox>Lade Gericht...</MessageBox>
            </Container>
        );
    }

    // Error-State
    if (error) {
        return (
            <Container>
                <MessageBox variant="error">
                    {error}
                    <Button variant="retry" onClick={fetchGericht}>
                        Erneut versuchen
                    </Button>
                </MessageBox>
                <Button variant="back" onClick={handleBackToRestaurant}>
                    ← Zurück zum Restaurant
                </Button>
            </Container>
        );
    }

    // Gericht nicht gefunden
    if (!gericht) {
        return (
            <Container>
                <MessageBox variant="error">Gericht nicht gefunden</MessageBox>
                <Button variant="back" onClick={handleBackToRestaurant}>
                    ← Zurück zum Restaurant
                </Button>
            </Container>
        );
    }

    // Statistik berechnen
    const stats = berechneStatistik();

    // ========================================
    // HAUPTDARSTELLUNG
    // ========================================

    return (
        <Container>
            {/* Zurück-Button */}
            <Button variant="back" onClick={handleBackToRestaurant}>
                ← Zurück zum Restaurant
            </Button>
            
            {/* Gericht-Details Card */}
            <Card>
                {/* Warenkorb-Button */}
                <Button variant="add" title="In den Warenkorb" onClick={handleAddToCart}>
                    +
                </Button>

                {/* Gerichtname */}
                <Header>{gericht.name}</Header>
                
                {/* Labels anzeigen */}
                {!loadingLabels && labels.length > 0 && (
                    <LabelContainer>
                        {labels.map((label) => (
                            <LabelTag key={label.labelid}>
                                {label.labelname}
                            </LabelTag>
                        ))}
                    </LabelContainer>
                )}

                {/* Preis anzeigen */}
                {!loadingPreis && preis && (
                    <PreisTag>{preis.betrag?.toFixed(2)} €</PreisTag>
                )}

                {/* Beschreibung */}
                {gericht.beschreibung && (
                    <InfoSection>
                        <InfoLabel>Beschreibung</InfoLabel>
                        <InfoValue isDescription>{gericht.beschreibung}</InfoValue>
                    </InfoSection>
                )}

                {/* Kategorie */}
                <InfoSection>
                    <InfoLabel>Kategorie</InfoLabel>
                    <InfoValue>{gericht.kategorie || 'Nicht angegeben'}</InfoValue>
                </InfoSection>
            </Card>
            
            {/* Bewertungen Card */}
            {!loadingBewertungen && !bewertungError && bewertung.length > 0 && (
                <Card>
                    <Header level={2}>Bewertungen</Header>
                    
                    {/* Statistik */}
                    <StatsContainer>
                        <StatItem>
                            <StatValue>{stats.durchschnitt}</StatValue>
                            <StatLabel>Durchschnitt</StatLabel>
                        </StatItem>
                        <StatItem>
                            <StatValue>{stats.anzahl}</StatValue>
                            <StatLabel>Bewertungen</StatLabel>
                        </StatItem>
                    </StatsContainer>

                    {/* Einzelne Bewertungen */}
                    {bewertung.map((bewertung) => (
                        <Card key={bewertung.bewertungid} variant="bewertung">
                            <BewertungHeader>
                                <BenutzerName>
                                    {kunden[bewertung.kundenid]?.namenskuerzel || 'Lädt...'}
                                </BenutzerName>
                                <Sterne>{renderSterne(bewertung.rating)}</Sterne>
                            </BewertungHeader>
                            <TextContent>{bewertung.kommentar}</TextContent>
                            <TextContent variant="datum">
                                {formatDatum(bewertung.erstelltam)}
                            </TextContent>
                        </Card>
                    ))}
                </Card>
            )}
        </Container>
    );
}

export default GerichtDetail;