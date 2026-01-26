import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import colors from "../theme/colors";
import { gerichtService } from "../services";
import { labelService } from "../services";
import { labelGerichtService } from "../services";
import { bewertungService } from "../services";
import { kundeService } from "../services";
import { preisService } from "../services";
import { kritikerService } from "../services";
import BewertungForm from '../components/BewertungForm';
import {warenkorbService} from "../services/warenkorbService";
import { useAuth } from '../context/AuthContext';


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

const InfoSection = styled.div`
    margin: 25px 0;
    padding: 20px;
    background: ${colors.background.light};
    border-radius: 8px;
    border-left: 4px solid ${colors.accent.orange};
`;

const InfoLabel = styled.h3`
    color: ${colors.text.secondary};
    font-size: 0.9em;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 8px;
    font-weight: 600;
`;

const InfoValue = styled.p`
    color: ${colors.text.primary};
    font-size: 1.1em;
    margin: 5px 0;
`;

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

const LabelContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 15px;
    margin-bottom: 15px;
`;

const LabelTag = styled.div`
    display: inline-block;
    background: ${colors.gradients.accent};
    color: ${colors.text.white};
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 0.95em;
    font-weight: 600;
`;

const Beschreibung = styled.p`
    color: ${colors.text.light};
    font-size: 1.05em;
    line-height: 1.6;
    margin-top: 10px;
`;

const RetryButton = styled.button`
    background: ${colors.accent.orange};
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
    margin-top: 10px;
    font-weight: 600;

    &:hover {
        opacity: 0.9;
    }
`;


const Container = styled.div`
    max-width: 900px;
    margin: 0 auto;
`;

const BackButton = styled.button`
    background: ${colors.gradients.primary};
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    cursor: pointer;
    margin-bottom: 30px;
    font-size: 1em;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 4px 10px rgba(26, 58, 46, 0.2);

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 15px rgba(26, 58, 46, 0.3);
    }
`;

const DetailCard = styled.div`
    background: white;
    border-radius: 12px;
    padding: 40px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    margin-bottom: 30px;
`;

const GerichtName = styled.h1`
    color: #1a3a2e;
    font-size: 2.5em;
    margin-bottom: 20px;
`;

const BewertungenSection = styled.div`
    margin-top: 40px;
`;

const SectionTitle = styled.h2`
    color: #1a3a2e;
    font-size: 1.8em;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
`;

const BewertungCard = styled.div`
    background: #f8f9fa;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 15px;
    border-left: 4px solid ${colors.primary};
`;

const BewertungHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
`;

const BenutzerName = styled.span`
    font-weight: 600;
    color: #1a3a2e;
    font-size: 1.1em;
`;

const Sterne = styled.div`
    color: #ffc107;
    font-size: 1.2em;
`;

const Kommentar = styled.p`
    color: #555;
    line-height: 1.6;
    margin-top: 10px;
`;

const Datum = styled.span`
    color: #999;
    font-size: 0.9em;
    margin-top: 10px;
    display: block;
`;

const LoadingMessage = styled.div`
    text-align: center;
    padding: 40px;
    color: #666;
    font-size: 1.1em;
`;

const ErrorMessage = styled.div`
    background: #fee;
    border: 1px solid #fcc;
    border-radius: 8px;
    padding: 20px;
    color: #c33;
    text-align: center;
`;

const BewertungStats = styled.div`
    display: flex;
    gap: 30px;
    padding: 20px;
    background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%);
    border-radius: 8px;
    color: white;
    margin-bottom: 20px;
`;

const StatItem = styled.div`
    color: #555;
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

function GerichtDetail() {
    const [restaurant, setRestaurant] = useState(null);
    const {restaurantId, gerichtId } = useParams();
    const [gericht, setGericht] = useState(null);
    const [bewertung, setBewertungen] = useState([]);
    const [labels, setLabels] = useState([]);
    const [preis, setPreis] = useState(null);  // Neuer State für Preis
    const [loading, setLoading] = useState(true);
    const [loadingBewertungen, setLoadingBewertungen] = useState(true);
    const [loadingLabels, setLoadingLabels] = useState(true);
    const [loadingPreis, setLoadingPreis] = useState(true);  // Loading-State für Preis
    const [error, setError] = useState(null);
    const [bewertungError, setBewertungError] = useState(null);
    const [kunden, setKunden] = useState({});
    const [cart, setCart] = useState(null);
    const { user, isRestaurant } = useAuth();
    const navigate = useNavigate();

    const fetchGericht = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await gerichtService.getById(gerichtId);
            setGericht(data);
            console.log('Gericht geladen:', data);
        } catch (err) {
            console.error('Fehler beim Laden:', err);
            setError('Fehler beim Laden des Gerichts. Bitte versuchen Sie es später erneut.');
        } finally {
            setLoading(false);
        }
    };


    const fetchPreis = async () => {
        try {
            setLoadingPreis(true);
            const response = await preisService.getByGerichtId(gerichtId);
            const preisData = response.data || response;

            // Falls mehrere Preise zurückkommen (Array), nimm den ersten oder aktuellsten
            if (Array.isArray(preisData) && preisData.length > 0) {
                setPreis(preisData[0]);
                console.log('Preis geladen:', preisData[0]);
            } else if (!Array.isArray(preisData)) {
                setPreis(preisData);
                console.log('Preis geladen:', preisData);
            } else {
                setPreis(null);
                console.log('Kein Preis gefunden');
            }
        } catch (err) {
            console.error('Fehler beim Laden des Preises:', err);
            setPreis(null);
        } finally {
            setLoadingPreis(false);
        }
    };

    const fetchLabels = async () => {
        try {
            setLoadingLabels(true);
            const labelGerichtResponse = await labelGerichtService.getByGerichtId(gerichtId);
            const labelGerichtData = labelGerichtResponse.data || labelGerichtResponse;
            const labelGerichtArray = Array.isArray(labelGerichtData) ? labelGerichtData : [];

            console.log('LabelGericht geladen:', labelGerichtArray);

            if (labelGerichtArray.length > 0) {
                const labelPromises = labelGerichtArray.map(async (labelGericht) => {
                    try {
                        const labelData = await labelService.getById(labelGericht.labelid);
                        return labelData;
                    } catch (err) {
                        console.error(`Fehler beim Laden von Label ${labelGericht.labelid}:`, err);
                        return null;
                    }
                });

                const loadedLabels = await Promise.all(labelPromises);
                const validLabels = loadedLabels.filter(label => label !== null);
                setLabels(validLabels);
                console.log('Labels mit Namen geladen:', validLabels);
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

    const fetchBewertung = async () => {
        try {
            setLoadingBewertungen(true);
            setBewertungError(null);
            const response = await bewertungService.getByGericht(gerichtId);
            const data = response.data || response;
            const bewertungen = Array.isArray(data) ? data : [];
            setBewertungen(bewertungen);
            console.log('Bewertungen geladen:', data);

            // Kundendaten für alle Bewertungen laden
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

    const fetchKundenFuerBewertungen = async (bewertungen) => {
        try {
            const kundenMap = {};
            const kundenIds = [...new Set(bewertungen.map(b => b.kundenid))];
            await Promise.all(
                kundenIds.map(async (kundenid) => {
                    try {
                        const kundeData = await kundeService.getKuerzelById(kundenid);

                        // Prüfe ob Kunde auch Kritiker ist
                        let isKritiker = false;
                        try {
                            await kritikerService.getByKundenId(kundenid);
                            isKritiker = true;
                        } catch (err) {
                            // Kein Kritiker gefunden - ist ok - sogar geplant lol
                        }

                        kundenMap[kundenid] = {
                            ...kundeData,
                            isKritiker: isKritiker
                        };
                    } catch (err) {
                        console.error(`Fehler beim Laden von Kunde ${kundenid}:`, err);
                        kundenMap[kundenid] = { namenskuerzel: 'Unbekannt', isKritiker: false };
                    }
                })
            );

            setKunden(kundenMap);
            console.log('Kunden geladen:', kundenMap);
        } catch (err) {
            console.error('Fehler beim Laden der Kunden:', err);
        }
    };

    // NEU: Callback für Auto-Reload nach Bewertung
    const handleBewertungSubmitted = async () => {
        console.log('📝 Neue Bewertung erstellt - lade Bewertungen neu...');
        await fetchBewertung();
    };

    const renderSterne = (anzahl) => {
        return '⭐'.repeat(anzahl) + '☆'.repeat(5 - anzahl);
    };

    const berechneStatistik = () => {
        if (!bewertung || bewertung.length === 0) {
            return { durchschnitt: 0, anzahl: 0 };
        }
        const summe = bewertung.reduce((acc, b) => acc + b.rating, 0);
        const durchschnitt = (summe / bewertung.length).toFixed(1);
        return { durchschnitt, anzahl: bewertung.length };
    };

    const formatDatum = (datum) => {
        if (!datum) return '';
        const date = new Date(datum);
        return date.toLocaleDateString('de-DE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    useEffect(() => {
        fetchGericht();
        fetchBewertung();
        fetchLabels();
        fetchPreis();  // Preis abrufen
    }, [gerichtId]);

    const handleDelete = async () => {
        if (window.confirm(`Möchten Sie das Gericht "${gericht?.name}" wirklich löschen?`)) {
            try {
                await gerichtService.delete(gerichtId);
                console.log('Gericht gelöscht:', gerichtId);
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

    const handleAddToCart = async () => {
            if (!user || !user.user_id) {
                alert('Bitte melden Sie sich an, um Artikel in den Warenkorb zu legen.');
                return;
            }
            if (window.confirm('Artikel in den Warenkorb hinzufügen?')) {
                const kundenId = user.user_id;
                try {
                    const itemData = {
                        restaurantid: parseInt(restaurantId),
                        gerichtid: parseInt(gericht.gerichtid),
                        preisid: preis.preisid,
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

    if (loading) {
        return (
            <Container>
                <LoadingMessage>Lade Gericht...</LoadingMessage>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <ErrorMessage>
                    {error}
                    <RetryButton onClick={fetchGericht}>
                        Erneut versuchen
                    </RetryButton>
                </ErrorMessage>
                <BackButton onClick={() => navigate(`/restaurants/${restaurantId}`)}>
                    ← Zurück zum Restaurant
                </BackButton>
            </Container>
        );
    }

    if (!gericht) {
        return (
            <Container>
                <ErrorMessage>Gericht nicht gefunden</ErrorMessage>
                <BackButton onClick={() => navigate(`/restaurants/${restaurantId}`)}>
                    ← Zurück zum Restaurant
                </BackButton>
            </Container>
        );
    }

    const stats = berechneStatistik();

    return (
        <Container>
            <BackButton onClick={() => navigate(`/restaurants/${restaurantId}`)}>
                ← Zurück zum Restaurant
            </BackButton>



            <DetailCard>
                <Button 
                    variant="add" 
                    title="In den Warenkorb" 
                    onClick={handleAddToCart}
                    disabled={!preis || loadingPreis}  // Disable wenn Preis noch lädt
                    >
                    +
                </Button>
                <GerichtName>{gericht.name}</GerichtName>
                {!loadingLabels && labels.length > 0 && (
                    <LabelContainer>
                        {labels.map((label) => (
                            <LabelTag key={label.labelid}>
                                {label.labelname}
                            </LabelTag>
                        ))}
                    </LabelContainer>
                )}

                {/* Preis aus preisService anzeigen */}
                {!loadingPreis && preis && (
                    <PreisTag>{preis.betrag?.toFixed(2)} €</PreisTag>
                )}

                {gericht.beschreibung && (
                    <InfoSection>
                        <InfoLabel>Beschreibung</InfoLabel>
                        <Beschreibung>{gericht.beschreibung}</Beschreibung>
                    </InfoSection>
                )}

                <InfoSection>
                    <InfoLabel>Kategorie</InfoLabel>
                    <InfoValue>{gericht.kategorie || 'Nicht angegeben'}</InfoValue>
                </InfoSection>
            </DetailCard>

            {!loadingBewertungen && !bewertungError && bewertung.length > 0 && (
                <DetailCard>
                    <BewertungenSection>
                        <SectionTitle>Bewertungen</SectionTitle>
                        <BewertungStats>
                            <StatItem>
                                <StatValue>{stats.durchschnitt}</StatValue>
                                <StatLabel>Durchschnitt</StatLabel>
                            </StatItem>
                            <StatItem>
                                <StatValue>{stats.anzahl}</StatValue>
                                <StatLabel>Bewertungen</StatLabel>
                            </StatItem>
                        </BewertungStats>

                        {bewertung.map((bewertung) => (
                            <BewertungCard key={bewertung.bewertungid}>
                                <BewertungHeader>
                                    <BenutzerName>
                                        {kunden[bewertung.kundenid]?.isKritiker && '👨‍🍳 '}
                                        {kunden[bewertung.kundenid]?.namenskuerzel || 'Lädt...'}
                                        {kunden[bewertung.kundenid]?.isKritiker && (
                                            <span style={{
                                                marginLeft: '8px',
                                                background: 'linear-gradient(135deg, #8a6d3b 0%, #b8860b 100%)',
                                                color: 'white',
                                                padding: '3px 10px',
                                                borderRadius: '12px',
                                                fontSize: '0.75em',
                                                fontWeight: '700'
                                            }}>
                                                Kritiker
                                            </span>
                                        )}
                                    </BenutzerName>
                                    <Sterne>{renderSterne(bewertung.rating)}</Sterne>
                                </BewertungHeader>
                                <Kommentar>{bewertung.kommentar}</Kommentar>
                                <Datum>{formatDatum(bewertung.erstelltam)}</Datum>
                            </BewertungCard>
                        ))}
                    </BewertungenSection>
                </DetailCard>
            )}

            {/* NEU: Bewertungsformular */}
            <BewertungForm
                gerichtId={gerichtId}
                onBewertungSubmitted={handleBewertungSubmitted}
            />
        </Container>
    );
}

export default GerichtDetail;