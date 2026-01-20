import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { kundeService, kritikerService } from '../services';
import colors from '../theme/colors';

const Container = styled.div`
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
`;

const Card = styled.div`
    background: white;
    border-radius: 12px;
    padding: 30px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
`;

const Header = styled.h2`
    color: ${colors.primary.dark};
    margin-bottom: 24px;
`;

const FormGroup = styled.div`
    margin-bottom: 16px;
`;

const Label = styled.label`
    display: block;
    margin-bottom: 6px;
    color: ${colors.text.primary};
    font-weight: 500;
`;

const Input = styled.input`
    width: 100%;
    padding: 10px 12px;
    border: 1px solid ${colors.border.light};
    border-radius: 6px;
    font-size: 15px;
    transition: border-color 0.2s;

    &:focus {
        outline: none;
        border-color: ${colors.primary.main};
    }

    &:disabled {
        background-color: #f5f5f5;
        cursor: not-allowed;
    }
`;

const TextArea = styled.textarea`
    width: 100%;
    padding: 10px 12px;
    border: 1px solid ${colors.border.light};
    border-radius: 6px;
    font-size: 15px;
    min-height: 100px;
    font-family: inherit;
    resize: vertical;
    transition: border-color 0.2s;

    &:focus {
        outline: none;
        border-color: ${colors.primary.main};
    }

    &:disabled {
        background-color: #f5f5f5;
        cursor: not-allowed;
    }
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 12px;
    margin-top: 24px;
`;

const Button = styled.button`
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: opacity 0.2s ease, transform 0.2s ease;
    background: ${({ variant }) => (variant === 'primary' ? colors.primary.main : 'white')};
    color: ${({ variant }) => (variant === 'primary' ? 'white' : colors.primary.dark)};
    border: ${({ variant }) => (variant === 'primary' ? 'none' : `1px solid ${colors.border.medium}`)};
    width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};

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

const ToggleContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    background: ${colors.background.light};
    border-radius: 8px;
    margin-bottom: 20px;
    border: 2px solid ${props => props.$active ? 'rgba(138, 109, 59, 0.3)' : colors.border.light};
`;

const Toggle = styled.input.attrs({ type: 'checkbox' })`
    width: 48px;
    height: 24px;
    appearance: none;
    background: ${props => props.checked ? 'linear-gradient(135deg, #8a6d3b 0%, #b8860b 100%)' : colors.border.medium};
    border-radius: 12px;
    position: relative;
    cursor: pointer;
    transition: background 0.3s;

    &:after {
        content: '';
        position: absolute;
        top: 2px;
        left: ${props => props.checked ? '26px' : '2px'};
        width: 20px;
        height: 20px;
        background: white;
        border-radius: 50%;
        transition: left 0.3s;
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const ToggleLabel = styled.label`
    font-weight: 600;
    color: ${colors.text.primary};
    cursor: pointer;
    user-select: none;
`;

const KritikerBadge = styled.span`
    background: linear-gradient(135deg, #8a6d3b 0%, #b8860b 100%);
    color: white;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 0.85em;
    font-weight: 700;
    margin-left: 8px;
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
    const { user } = useAuth();
    const [profile, setProfile] = useState(emptyProfile);
    const [kritikerProfile, setKritikerProfile] = useState(null);
    const [wantKritiker, setWantKritiker] = useState(false); // Toggle-State
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState(null);

    useEffect(() => {
        if (user?.user_id) {
            loadProfile(user.user_id);
        }
    }, [user]);

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
        console.log('Kritiker-Feld geändert:', name, value);

        if (wantKritiker) {
            setKritikerProfile(prev => {
                const current = prev || {
                    kritikerid: '',
                    kundenid: profile.kundenid,
                    kritikername: '',
                    beschreibung: ''
                };
                return {
                    ...current,
                    [name]: value
                };
            });
        }
    };

    const handleKritikerToggle = () => {
        if (!isEditing) return;

        const newValue = !wantKritiker;
        console.log('Toggle Kritiker:', newValue);
        setWantKritiker(newValue);

        // Wenn aktiviert und noch kein Profil existiert, initialisiere mit Defaults
        if (newValue && !kritikerProfile) {
            const initialProfile = {
                kritikerid: '',
                kundenid: profile.kundenid,
                kritikername: profile.namenskuerzel || '',
                beschreibung: ''
            };
            console.log('Initialisiere Kritiker-Profil:', initialProfile);
            setKritikerProfile(initialProfile);
        }
    };

    const loadProfile = async (userId) => {
        setLoading(true);
        setStatus(null);
        try {
            const kritikerPromise = kritikerService.getByKundenId(userId)
                .then(mapKritikerToState)
                .catch(error => {
                    // 404 ist ok - bedeutet nur, dass kein Kritiker existiert
                    const status = error.response?.status || error.status;
                    if (status === 404) {
                        console.log('Kein Kritiker gefunden - ist ok');
                        return null;
                    }
                    // Andere Fehler werfen
                    throw error;
                });

            const [kundeData, kritikerData] = await Promise.all([
                kundeService.getProfile(userId),
                kritikerPromise
            ]);

            console.log('Profil geladen:', kundeData);
            console.log('Kritiker-Status:', kritikerData);

            setProfile(mapApiToState(kundeData));
            setKritikerProfile(kritikerData);
            setWantKritiker(kritikerData !== null); // Toggle entsprechend setzen
            setIsEditing(false);
            setStatus({ type: 'success', text: `Profil geladen.` });
        } catch (error) {
            console.error('Fehler beim Laden:', error);
            setProfile(emptyProfile);
            setKritikerProfile(null);
            setWantKritiker(false);
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

        console.log('💾 Speichern gestartet...');
        console.log('wantKritiker:', wantKritiker);
        console.log('kritikerProfile:', kritikerProfile);

        setSaving(true);
        setStatus(null);
        try {
            // 1. Kundenprofil speichern
            const payload = mapStateToApi(profile);
            const updated = await kundeService.updateProfile(profile.kundenid, payload);
            setProfile(mapApiToState(updated));
            console.log('✅ Kundenprofil gespeichert');

            // 2. Kritiker-Status managen
            if (wantKritiker) {
                console.log('🔄 User will Kritiker werden/bleiben');
                // User will Kritiker sein
                if (kritikerProfile?.kritikerid) {
                    console.log('📝 Update bestehender Kritiker:', kritikerProfile.kritikerid);
                    // Update bestehender Kritiker
                    const updatedKritiker = await kritikerService.update(
                        kritikerProfile.kritikerid,
                        {
                            kritikername: kritikerProfile.kritikername,
                            beschreibung: kritikerProfile.beschreibung
                        }
                    );
                    setKritikerProfile(mapKritikerToState(updatedKritiker));
                    console.log('✅ Kritiker aktualisiert');
                } else {
                    console.log('➕ Neuen Kritiker erstellen');
                    // Neuen Kritiker erstellen
                    const newKritiker = await kritikerService.create({
                        kundenid: parseInt(profile.kundenid),
                        kritikername: kritikerProfile?.kritikername || profile.namenskuerzel || 'Kritiker',
                        beschreibung: kritikerProfile?.beschreibung || ''
                    });
                    setKritikerProfile(mapKritikerToState(newKritiker));
                    console.log('✅ Kritiker erstellt:', newKritiker);
                }
            } else {
                console.log('❌ User will kein Kritiker mehr sein');
                // User will kein Kritiker mehr sein
                if (kritikerProfile?.kritikerid) {
                    console.log('🗑️ Lösche Kritiker:', kritikerProfile.kritikerid);
                    await kritikerService.delete(kritikerProfile.kritikerid);
                    setKritikerProfile(null);
                    console.log('✅ Kritiker gelöscht');
                }
            }

            setIsEditing(false);
            setStatus({ type: 'success', text: 'Profil erfolgreich gespeichert. Bitte melde dich neu an, damit die Änderungen wirksam werden.' });
        } catch (error) {
            console.error('❌ Fehler beim Speichern:', error);
            console.error('Error response:', error.response);
            setStatus({ type: 'error', text: error.response?.data?.detail || error.message || 'Fehler beim Speichern des Profils.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <Container><Card>Lädt...</Card></Container>;
    }

    if (!profile.kundenid) {
        return (
            <Container>
                <Card>
                    <Header>Profil nicht gefunden</Header>
                    <p>Bitte melde dich an, um dein Profil zu sehen.</p>
                </Card>
            </Container>
        );
    }

    return (
        <Container>
            <Card>
                <Header>
                    Mein Profil
                    {kritikerProfile && <KritikerBadge>Kritiker</KritikerBadge>}
                </Header>

                {status && (
                    <StatusBanner variant={status.type}>
                        {status.text}
                    </StatusBanner>
                )}

                <FormGroup>
                    <Label>Vorname</Label>
                    <Input
                        name="vorname"
                        value={profile.vorname || ''}
                        onChange={handleChange}
                        disabled={!isEditing}
                    />
                </FormGroup>

                <FormGroup>
                    <Label>Nachname</Label>
                    <Input
                        name="nachname"
                        value={profile.nachname || ''}
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

                <SectionTitle>Kritiker-Status</SectionTitle>
                <ToggleContainer $active={wantKritiker}>
                    <Toggle
                        checked={wantKritiker}
                        onChange={handleKritikerToggle}
                        disabled={!isEditing}
                    />
                    <ToggleLabel onClick={handleKritikerToggle}>
                        👨‍🍳 Ich bin ein Kritiker
                    </ToggleLabel>
                </ToggleContainer>

                {wantKritiker && (
                    <>
                        <FormGroup>
                            <Label>Kritikername</Label>
                            <Input
                                name="kritikername"
                                value={kritikerProfile?.kritikername || ''}
                                onChange={handleKritikerChange}
                                disabled={!isEditing}
                                placeholder={profile.namenskuerzel || 'Ihr Kritikername'}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Beschreibung</Label>
                            <TextArea
                                name="beschreibung"
                                value={kritikerProfile?.beschreibung || ''}
                                onChange={handleKritikerChange}
                                disabled={!isEditing}
                                placeholder="Erzählen Sie über Ihre Expertise..."
                            />
                        </FormGroup>
                    </>
                )}

                <ButtonGroup>
                    {!isEditing ? (
                        <Button variant="primary" onClick={() => setIsEditing(true)}>
                            Bearbeiten
                        </Button>
                    ) : (
                        <>
                            <Button variant="primary" onClick={handleSave} disabled={saving}>
                                {saving ? 'Speichert...' : 'Speichern'}
                            </Button>
                            <Button onClick={() => {
                                setIsEditing(false);
                                loadProfile(user.user_id);
                            }} disabled={saving}>
                                Abbrechen
                            </Button>
                        </>
                    )}
                </ButtonGroup>
            </Card>
        </Container>
    );
};

export default KundeProfil;