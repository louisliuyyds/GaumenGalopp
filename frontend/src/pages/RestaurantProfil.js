import React, { useState } from 'react';
import styled from 'styled-components';
import colors from '../theme/colors';
import restaurantService from '../services/restaurantService';

const Container = styled.div`
    padding: 20px;
    background-color: ${colors.background.light};
    min-height: 100vh;
`;

const Title = styled.h1`
    color: ${colors.primary.main};
    margin-bottom: 12px;
`;

const Subtitle = styled.p`
    color: ${colors.text.secondary};
    margin-bottom: 24px;
`;

const Toolbar = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 24px;
`;

const ToolbarField = styled.div`
    flex: 0 1 320px;
    min-width: 220px;
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const Form = styled.form`
    background-color: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 20px 60px rgba(15,13,49,0.08);
    max-width: 720px;
`;

const FormGroup = styled.div`
    margin-bottom: 20px;
`;

const Label = styled.label`
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
    color: ${colors.text.primary};
`;

const Input = styled.input`
    width: 100%;
    max-width: 320px;
    padding: 10px;
    border: 1px solid ${colors.border};
    border-radius: 4px;
    font-size: 16px;
    &:disabled {
        background-color: #f5f5f5;
        cursor: not-allowed;
    }
`;

const TextArea = styled.textarea`
    width: 100%;
    max-width: 480px;
    min-height: 90px;
    padding: 10px;
    border: 1px solid ${colors.border};
    border-radius: 4px;
    font-size: 16px;
    resize: vertical;
    &:disabled {
        background-color: #f5f5f5;
        cursor: not-allowed;
    }
`;

const Select = styled.select`
    width: 100%;
    max-width: 320px;
    padding: 10px;
    border: 1px solid ${colors.border};
    border-radius: 4px;
    font-size: 16px;
    background-color: white;
    &:disabled {
        background-color: #f5f5f5;
        cursor: not-allowed;
    }
`;

const DetailRow = styled.div`
    display: grid;
    grid-template-columns: 140px repeat(2, 1fr) 150px 110px;
    gap: 10px;
    align-items: center;
    margin-bottom: 12px;

    @media (max-width: 720px) {
        grid-template-columns: 1fr;
        grid-template-rows: repeat(5, auto);
    }
`;

const CheckboxLabel = styled.label`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.95rem;
    color: ${colors.text.primary};
    justify-content: flex-end;
    width: 100%;
`;

const variantBackground = {
    primary: colors.primary.main,
    danger: colors.status.error,
    success: colors.status.success,
    accent: colors.accent.gold,
    default: colors.accent.lightOrange,
};

const Button = styled.button`
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    min-width: ${({ fullWidth }) => (fullWidth ? '100%' : '140px')};
    background-color: ${({ variant }) => variantBackground[variant] || variantBackground.default};
    color: ${({ variant }) => (variant === 'accent' ? colors.primary.dark : 'white')};
    width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
    transition: opacity 0.2s ease, transform 0.2s ease;

    &:hover:not(:disabled) {
        opacity: 0.9;
        transform: translateY(-1px);
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const SmallButton = styled(Button)`
    min-width: auto;
    padding: 8px 12px;
`;

const InfoText = styled.p`
    font-size: 0.9rem;
    color: ${colors.text.secondary};
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 12px;
    margin-top: 30px;
`;

const StatusBanner = styled.div`
    padding: 12px 16px;
    border-radius: 8px;
    margin-bottom: 20px;
    border: 1px solid ${props => props.variant === 'error' ? '#ffb4a9' : props.variant === 'success' ? '#a5d6a7' : '#90caf9'};
    background-color: ${props => props.variant === 'error' ? '#fdecea' : props.variant === 'success' ? '#e8f5e9' : '#e3f2fd'};
    color: ${props => props.variant === 'error' ? '#c62828' : props.variant === 'success' ? '#2e7d32' : '#1565c0'};
`;

const SectionTitle = styled.h3`
    margin-top: 28px;
    margin-bottom: 12px;
    color: ${colors.primary.dark};
`;

const EmptyState = styled.p`
    color: ${colors.text.secondary};
    font-style: italic;
`;

const ADDRESS_FIELDS = [
    { name: 'strasse', label: 'Straße' },
    { name: 'hausnummer', label: 'Hausnummer' },
    { name: 'postleitzahl', label: 'Postleitzahl' },
    { name: 'ort', label: 'Ort' },
    { name: 'land', label: 'Land' }
];

const WEEKDAYS = [
    { value: 1, label: 'Montag' },
    { value: 2, label: 'Dienstag' },
    { value: 3, label: 'Mittwoch' },
    { value: 4, label: 'Donnerstag' },
    { value: 5, label: 'Freitag' },
    { value: 6, label: 'Samstag' },
    { value: 7, label: 'Sonntag' }
];

const emptyProfile = {
    restaurantid: '',
    adresseid: '',
    name: '',
    klassifizierung: '',
    telefon: '',
    kuechenchef: '',
    adresse: {
        strasse: '',
        land: '',
        ort: '',
        hausnummer: '',
        postleitzahl: ''
    }
};

const mapApiToState = (payload) => ({
    restaurantid: payload?.restaurantid ? String(payload.restaurantid) : '',
    adresseid: payload?.adresseid ? String(payload.adresseid) : '',
    name: payload?.name ?? '',
    klassifizierung: payload?.klassifizierung ?? '',
    telefon: payload?.telefon ?? '',
    kuechenchef: payload?.kuechenchef ?? '',
    adresse: {
        strasse: payload?.adresse?.straße ?? '',
        land: payload?.adresse?.land ?? '',
        ort: payload?.adresse?.ort ?? '',
        hausnummer: payload?.adresse?.hausnummer ?? '',
        postleitzahl: payload?.adresse?.postleitzahl ?? ''
    }
});

const mapStateToApi = (state) => ({
    name: state.name,
    klassifizierung: state.klassifizierung,
    telefon: state.telefon,
    kuechenchef: state.kuechenchef,
    adresse: state.adresse ? {
        straße: state.adresse.strasse,
        land: state.adresse.land,
        ort: state.adresse.ort,
        hausnummer: state.adresse.hausnummer,
        postleitzahl: state.adresse.postleitzahl
    } : undefined
});

const toTimeInput = (value) => (value ? value.slice(0, 5) : '');

const mapOpeningApiToState = (payload) => {
    if (!payload) {
        return null;
    }

    return {
        restaurantid: payload.restaurantid,
        oeffnungszeitid: payload.oeffnungszeitid,
        gueltig_von: payload.gueltig_von ?? '',
        gueltig_bis: payload.gueltig_bis ?? '',
        ist_aktiv: payload.ist_aktiv ?? true,
        vorlage: {
            bezeichnung: payload.vorlage?.bezeichnung ?? '',
            beschreibung: payload.vorlage?.beschreibung ?? '',
            details: (payload.vorlage?.details ?? [])
                .map(detail => ({
                    detailid: detail.detailid ?? null,
                    wochentag: detail.wochentag,
                    oeffnungszeit: toTimeInput(detail.oeffnungszeit),
                    schliessungszeit: toTimeInput(detail.schliessungszeit),
                    ist_geschlossen: Boolean(detail.ist_geschlossen)
                }))
                .sort((a, b) => a.wochentag - b.wochentag)
        }
    };
};

const normalizeTimeValue = (value) => (value ? `${value}:00`.slice(0, 8) : null);

const mapOpeningStateToApi = (state) => {
    if (!state) {
        return null;
    }

    const parsedId = state.oeffnungszeitid ? Number(state.oeffnungszeitid) : undefined;

    return {
        oeffnungszeitid: parsedId,
        gueltig_von: state.gueltig_von || undefined,
        gueltig_bis: state.gueltig_bis || null,
        ist_aktiv: state.ist_aktiv,
        vorlage: {
            oeffnungszeitid: parsedId,
            bezeichnung: state.vorlage?.bezeichnung,
            beschreibung: state.vorlage?.beschreibung,
            details: (state.vorlage?.details || []).map(detail => ({
                detailid: detail.detailid,
                wochentag: detail.wochentag,
                oeffnungszeit: normalizeTimeValue(detail.oeffnungszeit),
                schliessungszeit: normalizeTimeValue(detail.schliessungszeit),
                ist_geschlossen: Boolean(detail.ist_geschlossen)
            }))
        }
    };
};

const createEmptyDetail = (existingDetails = []) => {
    const usedDays = existingDetails.map(detail => detail.wochentag);
    const fallbackDay = WEEKDAYS.find(day => !usedDays.includes(day.value))?.value || 1;
    return {
        detailid: null,
        wochentag: fallbackDay,
        oeffnungszeit: '',
        schliessungszeit: '',
        ist_geschlossen: false
    };
};

const RestaurantProfil = () => {
    const [profile, setProfile] = useState(emptyProfile);
    const [openingProfile, setOpeningProfile] = useState(null);
    const [restaurantIdInput, setRestaurantIdInput] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({
            ...prev,
            adresse: {
                ...prev.adresse,
                [name]: value
            }
        }));
    };

    const handleOpeningMetaChange = (e) => {
        const { name, value, type, checked } = e.target;
        setOpeningProfile(prev => prev ? ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }) : prev);
    };

    const handleTemplateChange = (e) => {
        const { name, value } = e.target;
        setOpeningProfile(prev => prev ? ({
            ...prev,
            vorlage: {
                ...prev.vorlage,
                [name]: value
            }
        }) : prev);
    };

    const handleDetailChange = (index, field, value) => {
        setOpeningProfile(prev => {
            if (!prev) {
                return prev;
            }
            const details = prev.vorlage.details.map((detail, idx) => (
                idx === index ? { ...detail, [field]: value } : detail
            ));
            return {
                ...prev,
                vorlage: {
                    ...prev.vorlage,
                    details
                }
            };
        });
    };

    const toggleDetailClosed = (index, checked) => {
        setOpeningProfile(prev => {
            if (!prev) {
                return prev;
            }
            const details = prev.vorlage.details.map((detail, idx) => {
                if (idx !== index) {
                    return detail;
                }
                return {
                    ...detail,
                    ist_geschlossen: checked,
                    oeffnungszeit: checked ? '' : detail.oeffnungszeit,
                    schliessungszeit: checked ? '' : detail.schliessungszeit
                };
            });
            return {
                ...prev,
                vorlage: {
                    ...prev.vorlage,
                    details
                }
            };
        });
    };

    const addDetailRow = () => {
        setOpeningProfile(prev => {
            if (!prev) {
                return prev;
            }
            const nextDetail = createEmptyDetail(prev.vorlage.details);
            return {
                ...prev,
                vorlage: {
                    ...prev.vorlage,
                    details: [...prev.vorlage.details, nextDetail]
                }
            };
        });
    };

    const removeDetailRow = (index) => {
        setOpeningProfile(prev => {
            if (!prev) {
                return prev;
            }
            if (prev.vorlage.details.length <= 1) {
                return prev;
            }
            const details = prev.vorlage.details.filter((_, idx) => idx !== index);
            return {
                ...prev,
                vorlage: {
                    ...prev.vorlage,
                    details
                }
            };
        });
    };

    const loadProfile = async (explicitId) => {
        const sourceId = explicitId ?? restaurantIdInput;
        const trimmedId = (sourceId ?? '').toString().trim();
        if (!trimmedId) {
            setStatus({ type: 'error', text: 'Bitte eine gültige Restaurant-ID eingeben.' });
            return;
        }

        setLoading(true);
        setStatus(null);
        try {
            const [coreData, openingData] = await Promise.all([
                restaurantService.getProfile(trimmedId),
                restaurantService.getOpeningProfile(trimmedId).catch(error => {
                    if (error?.status === 404) {
                        return null;
                    }
                    throw error;
                })
            ]);

            setProfile(mapApiToState(coreData));
            setOpeningProfile(mapOpeningApiToState(openingData));
            setRestaurantIdInput(trimmedId);
            setIsEditing(false);
            setStatus({ type: 'success', text: `Restaurant ${coreData.restaurantid} geladen.` });
        } catch (error) {
            setProfile(emptyProfile);
            setOpeningProfile(null);
            setIsEditing(false);
            setStatus({ type: 'error', text: error.message || 'Profil konnte nicht geladen werden.' });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!profile.restaurantid) {
            setStatus({ type: 'error', text: 'Bitte zuerst ein Restaurant laden.' });
            return;
        }

        setSaving(true);
        setStatus(null);
        try {
            const payload = mapStateToApi(profile);
            const updated = await restaurantService.updateProfile(profile.restaurantid, payload);
            setProfile(mapApiToState(updated));

            if (openingProfile) {
                const openingPayload = mapOpeningStateToApi(openingProfile);
                if (openingPayload?.oeffnungszeitid) {
                    const updatedOpening = await restaurantService.updateOpeningProfile(
                        profile.restaurantid,
                        openingPayload
                    );
                    setOpeningProfile(mapOpeningApiToState(updatedOpening));
                }
            }

            setIsEditing(false);
            setStatus({ type: 'success', text: 'Profil erfolgreich gespeichert.' });
        } catch (error) {
            setStatus({ type: 'error', text: error.message || 'Fehler beim Speichern des Profils.' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <Container>
            <Title>Restaurant-Profil</Title>
            <Subtitle>Gib eine Restaurant-ID ein, um die Stammdaten und Adresse zu laden und zu bearbeiten.</Subtitle>

            <Toolbar>
                <ToolbarField>
                    <Label htmlFor="restaurantid-input">Restaurant-ID auswählen</Label>
                    <Input
                        id="restaurantid-input"
                        name="restaurantIdInput"
                        value={restaurantIdInput}
                        onChange={(e) => setRestaurantIdInput(e.target.value)}
                        placeholder="z. B. 1"
                        disabled={loading}
                    />
                    <Button
                        type="button"
                        variant="accent"
                        onClick={() => loadProfile()}
                        disabled={loading}
                        fullWidth
                    >
                        {loading ? 'Lädt...' : 'Profil laden'}
                    </Button>
                </ToolbarField>
            </Toolbar>

            {status && <StatusBanner variant={status.type}>{status.text}</StatusBanner>}

            <Form onSubmit={(e) => e.preventDefault()}>
                {profile.restaurantid ? (
                    <>
                        <FormGroup>
                            <Label>Restaurant-ID</Label>
                            <Input
                                name="restaurantid"
                                value={profile.restaurantid}
                                disabled
                            />
                        </FormGroup>

                        <SectionTitle>Stammdaten</SectionTitle>
                        <FormGroup>
                            <Label>Name</Label>
                            <Input
                                name="name"
                                value={profile.name}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label>Klassifizierung</Label>
                            <Input
                                name="klassifizierung"
                                value={profile.klassifizierung || ''}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label>Telefon</Label>
                            <Input
                                name="telefon"
                                value={profile.telefon || ''}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label>Küchenchef</Label>
                            <Input
                                name="kuechenchef"
                                value={profile.kuechenchef || ''}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </FormGroup>

                        <SectionTitle>Adresse</SectionTitle>
                        {ADDRESS_FIELDS.map(field => (
                            <FormGroup key={field.name}>
                                <Label>{field.label}</Label>
                                <Input
                                    name={field.name}
                                    value={profile.adresse?.[field.name] || ''}
                                    onChange={handleAddressChange}
                                    disabled={!isEditing}
                                />
                            </FormGroup>
                        ))}

                        <SectionTitle>Öffnungszeiten</SectionTitle>
                        {openingProfile ? (
                            <>
                                <FormGroup>
                                    <Label>Bezeichnung der Vorlage</Label>
                                    <Input
                                        name="bezeichnung"
                                        value={openingProfile.vorlage?.bezeichnung || ''}
                                        onChange={handleTemplateChange}
                                        disabled={!isEditing}
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label>Beschreibung</Label>
                                    <TextArea
                                        name="beschreibung"
                                        value={openingProfile.vorlage?.beschreibung || ''}
                                        onChange={handleTemplateChange}
                                        disabled={!isEditing}
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label>Gültigkeitszeitraum</Label>
                                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                        <Input
                                            type="date"
                                            name="gueltig_von"
                                            value={openingProfile.gueltig_von || ''}
                                            onChange={handleOpeningMetaChange}
                                            disabled={!isEditing}
                                        />
                                        <Input
                                            type="date"
                                            name="gueltig_bis"
                                            value={openingProfile.gueltig_bis || ''}
                                            onChange={handleOpeningMetaChange}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </FormGroup>

                                <FormGroup>
                                    <CheckboxLabel>
                                        <input
                                            type="checkbox"
                                            name="ist_aktiv"
                                            checked={Boolean(openingProfile.ist_aktiv)}
                                            onChange={handleOpeningMetaChange}
                                            disabled={!isEditing}
                                        />
                                        Öffnungszeiten sind aktiv
                                    </CheckboxLabel>
                                </FormGroup>

                                <FormGroup>
                                    <Label>Wöchentliche Zeiten</Label>
                                    <InfoText>Zeiten im 24-Stunden-Format (HH:MM) pflegen oder Tage als geschlossen markieren.</InfoText>
                                    {openingProfile.vorlage?.details?.length ? (
                                        openingProfile.vorlage.details.map((detail, index) => (
                                            <DetailRow key={`detail-${detail.detailid ?? index}`}>
                                                <Select
                                                    value={detail.wochentag}
                                                    onChange={(e) => handleDetailChange(index, 'wochentag', Number(e.target.value))}
                                                    disabled={!isEditing}
                                                >
                                                    {WEEKDAYS.map(day => (
                                                        <option key={day.value} value={day.value}>{day.label}</option>
                                                    ))}
                                                </Select>
                                                <Input
                                                    type="time"
                                                    value={detail.oeffnungszeit || ''}
                                                    onChange={(e) => handleDetailChange(index, 'oeffnungszeit', e.target.value)}
                                                    disabled={!isEditing || detail.ist_geschlossen}
                                                />
                                                <Input
                                                    type="time"
                                                    value={detail.schliessungszeit || ''}
                                                    onChange={(e) => handleDetailChange(index, 'schliessungszeit', e.target.value)}
                                                    disabled={!isEditing || detail.ist_geschlossen}
                                                />
                                                <CheckboxLabel>
                                                    <input
                                                        type="checkbox"
                                                        checked={Boolean(detail.ist_geschlossen)}
                                                        onChange={(e) => toggleDetailClosed(index, e.target.checked)}
                                                        disabled={!isEditing}
                                                    />
                                                    Geschlossen
                                                </CheckboxLabel>
                                                {isEditing && (
                                                    <SmallButton
                                                        type="button"
                                                        variant="danger"
                                                        onClick={() => removeDetailRow(index)}
                                                    >
                                                        Entfernen
                                                    </SmallButton>
                                                )}
                                            </DetailRow>
                                        ))
                                    ) : (
                                        <EmptyState>Keine Zeitfenster hinterlegt.</EmptyState>
                                    )}

                                    {isEditing && (
                                        <SmallButton type="button" variant="accent" onClick={addDetailRow}>
                                            Zeitfenster hinzufügen
                                        </SmallButton>
                                    )}
                                </FormGroup>
                            </>
                        ) : (
                            <EmptyState>Für dieses Restaurant sind noch keine Öffnungszeiten hinterlegt.</EmptyState>
                        )}

                        <ButtonGroup>
                            {!isEditing ? (
                                <Button variant="primary" onClick={() => setIsEditing(true)}>Bearbeiten</Button>
                            ) : (
                                <>
                                    <Button variant="success" onClick={handleSave} disabled={saving}>
                                        {saving ? 'Speichert...' : 'Speichern'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="danger"
                                        onClick={() => {
                                            setIsEditing(false);
                                            loadProfile(profile.restaurantid);
                                        }}
                                        disabled={saving}
                                    >
                                        Änderungen verwerfen
                                    </Button>
                                </>
                            )}
                        </ButtonGroup>
                    </>
                ) : (
                    <EmptyState>Kein Profil geladen. Bitte eine Restaurant-ID auswählen.</EmptyState>
                )}
            </Form>
        </Container>
    );
};

export default RestaurantProfil;
