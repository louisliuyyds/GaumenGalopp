import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import colors from '../theme/colors';

// Styled Components
const RegisterContainer = styled.div`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, ${colors.primary.light} 0%, ${colors.primary.main} 100%);
    padding: 20px;
`;

const RegisterCard = styled.div`
    background: white;
    border-radius: 16px;
    box-shadow: ${colors.shadows.large};
    padding: 40px;
    width: 100%;
    max-width: 500px;
`;

const Logo = styled.h1`
    text-align: center;
    color: ${colors.primary.main};
    font-size: 2em;
    margin-bottom: 10px;
    font-weight: 700;
`;

const Subtitle = styled.p`
    text-align: center;
    color: ${colors.text.light};
    margin-bottom: 30px;
`;

const ToggleContainer = styled.div`
    display: flex;
    gap: 10px;
    margin-bottom: 30px;
    background: ${colors.background.light};
    padding: 4px;
    border-radius: 8px;
`;

const ToggleButton = styled.button`
    flex: 1;
    padding: 12px;
    border: none;
    border-radius: 6px;
    font-size: 1em;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    background: ${props => props.$active ? colors.primary.main : 'transparent'};
    color: ${props => props.$active ? 'white' : colors.text.light};

    &:hover {
        background: ${props => props.$active ? colors.primary.main : colors.background.main};
    }
`;

const HelpText = styled.div`
    background: ${colors.background.light};
    padding: 12px;
    border-radius: 8px;
    font-size: 0.9em;
    color: ${colors.text.light};
    margin-bottom: 20px;
    text-align: center;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const FormRow = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
`;

const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
`;

const Label = styled.label`
    color: ${colors.text.main};
    font-weight: 500;
    font-size: 0.9em;
`;

const Input = styled.input`
    padding: 12px;
    border: 2px solid ${colors.background.main};
    border-radius: 8px;
    font-size: 1em;
    transition: border-color 0.3s ease;

    &:focus {
        outline: none;
        border-color: ${colors.primary.main};
    }

    &::placeholder {
        color: ${colors.text.light};
    }
`;

const RegisterButton = styled.button`
    background: ${colors.primary.main};
    color: white;
    padding: 14px;
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

    &:active {
        transform: translateY(0);
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

    // Adresse State (für beide User-Typen)
    const [adresse, setAdresse] = useState({
        strasse: '',
        hausnummer: '',
        plz: '',
        stadt: '',
        land: 'Deutschland'
    });

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

                await registerRestaurant({
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