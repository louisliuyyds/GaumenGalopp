import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import colors from '../theme/colors';
import { 
    restaurantOeffnungszeitService, 
    oeffnungszeitVorlageService,
    oeffnungszeitDetailService 
} from '../services';
import EditNavigationTabs from '../components/EditNavigationTabs';

// ==================== STYLED COMPONENTS ====================

const Container = styled.div`
    max-width: 1000px;
    margin: 0 auto;
`;

const BackButton = styled.button`
    background: ${colors.gradients.primary};
    color: ${colors.text.white};
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    cursor: pointer;
    margin-bottom: 30px;
    font-size: 1em;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: ${colors.shadows.primarySmall};

    &:hover {
        transform: translateY(-2px);
        box-shadow: ${colors.shadows.primaryMedium};
    }
`;

const PageTitle = styled.h1`
    color: ${colors.text.primary};
    font-size: 2.5em;
    margin-bottom: 10px;
    font-weight: 700;
`;

const Subtitle = styled.p`
    color: ${colors.text.light};
    font-size: 1.1em;
    margin-bottom: 40px;
`;

const InfoCard = styled.div`
    background: ${colors.background.card};
    border-radius: 12px;
    padding: 35px;
    box-shadow: ${colors.shadows.medium};
    border: 1px solid ${colors.border.light};
    margin-bottom: 30px;
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

const SelectGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 20px;
`;

const Label = styled.label`
    font-weight: 600;
    color: ${colors.text.secondary};
    font-size: 0.95em;
    display: flex;
    align-items: center;
    gap: 8px;
`;

const Select = styled.select`
    padding: 12px 16px;
    border: 2px solid ${colors.border.light};
    border-radius: 8px;
    font-size: 1em;
    color: ${colors.text.primary};
    background: ${colors.background.main};
    cursor: pointer;
    transition: all 0.2s ease;

    &:focus {
        outline: none;
        border-color: ${colors.primary.main};
        background: white;
    }

    &:disabled {
        background: #f5f5f5;
        cursor: not-allowed;
    }
`;

const DayCard = styled.div`
    background: white;
    border: 2px solid ${colors.border.light};
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 15px;
    transition: all 0.2s ease;

    &:hover {
        border-color: ${colors.primary.light};
    }
`;

const DayHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
`;

const DayName = styled.h3`
    color: ${colors.text.primary};
    font-size: 1.2rem;
    font-weight: 600;
    margin: 0;
`;

const ClosedBadge = styled.span`
    background: ${colors.status.error};
    color: white;
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 0.85em;
    font-weight: 600;
`;

const OpenBadge = styled.span`
    background: ${colors.status.success};
    color: white;
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 0.85em;
    font-weight: 600;
`;

const TimeDisplay = styled.div`
    display: flex;
    align-items: center;
    gap: 15px;
    color: ${colors.text.secondary};
    font-size: 1.1em;
`;

const ButtonContainer = styled.div`
    display: flex;
    gap: 15px;
    justify-content: flex-end;
    margin-top: 40px;
    padding-top: 30px;
    border-top: 2px solid ${colors.border.light};
`;

const SaveButton = styled.button`
    background: ${colors.gradients.primary};
    color: ${colors.text.white};
    border: none;
    padding: 14px 32px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1.1em;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: ${colors.shadows.primarySmall};

    &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: ${colors.shadows.primaryMedium};
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
    }
`;

const LoadingState = styled.div`
    text-align: center;
    padding: 150px 20px;
    font-size: 1.5rem;
    color: ${colors.text.light};
`;

const ErrorMessage = styled.div`
    background: ${colors.status.errorLight};
    color: ${colors.status.error};
    padding: 15px 20px;
    border-radius: 8px;
    margin-bottom: 20px;
    border-left: 4px solid ${colors.status.error};
    font-weight: 500;
`;

const SuccessMessage = styled.div`
    background: ${colors.status.successLight};
    color: ${colors.status.success};
    padding: 15px 20px;
    border-radius: 8px;
    margin-bottom: 20px;
    border-left: 4px solid ${colors.status.success};
    font-weight: 500;
`;

const InfoBox = styled.div`
    background: ${colors.primary.light};
    border-left: 4px solid ${colors.primary.main};
    padding: 15px 20px;
    border-radius: 8px;
    margin-bottom: 20px;
    color: ${colors.text.secondary};
    font-size: 0.95em;
`;

// ==================== HILFSFUNKTIONEN ====================

const WOCHENTAGE = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];

// ==================== HAUPTKOMPONENTE ====================

function EditOpeningHours() {
    const { id } = useParams();
    const navigate = useNavigate();

    // States
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const [currentAssignment, setCurrentAssignment] = useState(null);
    const [availableVorlagen, setAvailableVorlagen] = useState([]);
    const [selectedVorlageId, setSelectedVorlageId] = useState('');
    const [vorlageDetails, setVorlageDetails] = useState([]);

    // Daten laden
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // 1. Aktuelle Zuordnung des Restaurants holen
                const assignments = await restaurantOeffnungszeitService.getActiveForRestaurant(id);
                const currentActive = assignments && assignments.length > 0 ? assignments[0] : null;
                setCurrentAssignment(currentActive);

                // 2. Alle verfügbaren Vorlagen holen
                const vorlagen = await oeffnungszeitVorlageService.getAll();
                setAvailableVorlagen(vorlagen || []);

                // 3. Wenn es eine aktuelle Zuordnung gibt, Details laden
                if (currentActive) {
                    setSelectedVorlageId(currentActive.oeffnungszeitid);
                    await loadVorlageDetails(currentActive.oeffnungszeitid);
                } else if (vorlagen && vorlagen.length > 0) {
                    // Wenn keine Zuordnung, erste Vorlage vorauswählen
                    setSelectedVorlageId(vorlagen[0].oeffnungszeitid);
                    await loadVorlageDetails(vorlagen[0].oeffnungszeitid);
                }

            } catch (err) {
                console.error('❌ Fehler beim Laden:', err);
                setError('Öffnungszeiten konnten nicht geladen werden.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    // Details einer Vorlage laden
    const loadVorlageDetails = async (vorlageId) => {
        try {
            const vorlage = await oeffnungszeitVorlageService.getById(vorlageId);
            
            if (vorlage && vorlage.details) {
                // Details nach Wochentag sortieren
                const sortedDetails = [...vorlage.details].sort((a, b) => a.wochentag - b.wochentag);
                setVorlageDetails(sortedDetails);
            } else {
                setVorlageDetails([]);
            }
        } catch (err) {
            console.error('❌ Fehler beim Laden der Vorlage-Details:', err);
            setVorlageDetails([]);
        }
    };

    // Vorlage-Auswahl ändern
    const handleVorlageChange = async (e) => {
        const newVorlageId = parseInt(e.target.value);
        setSelectedVorlageId(newVorlageId);
        await loadVorlageDetails(newVorlageId);
    };

    // Speichern
    const handleSave = async () => {
        try {
            setSaving(true);
            setError(null);
            setSuccessMessage(null);

            const today = new Date().toISOString().split('T')[0];

            // Neue Zuordnung erstellen
            await restaurantOeffnungszeitService.create({
                restaurantid: parseInt(id),
                oeffnungszeitid: selectedVorlageId,
                gueltig_von: today,
                gueltig_bis: null,
                ist_aktiv: true
            });

            console.log('✅ Öffnungszeiten erfolgreich zugeordnet');
            setSuccessMessage('Öffnungszeiten erfolgreich gespeichert!');

            setTimeout(() => {
                navigate(`/restaurants/${id}`);
            }, 1500);

        } catch (err) {
            console.error('❌ Fehler beim Speichern:', err);
            setError('Fehler beim Speichern der Öffnungszeiten.');
        } finally {
            setSaving(false);
        }
    };

    // Loading State
    if (loading) {
        return (
            <Container>
                <LoadingState>
                    <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🕐</div>
                    Lade Öffnungszeiten...
                </LoadingState>
            </Container>
        );
    }

    return (
        <Container>
            <BackButton onClick={() => navigate(`/restaurants/${id}`)}>
                ← Zurück zum Restaurant
            </BackButton>

            <PageTitle>🕐 Öffnungszeiten bearbeiten</PageTitle>
            <Subtitle>Wähle eine Öffnungszeit-Vorlage für dein Restaurant</Subtitle>

            <EditNavigationTabs restaurantId={id} />

            {error && <ErrorMessage>{error}</ErrorMessage>}
            {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}

            {/* Vorlage-Auswahl */}
            <InfoCard>
                <CardTitle>📋 Öffnungszeit-Vorlage auswählen</CardTitle>

                {currentAssignment && (
                    <InfoBox>
                        ℹ️ Aktuell zugeordnet: <strong>{currentAssignment.vorlage?.bezeichnung || 'Unbekannt'}</strong>
                        {currentAssignment.gueltig_von && ` (gültig ab ${new Date(currentAssignment.gueltig_von).toLocaleDateString('de-DE')})`}
                    </InfoBox>
                )}

                <SelectGroup>
                    <Label>🏷️ Vorlage</Label>
                    <Select 
                        value={selectedVorlageId} 
                        onChange={handleVorlageChange}
                        disabled={saving}
                    >
                        {availableVorlagen.map(vorlage => (
                            <option key={vorlage.oeffnungszeitid} value={vorlage.oeffnungszeitid}>
                                {vorlage.bezeichnung}
                            </option>
                        ))}
                    </Select>
                </SelectGroup>

                <small style={{ color: colors.text.light, fontSize: '0.9em' }}>
                    💡 Tipp: Vorlagen können in der Verwaltung erstellt und bearbeitet werden
                </small>
            </InfoCard>

            {/* Details der ausgewählten Vorlage */}
            {vorlageDetails.length > 0 ? (
                <InfoCard>
                    <CardTitle>📅 Wochenplan</CardTitle>

                    {vorlageDetails.map((detail) => (
                        <DayCard key={detail.detailid}>
                            <DayHeader>
                                <DayName>
                                    {WOCHENTAGE[detail.wochentag - 1] || `Tag ${detail.wochentag}`}
                                </DayName>
                                {detail.ist_geschlossen ? (
                                    <ClosedBadge>Geschlossen</ClosedBadge>
                                ) : (
                                    <OpenBadge>Geöffnet</OpenBadge>
                                )}
                            </DayHeader>

                            {!detail.ist_geschlossen && (
                                <TimeDisplay>
                                    🕐 <strong>{detail.oeffnungszeitvon || '--:--'}</strong> 
                                    bis 
                                    <strong>{detail.oeffnungszeitbis || '--:--'}</strong> Uhr
                                </TimeDisplay>
                            )}
                        </DayCard>
                    ))}
                </InfoCard>
            ) : (
                <InfoCard>
                    <p style={{ textAlign: 'center', color: colors.text.light }}>
                        Keine Details für diese Vorlage verfügbar
                    </p>
                </InfoCard>
            )}

            {/* Speichern */}
            <ButtonContainer>
                <SaveButton onClick={handleSave} disabled={saving || !selectedVorlageId}>
                    {saving ? '💾 Speichert...' : '💾 Öffnungszeiten zuordnen'}
                </SaveButton>
            </ButtonContainer>
        </Container>
    );
}

export default EditOpeningHours;
