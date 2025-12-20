import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import colors from "../theme/colors";
import { gerichtService } from "../services";
//import { preisService } from "../services";
//import { labelGerichtService } from "../services";
import { bewertungService } from "../services";
import { kundeService } from "../services";


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

const NoBewertungenMessage = styled.div`
    text-align: center;
    padding: 40px;
    color: #999;
    font-size: 1.1em;
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
    const { restaurantId, gerichtId } = useParams();
    const [gericht, setGericht] = useState(null);
    const [bewertung, setBewertungen] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingBewertungen, setLoadingBewertungen] = useState(true);
    const [error, setError] = useState(null);
    const [bewertungError, setBewertungError] = useState(null);
    const [kunden, setKunden] = useState({})
    const navigate = useNavigate();

    // Gericht laden
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
                        const kundeData = await kundeService.getById(kundenid);
                        kundenMap[kundenid] = kundeData;
                    } catch (err) {
                        console.error(`Fehler beim Laden von Kunde ${kundenid}:`, err);
                        kundenMap[kundenid] = { namenskuerzel: 'Unbekannt' };
                    }
                })
            );
            
            setKunden(kundenMap);
            console.log('Kunden geladen:', kundenMap);
        } catch (err) {
            console.error('Fehler beim Laden der Kunden:', err);
        }
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

    // Beim ersten Laden ausführen
    useEffect(() => {
        fetchGericht();
        fetchBewertung();
        fetchKundenFuerBewertungen();
    }, [gerichtId]);

    // Gericht löschen
    const handleDelete = async () => {
        if (window.confirm(`Möchten Sie das Gericht "${gericht?.name}" wirklich löschen?`)) {
            try {
                await gerichtService.delete(gerichtId);
                console.log('Gericht gelöscht:', gerichtId);
                // Zurück zur Restaurant-Seite
                navigate(`/restaurants/${restaurantId}`);
            } catch (err) {
                console.error('Fehler beim Löschen:', err);
                alert('Fehler beim Löschen des Gerichts');
            }
        }
    };

    // Zur Bearbeitungsseite navigieren
    const handleEdit = () => {
        navigate(`/restaurants/${restaurantId}/gerichte/${gerichtId}/edit`);
    };

    // Anzeige während des Ladens
    if (loading) {
        return (
            <Container>
                <LoadingMessage>Lade Gericht...</LoadingMessage>
            </Container>
        );
    }

    // Fehleranzeige
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

    // Wenn kein Gericht gefunden wurde
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
            <GerichtName>{gericht.name}</GerichtName>
            
            <PreisTag>€ {gericht.preis?.toFixed(2)}</PreisTag>

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

            <InfoSection>
                <InfoLabel>Gericht-ID</InfoLabel>
                <InfoValue>{gericht.gerichtid}</InfoValue>
            </InfoSection>
        </DetailCard>
        
        {!loadingBewertungen && !bewertungError && bewertung.length > 0 && (
                <DetailCard>
                    <BewertungenSection>
                        <SectionTitle>⭐ Bewertungen</SectionTitle>

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
                                        {kunden[bewertung.kundenid]?.namenskuerzel || 'Lädt...'}
                                    </BenutzerName>
                                    <Sterne>{renderSterne(bewertung.rating)}</Sterne>
                                </BewertungHeader>
                                <Kommentar>{bewertung.kommentar}</Kommentar>
                                <Kommentar>{bewertung.bewertungid}</Kommentar>
                                <Datum>{formatDatum(bewertung.erstelltam)}</Datum>
                            </BewertungCard>
                        ))}
                    </BewertungenSection>
                </DetailCard>
            )}
    </Container>
    );
}

export default GerichtDetail;