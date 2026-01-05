// EditOpeningHours.js - FINALE VERSION mit intelligenter Vorlagen-Verwaltung
// Diese Version vermeidet Duplikate und nutzt existierende Vorlagen wo möglich

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import colors from '../theme/colors';
import EditNavigationTabs from '../components/EditNavigationTabs';
import restaurantOeffnungszeitService from '../services/restaurantOeffnungszeitService';
import oeffnungszeitVorlageService from '../services/oeffnungszeitVorlageService';
import oeffnungszeitDetailService from '../services/oeffnungszeitDetailService';
import {
    areOpeningHoursEqual,
    findMatchingTemplate,
    generateTemplateName,
    validateOpeningHours
} from '../utils/openingHoursUtils';

// ==================== STYLED COMPONENTS ====================
// [Alle Styled Components wie in der vorherigen Version]

const Container = styled.div`
    max-width: 1200px;
    margin: 0 auto;
`;

const BackButton = styled.button`
    background: none;
    border: none;
    color: ${colors.primary.main};
    cursor: pointer;
    font-size: 1em;
    margin-bottom: 20px;
    padding: 8px 12px;
    border-radius: 6px;
    transition: all 0.3s ease;

    &:hover {
        background: ${colors.primary.light};
    }
`;

const PageTitle = styled.h1`
    color: ${colors.text.primary};
    margin-bottom: 10px;
    font-size: 2.2em;
`;

const Subtitle = styled.p`
    color: ${colors.text.secondary};
    margin-bottom: 30px;
    font-size: 1.1em;
`;

const LoadingState = styled.div`
    text-align: center;
    padding: 60px 20px;
    color: ${colors.text.secondary};
    font-size: 1.1em;
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

const InfoCard = styled.div`
    background: white;
    border-radius: 12px;
    padding: 30px;
    margin-bottom: 30px;
    box-shadow: ${colors.shadows.card};
`;

const CardTitle = styled.h2`
    color: ${colors.text.primary};
    margin-bottom: 25px;
    font-size: 1.4em;
    display: flex;
    align-items: center;
    gap: 10px;
`;

const DayCard = styled.div`
    background: ${colors.background.light};
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 15px;
    border: 2px solid ${props => props.$isClosed ? colors.border.light : colors.primary.light};
`;

const DayHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${props => props.$isClosed ? '0' : '15px'};
`;

const DayName = styled.div`
    font-weight: 600;
    font-size: 1.1em;
    color: ${colors.text.primary};
`;

const CheckboxContainer = styled.label`
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    color: ${colors.text.secondary};
    font-size: 0.95em;

    input[type="checkbox"] {
        width: 18px;
        height: 18px;
        cursor: pointer;
    }
`;

const TimeInputs = styled.div`
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 15px;
    align-items: center;
`;

const TimeInputGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const Label = styled.label`
    font-size: 0.9em;
    color: ${colors.text.secondary};
    font-weight: 500;
`;

const TimeInput = styled.input`
    padding: 12px;
    border: 2px solid ${colors.border.main};
    border-radius: 8px;
    font-size: 1em;
    transition: all 0.3s ease;
    font-family: monospace;

    &:focus {
        outline: none;
        border-color: ${colors.primary.main};
        box-shadow: 0 0 0 3px ${colors.primary.light};
    }

    &:disabled {
        background: ${colors.background.light};
        cursor: not-allowed;
    }
`;

const Separator = styled.div`
    text-align: center;
    color: ${colors.text.secondary};
    font-size: 1.2em;
    padding-top: 25px;
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 15px;
    margin-top: 30px;
`;

const SaveButton = styled.button`
    background: ${colors.gradients.primary};
    color: white;
    border: none;
    padding: 15px 40px;
    border-radius: 10px;
    cursor: pointer;
    font-size: 1.1em;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: ${colors.shadows.button};

    &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: ${colors.shadows.buttonHover};
    }

    &:disabled {
        background: ${colors.border.main};
        cursor: not-allowed;
        transform: none;
    }
`;

// ==================== HILFSFUNKTIONEN ====================

const WOCHENTAGE = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];

const initializeEmptyWeek = () => {
    return WOCHENTAGE.map((tag, index) => ({
        wochentag: index + 1,
        tagName: tag,
        ist_geschlossen: false,
        oeffnungszeitvon: '09:00',
        oeffnungszeitbis: '22:00',
    }));
};

// ==================== HAUPTKOMPONENTE ====================

function EditOpeningHours() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const [openingHours, setOpeningHours] = useState(initializeEmptyWeek());
    const [availableVorlagen, setAvailableVorlagen] = useState([]);
    const [currentVorlageId, setCurrentVorlageId] = useState(null);
    const [hasChanges, setHasChanges] = useState(false);

    // Daten laden
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Aktuelle Öffnungszeiten des Restaurants laden
                const assignments = await restaurantOeffnungszeitService.getActiveForRestaurant(id);

                if (assignments && assignments.length > 0) {
                    const currentAssignment = assignments[0];
                    setCurrentVorlageId(currentAssignment.oeffnungszeitid);

                    const vorlage = await oeffnungszeitVorlageService.getById(currentAssignment.oeffnungszeitid);

                    if (vorlage && vorlage.details) {
                        const sortedDetails = [...vorlage.details].sort((a, b) => a.wochentag - b.wochentag);
                        const formattedHours = sortedDetails.map(detail => ({
                            wochentag: detail.wochentag,
                            tagName: WOCHENTAGE[detail.wochentag - 1],
                            ist_geschlossen: detail.ist_geschlossen,
                            oeffnungszeitvon: detail.oeffnungszeitvon || '09:00',
                            oeffnungszeitbis: detail.oeffnungszeitbis || '22:00',
                            detailid: detail.detailid
                        }));
                        setOpeningHours(formattedHours);
                    }
                }

                // Alle Vorlagen laden
                const vorlagen = await oeffnungszeitVorlageService.getAll();
                setAvailableVorlagen(vorlagen || []);

            } catch (err) {
                console.error('❌ Fehler beim Laden:', err);
                setError('Öffnungszeiten konnten nicht geladen werden.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    // Änderungen tracken
    const handleTimeChange = (wochentag, field, value) => {
        setOpeningHours(prev =>
            prev.map(day =>
                day.wochentag === wochentag
                    ? { ...day, [field]: value }
                    : day
            )
        );
        setHasChanges(true);
    };

    const handleClosedToggle = (wochentag) => {
        setOpeningHours(prev =>
            prev.map(day =>
                day.wochentag === wochentag
                    ? { ...day, ist_geschlossen: !day.ist_geschlossen }
                    : day
            )
        );
        setHasChanges(true);
    };

    // INTELLIGENTES SPEICHERN
    const handleSave = async () => {
        try {
            setSaving(true);
            setError(null);
            setSuccessMessage(null);

            // 1. Validierung
            const validation = validateOpeningHours(openingHours);
            if (!validation.isValid) {
                setError(validation.errors.join(', '));
                return;
            }

            // 2. Prüfe ob eine identische Vorlage bereits existiert
            console.log('🔍 Suche nach identischer Vorlage...');
            const matchingTemplate = await findMatchingTemplate(
                openingHours,
                availableVorlagen,
                oeffnungszeitVorlageService
            );

            let vorlageId;

            if (matchingTemplate) {
                // Existierende Vorlage verwenden
                console.log('✅ Identische Vorlage gefunden:', matchingTemplate.bezeichnung);
                vorlageId = matchingTemplate.oeffnungszeitid;
                setSuccessMessage(`Bestehende Vorlage "${matchingTemplate.bezeichnung}" wird verwendet`);
            } else {
                // Neue Vorlage erstellen
                console.log('➕ Erstelle neue Vorlage...');
                const templateName = generateTemplateName(openingHours);

                const newVorlage = await oeffnungszeitVorlageService.create({
                    bezeichnung: templateName,
                    beschreibung: 'Automatisch erstellt'
                });
                vorlageId = newVorlage.oeffnungszeitid;

                // Details erstellen
                for (const day of openingHours) {
                    await oeffnungszeitDetailService.create({
                        oeffnungszeitid: vorlageId,
                        wochentag: day.wochentag,
                        oeffnungszeitvon: day.ist_geschlossen ? null : day.oeffnungszeitvon,
                        oeffnungszeitbis: day.ist_geschlossen ? null : day.oeffnungszeitbis,
                        ist_geschlossen: day.ist_geschlossen
                    });
                }

                console.log('✅ Neue Vorlage erstellt:', templateName);
            }

            // 3. Vorlage dem Restaurant zuordnen
            const today = new Date().toISOString().split('T')[0];

            await restaurantOeffnungszeitService.create({
                restaurantid: parseInt(id),
                oeffnungszeitid: vorlageId,
                gueltig_von: today,
                gueltig_bis: null,
                ist_aktiv: true
            });

            console.log('✅ Öffnungszeiten erfolgreich gespeichert');
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
            <Subtitle>Lege fest, wann dein Restaurant geöffnet ist</Subtitle>

            <EditNavigationTabs restaurantId={id} />

            {error && <ErrorMessage>{error}</ErrorMessage>}
            {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}

            <InfoCard>
                <CardTitle>📅 Wochenplan bearbeiten</CardTitle>

                {openingHours.map((day) => (
                    <DayCard key={day.wochentag} $isClosed={day.ist_geschlossen}>
                        <DayHeader $isClosed={day.ist_geschlossen}>
                            <DayName>{day.tagName}</DayName>
                            <CheckboxContainer>
                                <input
                                    type="checkbox"
                                    checked={day.ist_geschlossen}
                                    onChange={() => handleClosedToggle(day.wochentag)}
                                    disabled={saving}
                                />
                                Geschlossen
                            </CheckboxContainer>
                        </DayHeader>

                        {!day.ist_geschlossen && (
                            <TimeInputs>
                                <TimeInputGroup>
                                    <Label>🕐 Öffnung</Label>
                                    <TimeInput
                                        type="time"
                                        value={day.oeffnungszeitvon}
                                        onChange={(e) => handleTimeChange(day.wochentag, 'oeffnungszeitvon', e.target.value)}
                                        disabled={saving}
                                    />
                                </TimeInputGroup>

                                <Separator>bis</Separator>

                                <TimeInputGroup>
                                    <Label>🕐 Schließung</Label>
                                    <TimeInput
                                        type="time"
                                        value={day.oeffnungszeitbis}
                                        onChange={(e) => handleTimeChange(day.wochentag, 'oeffnungszeitbis', e.target.value)}
                                        disabled={saving}
                                    />
                                </TimeInputGroup>
                            </TimeInputs>
                        )}
                    </DayCard>
                ))}
            </InfoCard>

            <ButtonContainer>
                <SaveButton onClick={handleSave} disabled={saving || !hasChanges}>
                    {saving ? '💾 Speichert...' : '💾 Öffnungszeiten speichern'}
                </SaveButton>
            </ButtonContainer>
        </Container>
    );
}

export default EditOpeningHours;