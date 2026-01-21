import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import kochstilService from '../services/kochstilService';
import kochstilRestaurantService from '../services/kochstilRestaurantService';
import colors from '../theme/colors';

// Alle Styled Components bleiben gleich...
const RegisterContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: ${colors.gradients.secondary};
    padding: 20px;
`;

const RegisterCard = styled.div`
    background: white;
    border-radius: 16px;
    padding: 40px;
    box-shadow: ${colors.shadows.large};
    width: 100%;
    max-width: 600px;
`;

const Logo = styled.h1`
    font-size: 2.5em;
    background: ${colors.gradients.primary};
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    text-align: center;
    margin-bottom: 10px;
`;

const Subtitle = styled.p`
    text-align: center;
    color: ${colors.text.light};
    margin-bottom: 30px;
    font-size: 1.1em;
`;

const ToggleContainer = styled.div`
    display: flex;
    gap: 10px;
    margin-bottom: 30px;
    background: ${colors.background.main};
    border-radius: 12px;
    padding: 6px;
`;

const ToggleButton = styled.button`
    flex: 1;
    padding: 12px;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    background: ${props => props.$active ? colors.primary.main : 'transparent'};
    color: ${props => props.$active ? 'white' : colors.text.primary};
    box-shadow: ${props => props.$active ? colors.shadows.primarySmall : 'none'};

    &:hover {
        background: ${props => props.$active ? colors.primary.main : colors.background.card};
    }
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const FormRow = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;

    @media (max-width: 600px) {
        grid-template-columns: 1fr;
    }
`;

const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const Label = styled.label`
    font-weight: 600;
    color: ${colors.text.primary};
    font-size: 0.9em;
`;

const Input = styled.input`
    padding: 12px;
    border: 2px solid ${colors.background.main};
    border-radius: 8px;
    font-size: 1em;
    transition: all 0.3s ease;

    &:focus {
        outline: none;
        border-color: ${colors.primary.main};
        box-shadow: ${colors.shadows.primarySmall};
    }
`;

const HelpText = styled.p`
    color: ${colors.text.light};
    font-size: 0.9em;
    margin: 10px 0;
    font-weight: 600;
`;

const RegisterButton = styled.button`
    padding: 14px;
    background: ${colors.gradients.primary};
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1.1em;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: ${colors.shadows.primaryMedium};
    margin-top: 10px;

    &:hover {
        transform: translateY(-2px);
        box-shadow: ${colors.shadows.primaryLarge};
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
    }
`;

const ErrorMessage = styled.div`
    background: #fee;
    color: #c33;
    padding: 12px;
    border-radius: 8px;
    font-size: 0.9em;
    margin-bottom: 10px;
    border: 1px solid #fcc;
`;

const SuccessMessage = styled.div`
    background: #efe;
    color: #3c3;
    padding: 12px;
    border-radius: 8px;
    font-size: 0.9em;
    margin-bottom: 10px;
    border: 1px solid #cfc;
`;

const LoginLink = styled.div`
    text-align: center;
    margin-top: 20px;
    color: ${colors.text.light};
    font-size: 0.9em;

    a {
        color: ${colors.primary.main};
        text-decoration: none;
        font-weight: 600;
        cursor: pointer;

        &:hover {
            text-decoration: underline;
        }
    }
`;

function Register() {
    const [userType, setUserType] = useState('kunde'); // 'kunde' oder 'restaurant'
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const { registerKunde, registerRestaurant } = useAuth();
    const navigate = useNavigate();

    // Kunde Formular State
    const [kundeData, setKundeData] = useState({
        vorname: '',
        nachname: '',
        email: '',
        password: '',
        passwordConfirm: '',
        telefonnummer: ''
    });

    // Restaurant Formular State
    const [restaurantData, setRestaurantData] = useState({
        name: '',
        email: '',
        password: '',
        passwordConfirm: '',
        telefon: '',
        kuechenchef: '',
        klassifizierung: ''
    });

    // Kochstile State (nur für Restaurant)
    const [availableKochstile, setAvailableKochstile] = useState([]);
    const [selectedKochstile, setSelectedKochstile] = useState([]);
    const [newKochstil, setNewKochstil] = useState('');

    // Adresse State (für beide User-Typen)
    const [adresse, setAdresse] = useState({
        strasse: '',
        hausnummer: '',
        plz: '',
        stadt: '',
        land: 'Deutschland'
    });

    // Kochstile laden beim Wechsel zu Restaurant-Typ
    useEffect(() => {
        if (userType === 'restaurant') {
            loadKochstile();
        }
    }, [userType]);

    const loadKochstile = async () => {
        try {
            const response = await kochstilService.getAll();
            setAvailableKochstile(response);
        } catch (error) {
            console.error('Fehler beim Laden der Kochstile:', error);
        }
    };

    const handleKundeChange = (e) => {
        setKundeData({
            ...kundeData,
            [e.target.name]: e.target.value
        });
    };

    const handleRestaurantChange = (e) => {
        setRestaurantData({
            ...restaurantData,
            [e.target.name]: e.target.value
        });
    };

    const handleAdresseChange = (e) => {
        setAdresse({
            ...adresse,
            [e.target.name]: e.target.value
        });
    };

    // Toggle Kochstil
    const toggleKochstil = (stilId) => {
        setSelectedKochstile(prev =>
            prev.includes(stilId)
                ? prev.filter(id => id !== stilId)
                : [...prev, stilId]
        );
    };

    // Neuen Kochstil hinzufügen
    const handleAddNewKochstil = async () => {
        if (!newKochstil.trim()) return;

        const existing = availableKochstile.find(
            k => k.kochstil.toLowerCase() === newKochstil.toLowerCase()
        );

        if (existing) {
            toggleKochstil(existing.stilid);
            setNewKochstil('');
            alert('Diese Kategorie existiert bereits und wurde ausgewählt!');
            return;
        }

        try {
            const response = await kochstilService.create({
                kochstil: newKochstil.trim(),
                beschreibung: ''
            });

            const newStil = response;
            setAvailableKochstile(prev => [...prev, newStil]);
            setSelectedKochstile(prev => [...prev, newStil.stilid]);
            setNewKochstil('');
            alert('Neue Kategorie erfolgreich erstellt!');
        } catch (error) {
            console.error('Fehler beim Erstellen:', error);
            alert('Fehler beim Erstellen der Kategorie');
        }
    };

    const validateKundeForm = () => {
        if (!kundeData.vorname || !kundeData.nachname) {
            setError('Bitte Vor- und Nachname eingeben');
            return false;
        }
        if (!kundeData.email || !kundeData.email.includes('@')) {
            setError('Bitte gültige E-Mail eingeben');
            return false;
        }
        if (kundeData.password.length < 8) {
            setError('Passwort muss mindestens 8 Zeichen lang sein');
            return false;
        }
        if (kundeData.password !== kundeData.passwordConfirm) {
            setError('Passwörter stimmen nicht überein');
            return false;
        }
        if (!adresse.strasse || !adresse.hausnummer || !adresse.plz || !adresse.stadt) {
            setError('Bitte vollständige Adresse eingeben');
            return false;
        }
        return true;
    };

    const validateRestaurantForm = () => {
        if (!restaurantData.name) {
            setError('Bitte Restaurant-Name eingeben');
            return false;
        }
        if (!restaurantData.email || !restaurantData.email.includes('@')) {
            setError('Bitte gültige E-Mail eingeben');
            return false;
        }
        if (restaurantData.password.length < 8) {
            setError('Passwort muss mindestens 8 Zeichen lang sein');
            return false;
        }
        if (restaurantData.password !== restaurantData.passwordConfirm) {
            setError('Passwörter stimmen nicht überein');
            return false;
        }
        if (!adresse.strasse || !adresse.hausnummer || !adresse.plz || !adresse.stadt) {
            setError('Bitte vollständige Adresse eingeben');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            if (userType === 'kunde') {
                // Validierung
                if (!validateKundeForm()) {
                    setLoading(false);
                    return;
                }

                // Registrierung mit Adresse
                await registerKunde({
                    vorname: kundeData.vorname,
                    nachname: kundeData.nachname,
                    email: kundeData.email,
                    password: kundeData.password,
                    telefonnummer: kundeData.telefonnummer || undefined,
                    // Adresse
                    strasse: adresse.strasse,
                    hausnummer: adresse.hausnummer,
                    plz: adresse.plz,
                    stadt: adresse.stadt,
                    land: adresse.land
                });

                setSuccess('Registrierung erfolgreich! Du wirst weitergeleitet...');

                // Weiterleitung nach 1 Sekunde
                setTimeout(() => {
                    navigate('/kunde/restaurants');
                }, 1000);

            } else {
                // Restaurant Registrierung
                if (!validateRestaurantForm()) {
                    setLoading(false);
                    return;
                }

                const result = await registerRestaurant({
                    name: restaurantData.name,
                    email: restaurantData.email,
                    password: restaurantData.password,
                    telefon: restaurantData.telefon || undefined,
                    kuechenchef: restaurantData.kuechenchef || undefined,
                    klassifizierung: restaurantData.klassifizierung || undefined,
                    // Adresse
                    strasse: adresse.strasse,
                    hausnummer: adresse.hausnummer,
                    plz: adresse.plz,
                    stadt: adresse.stadt,
                    land: adresse.land
                });

                // Kochstile zuweisen
                const restaurantId = result.user.id;
                for (const stilId of selectedKochstile) {
                    await kochstilRestaurantService.assignKochstilToRestaurant({
                        restaurantid: restaurantId,
                        stilid: stilId
                    });
                }

                setSuccess('Registrierung erfolgreich! Du wirst weitergeleitet...');

                setTimeout(() => {
                    navigate('/restaurants');
                }, 1000);
            }
        } catch (err) {
            console.error('Registration error:', err);
            if (err.response?.status === 400) {
                setError('E-Mail bereits registriert');
            } else if (err.response?.data?.detail) {
                setError(err.response.data.detail);
            } else {
                setError('Registrierung fehlgeschlagen. Bitte versuche es erneut.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <RegisterContainer>
            <RegisterCard>
                <Logo>GaumenGalopp</Logo>
                <Subtitle>Erstelle deinen Account</Subtitle>

                <ToggleContainer>
                    <ToggleButton
                        type="button"
                        $active={userType === 'kunde'}
                        onClick={() => setUserType('kunde')}
                    >
                        👤 Kunde
                    </ToggleButton>
                    <ToggleButton
                        type="button"
                        $active={userType === 'restaurant'}
                        onClick={() => setUserType('restaurant')}
                    >
                        🍽️ Restaurant
                    </ToggleButton>
                </ToggleContainer>

                {error && <ErrorMessage>{error}</ErrorMessage>}
                {success && <SuccessMessage>{success}</SuccessMessage>}

                <Form onSubmit={handleSubmit}>
                    {userType === 'kunde' ? (
                        // KUNDE FORMULAR
                        <>
                            <FormRow>
                                <FormGroup>
                                    <Label>Vorname *</Label>
                                    <Input
                                        type="text"
                                        name="vorname"
                                        placeholder="Max"
                                        value={kundeData.vorname}
                                        onChange={handleKundeChange}
                                        required
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label>Nachname *</Label>
                                    <Input
                                        type="text"
                                        name="nachname"
                                        placeholder="Mustermann"
                                        value={kundeData.nachname}
                                        onChange={handleKundeChange}
                                        required
                                    />
                                </FormGroup>
                            </FormRow>

                            <FormGroup>
                                <Label>E-Mail *</Label>
                                <Input
                                    type="email"
                                    name="email"
                                    placeholder="max@example.com"
                                    value={kundeData.email}
                                    onChange={handleKundeChange}
                                    required
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label>Telefonnummer (optional)</Label>
                                <Input
                                    type="tel"
                                    name="telefonnummer"
                                    placeholder="0123456789"
                                    value={kundeData.telefonnummer}
                                    onChange={handleKundeChange}
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label>Passwort * (mind. 8 Zeichen)</Label>
                                <Input
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    value={kundeData.password}
                                    onChange={handleKundeChange}
                                    required
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label>Passwort bestätigen *</Label>
                                <Input
                                    type="password"
                                    name="passwordConfirm"
                                    placeholder="••••••••"
                                    value={kundeData.passwordConfirm}
                                    onChange={handleKundeChange}
                                    required
                                />
                            </FormGroup>
                        </>
                    ) : (
                        // RESTAURANT FORMULAR
                        <>
                            <FormGroup>
                                <Label>Restaurant Name *</Label>
                                <Input
                                    type="text"
                                    name="name"
                                    placeholder="Mein Restaurant"
                                    value={restaurantData.name}
                                    onChange={handleRestaurantChange}
                                    required
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label>E-Mail *</Label>
                                <Input
                                    type="email"
                                    name="email"
                                    placeholder="info@restaurant.com"
                                    value={restaurantData.email}
                                    onChange={handleRestaurantChange}
                                    required
                                />
                            </FormGroup>

                            <FormRow>
                                <FormGroup>
                                    <Label>Telefon (optional)</Label>
                                    <Input
                                        type="tel"
                                        name="telefon"
                                        placeholder="0123456789"
                                        value={restaurantData.telefon}
                                        onChange={handleRestaurantChange}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label>Küchenchef (optional)</Label>
                                    <Input
                                        type="text"
                                        name="kuechenchef"
                                        placeholder="Hans Müller"
                                        value={restaurantData.kuechenchef}
                                        onChange={handleRestaurantChange}
                                    />
                                </FormGroup>
                            </FormRow>

                            <FormGroup>
                                <Label>Klassifizierung (optional)</Label>
                                <Input
                                    type="text"
                                    name="klassifizierung"
                                    placeholder="z.B. Gehobene Küche"
                                    value={restaurantData.klassifizierung}
                                    onChange={handleRestaurantChange}
                                />
                            </FormGroup>

                            {/* KOCHSTILE AUSWAHL */}
                            <FormGroup>
                                <Label>🍽️ Kategorien</Label>

                                {/* Bestehende Kategorien */}
                                <div style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '10px',
                                    marginBottom: '10px',
                                    padding: '10px',
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    backgroundColor: '#f9f9f9'
                                }}>
                                    {availableKochstile?.length > 0 ? (
                                        availableKochstile.map(k => (
                                            <button
                                                key={k.stilid}
                                                type="button"
                                                onClick={() => toggleKochstil(k.stilid)}
                                                style={{
                                                    padding: '8px 16px',
                                                    borderRadius: '20px',
                                                    border: '2px solid',
                                                    borderColor: selectedKochstile.includes(k.stilid) ? '#3498db' : '#ddd',
                                                    backgroundColor: selectedKochstile.includes(k.stilid) ? '#3498db' : 'white',
                                                    color: selectedKochstile.includes(k.stilid) ? 'white' : '#333',
                                                    cursor: 'pointer',
                                                    fontSize: '14px',
                                                    fontWeight: selectedKochstile.includes(k.stilid) ? 'bold' : 'normal',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                {k.kochstil}
                                            </button>
                                        ))
                                    ) : (
                                        <span style={{ color: '#666' }}>Lade Kategorien...</span>
                                    )}
                                </div>

                                {/* Neue Kategorie hinzufügen */}
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <Input
                                        type="text"
                                        value={newKochstil}
                                        onChange={(e) => setNewKochstil(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddNewKochstil())}
                                        placeholder="Neue Kategorie hinzufügen..."
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddNewKochstil}
                                        style={{
                                            padding: '10px 20px',
                                            backgroundColor: '#2ecc71',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontWeight: 'bold',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        + Hinzufügen
                                    </button>
                                </div>
                            </FormGroup>

                            <FormGroup>
                                <Label>Passwort * (mind. 8 Zeichen)</Label>
                                <Input
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    value={restaurantData.password}
                                    onChange={handleRestaurantChange}
                                    required
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label>Passwort bestätigen *</Label>
                                <Input
                                    type="password"
                                    name="passwordConfirm"
                                    placeholder="••••••••"
                                    value={restaurantData.passwordConfirm}
                                    onChange={handleRestaurantChange}
                                    required
                                />
                            </FormGroup>
                        </>
                    )}

                    {/* ADRESSE - für beide User-Typen */}
                    <HelpText style={{ marginTop: '20px' }}>
                        📍 Deine Adresse
                    </HelpText>

                    <FormGroup>
                        <Label>Straße *</Label>
                        <Input
                            type="text"
                            name="strasse"
                            placeholder="Hauptstraße"
                            value={adresse.strasse}
                            onChange={handleAdresseChange}
                            required
                        />
                    </FormGroup>

                    <FormRow>
                        <FormGroup>
                            <Label>Hausnummer *</Label>
                            <Input
                                type="text"
                                name="hausnummer"
                                placeholder="42"
                                value={adresse.hausnummer}
                                onChange={handleAdresseChange}
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>PLZ *</Label>
                            <Input
                                type="text"
                                name="plz"
                                placeholder="10115"
                                value={adresse.plz}
                                onChange={handleAdresseChange}
                                required
                            />
                        </FormGroup>
                    </FormRow>

                    <FormGroup>
                        <Label>Stadt *</Label>
                        <Input
                            type="text"
                            name="stadt"
                            placeholder="Berlin"
                            value={adresse.stadt}
                            onChange={handleAdresseChange}
                            required
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label>Land</Label>
                        <Input
                            type="text"
                            name="land"
                            placeholder="Deutschland"
                            value={adresse.land}
                            onChange={handleAdresseChange}
                        />
                    </FormGroup>

                    <RegisterButton type="submit" disabled={loading}>
                        {loading ? 'Wird registriert...' : 'Registrieren'}
                    </RegisterButton>
                </Form>

                <LoginLink>
                    Bereits einen Account? <a onClick={() => navigate('/login')}>Jetzt einloggen</a>
                </LoginLink>
            </RegisterCard>
        </RegisterContainer>
    );
}

export default Register;