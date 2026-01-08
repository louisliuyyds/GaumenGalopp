import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import colors from '../theme/colors';

const LoginContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: ${colors.gradients.background};
`;

const LoginCard = styled.div`
    background: ${colors.background.card};
    border-radius: 20px;
    padding: 50px;
    box-shadow: ${colors.shadows.large};
    width: 100%;
    max-width: 450px;
    border: 1px solid ${colors.border.light};
`;

const Logo = styled.h1`
    color: ${colors.primary.main};
    font-size: 2.5em;
    text-align: center;
    margin-bottom: 10px;
    font-weight: 800;
    background: ${colors.gradients.primary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
`;

const Subtitle = styled.p`
    color: ${colors.text.light};
    text-align: center;
    margin-bottom: 40px;
    font-size: 1em;
`;

const ToggleContainer = styled.div`
    display: flex;
    gap: 10px;
    margin-bottom: 30px;
    background: ${colors.background.main};
    padding: 5px;
    border-radius: 12px;
`;

const ToggleButton = styled.button`
    flex: 1;
    padding: 12px;
    border: none;
    border-radius: 8px;
    font-size: 1em;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    background: ${props => props.$active ? colors.gradients.primary : 'transparent'};
    color: ${props => props.$active ? colors.text.white : colors.text.light};
    box-shadow: ${props => props.$active ? colors.shadows.primarySmall : 'none'};

    &:hover {
        background: ${props => props.$active ? colors.gradients.primary : colors.background.card};
    }
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const Label = styled.label`
    color: ${colors.text.primary};
    font-size: 0.9em;
    font-weight: 600;
`;

const Input = styled.input`
    padding: 14px;
    border: 2px solid ${colors.border.light};
    border-radius: 8px;
    font-size: 1em;
    transition: all 0.3s ease;
    background: ${colors.background.main};
    color: ${colors.text.primary};

    &:focus {
        outline: none;
        border-color: ${colors.primary.main};
        box-shadow: 0 0 0 3px ${colors.primary.main}20;
    }

    &::placeholder {
        color: ${colors.text.light};
    }
`;

const LoginButton = styled.button`
    background: ${colors.gradients.primary};
    color: ${colors.text.white};
    border: none;
    padding: 16px;
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

const RegisterLink = styled.div`
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

function Login() {
    const [userType, setUserType] = useState('kunde'); // 'kunde' oder 'restaurant'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(userType, email, password);

            // Nach erfolgreichem Login weiterleiten
            if (userType === 'restaurant') {
                navigate('/restaurants');
            } else {
                navigate('/kunde/restaurants');
            }
        } catch (err) {
            console.error('Login error:', err);
            if (err.response?.status === 401) {
                setError('Ungültige E-Mail oder Passwort');
            } else if (err.response?.data?.detail) {
                setError(err.response.data.detail);
            } else {
                setError('Login fehlgeschlagen. Bitte versuche es erneut.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <LoginContainer>
            <LoginCard>
                <Logo>GaumenGalopp</Logo>
                <Subtitle>Willkommen zurück!</Subtitle>

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

                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label>E-Mail</Label>
                        <Input
                            type="email"
                            placeholder="deine@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label>Passwort</Label>
                        <Input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </FormGroup>

                    <LoginButton type="submit" disabled={loading}>
                        {loading ? 'Wird eingeloggt...' : 'Einloggen'}
                    </LoginButton>
                </Form>

                <RegisterLink>
                    Noch kein Account? <a onClick={() => navigate('/register')}>Jetzt registrieren</a>
                </RegisterLink>
            </LoginCard>
        </LoginContainer>
    );
}

export default Login;