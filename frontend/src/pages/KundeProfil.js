import React, { useState } from 'react';
import styled from 'styled-components';
import colors from '../theme/colors';
import kundeService from '../services/kundeService';
import kritikerService from '../services/kritikerService';

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
    min-height: 100px;
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

const ButtonGroup = styled.div`
    display: flex;
    gap: 12px;
    margin-top: 30px;
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

const emptyProfile = {
    kundenid: '',
    vorname: '',
    nachname: '',
    geburtsdatum: '',
    telefonnummer: '',
    email: '',
    namenskuerzel: '',
    adresse: {
        strasse: '',
        land: '',
        ort: '',
        hausnummer: '',
        postleitzahl: ''
    }
};

const mapApiToState = (payload) => ({
    kundenid: payload?.kundenid ? String(payload.kundenid) : '',
    vorname: payload?.vorname ?? '',
    nachname: payload?.nachname ?? '',
    geburtsdatum: payload?.geburtsdatum ?? '',
    telefonnummer: payload?.telefonnummer ?? '',
    email: payload?.email ?? '',
    namenskuerzel: payload?.namenskuerzel ?? '',
    adresse: {
        strasse: payload?.adresse?.straße ?? '',
        land: payload?.adresse?.land ?? '',
        ort: payload?.adresse?.ort ?? '',
        hausnummer: payload?.adresse?.hausnummer ?? '',
        postleitzahl: payload?.adresse?.postleitzahl ?? ''
    }
});

const mapKritikerToState = (payload) => ({
    kritikerid: payload?.kritikerid ? String(payload.kritikerid) : '',
    kundenid: payload?.kundenid ? String(payload.kundenid) : '',
    kritikername: payload?.kritikername ?? '',
    beschreibung: payload?.beschreibung ?? ''
});

const mapStateToApi = (state) => ({
    vorname: state.vorname,
    nachname: state.nachname,
    geburtsdatum: state.geburtsdatum || undefined,
    telefonnummer: state.telefonnummer,
    email: state.email,
    namenskuerzel: state.namenskuerzel,
    adresse: state.adresse ? {
        straße: state.adresse.strasse,
        land: state.adresse.land,
        ort: state.adresse.ort,
        hausnummer: state.adresse.hausnummer,
        postleitzahl: state.adresse.postleitzahl
    } : undefined
});

const KundeProfil = () => {
    const [profile, setProfile] = useState(emptyProfile);
    const [kritikerProfile, setKritikerProfile] = useState(null);
    const [kundenIdInput, setKundenIdInput] = useState('');
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

    const handleKritikerChange = (e) => {
        const { name, value } = e.target;
        setKritikerProfile(prev => (prev ? {
            ...prev,
            [name]: value
        } : prev));
    };

    const loadProfile = async (explicitId) => {
        const sourceId = explicitId ?? kundenIdInput;
        const trimmedId = (sourceId ?? '').toString().trim();
        if (!trimmedId) {
            setStatus({ type: 'error', text: 'Bitte eine gültige Kunden-ID eingeben.' });
            return;
        }

        setLoading(true);
        setStatus(null);
        try {
            const kritikerPromise = kritikerService.getByKundenId(trimmedId)
                .then(mapKritikerToState)
                .catch(error => {
                    if (error?.status === 404) {
                        return null;
                    }
                    throw error;
                });

            const [kundeData, kritikerData] = await Promise.all([
                kundeService.getProfile(trimmedId),
                kritikerPromise
            ]);

            setProfile(mapApiToState(kundeData));
            setKundenIdInput(trimmedId);
            setKritikerProfile(kritikerData);
            setIsEditing(false);
            setStatus({ type: 'success', text: `Profil ${kundeData.kundenid} geladen.` });
        } catch (error) {
            setProfile(emptyProfile);
            setKritikerProfile(null);
            setIsEditing(false);
            setStatus({ type: 'error', text: error.message || 'Profil konnte nicht geladen werden.' });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!profile.kundenid) {
            setStatus({ type: 'error', text: 'Bitte zuerst ein Profil laden.' });
            return;
        }

        setSaving(true);
        setStatus(null);
        try {
            const payload = mapStateToApi(profile);
            const updated = await kundeService.updateProfile(profile.kundenid, payload);

            let nextKritikerState = kritikerProfile;
            if (kritikerProfile?.kritikerid) {
                const updatedKritiker = await kritikerService.update(
                    kritikerProfile.kritikerid,
                    {
                        kritikername: kritikerProfile.kritikername,
                        beschreibung: kritikerProfile.beschreibung
                    }
                );
                nextKritikerState = mapKritikerToState(updatedKritiker);
            }

            setProfile(mapApiToState(updated));
            setKritikerProfile(nextKritikerState);
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
            <Title>Mein Profil</Title>
            <Subtitle>Da es noch keine Anmeldung gibt, kannst du hier die gewünschte Kunden-ID eingeben, um ein Profil zu laden und zu bearbeiten.</Subtitle>

            <Toolbar>
                <ToolbarField>
                    <Label htmlFor="kundenid-input">Kunden-ID auswählen</Label>
                    <Input
                        id="kundenid-input"
                        name="kundenidInput"
                        value={kundenIdInput}
                        onChange={(e) => setKundenIdInput(e.target.value)}
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
                {profile.kundenid ? (
                    <>
                        <FormGroup>
                            <Label>Kunden-ID</Label>
                            <Input
                                name="kundenid"
                                value={profile.kundenid}
                                disabled
                            />
                        </FormGroup>

                        <SectionTitle>Persönliche Daten</SectionTitle>
                        <FormGroup>
                            <Label>Vorname</Label>
                            <Input
                                name="vorname"
                                value={profile.vorname}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label>Nachname</Label>
                            <Input
                                name="nachname"
                                value={profile.nachname}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label>Geburtsdatum</Label>
                            <Input
                                type="date"
                                name="geburtsdatum"
                                value={profile.geburtsdatum || ''}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label>Telefonnummer</Label>
                            <Input
                                name="telefonnummer"
                                value={profile.telefonnummer || ''}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label>E-Mail</Label>
                            <Input
                                type="email"
                                name="email"
                                value={profile.email || ''}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label>Namenskürzel</Label>
                            <Input
                                name="namenskuerzel"
                                value={profile.namenskuerzel || ''}
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

                        {kritikerProfile && (
                            <>
                                <SectionTitle>Kritikerprofil</SectionTitle>
                                <FormGroup>
                                    <Label>Kritikername</Label>
                                    <Input
                                        name="kritikername"
                                        value={kritikerProfile.kritikername || ''}
                                        onChange={handleKritikerChange}
                                        disabled={!isEditing}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label>Beschreibung</Label>
                                    <TextArea
                                        name="beschreibung"
                                        value={kritikerProfile.beschreibung || ''}
                                        onChange={handleKritikerChange}
                                        disabled={!isEditing}
                                    />
                                </FormGroup>
                            </>
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
                                            loadProfile(profile.kundenid);
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
                    <EmptyState>Kein Profil geladen. Bitte oberhalb eine Kunden-ID auswählen.</EmptyState>
                )}
            </Form>
        </Container>
    );
};

export default KundeProfil;
