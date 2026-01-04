import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import colors from '../theme/colors';
import { restaurantService } from '../services';
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
    padding-bottom: 20px;
    border-bottom: 2px solid ${colors.border.light};
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 30px;
`;

const InfoCard = styled.div`
    background: ${colors.background.card};
    border-radius: 12px;
    padding: 35px;
    box-shadow: ${colors.shadows.medium};
    border: 1px solid ${colors.border.light};
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

const InputGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 20px;

    &:last-child {
        margin-bottom: 0;
    }
`;

const Label = styled.label`
    font-weight: 600;
    color: ${colors.text.secondary};
    font-size: 0.95em;
    display: flex;
    align-items: center;
    gap: 8px;
`;

const Input = styled.input`
    padding: 12px 16px;
    border: 2px solid ${colors.border.light};
    border-radius: 8px;
    font-size: 1em;
    color: ${colors.text.primary};
    background: ${colors.background.main};
    transition: all 0.2s ease;

    &:focus {
        outline: none;
        border-color: ${colors.primary.main};
        background: white;
    }

    &:disabled {
        background: #f5f5f5;
        cursor: not-allowed;
        color: ${colors.text.light};
    }
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

const CancelButton = styled.button`
    background: ${colors.background.card};
    color: ${colors.text.primary};
    border: 2px solid ${colors.border.medium};
    padding: 14px 32px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1.1em;
    font-weight: 600;
    transition: all 0.3s ease;

    &:hover {
        background: ${colors.border.light};
        border-color: ${colors.text.secondary};
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

// ==================== HAUPTKOMPONENTE ====================

function EditRestaurantInfos() {
    const { id } = useParams();
    const navigate = useNavigate();

    // States
    const [formData, setFormData] = useState({
        name: '',
        klassifizierung: '',
        telefon: '',
        email: '',
        kuechenchef: '',
        adresseid: ''
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Daten beim Laden holen (wie in RestaurantDetail.js)
    useEffect(() => {
        const fetchRestaurantData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const data = await restaurantService.getById(id);
                console.log('Restaurant geladen:', data);

                // Formular mit DB-Daten befüllen
                setFormData({
                    name: data.name || '',
                    klassifizierung: data.klassifizierung || '',
                    telefon: data.telefon || '',
                    email: data.email || '',
                    kuechenchef: data.kuechenchef || '',
                    adresseid: data.adresseid || ''
                });

            } catch (err) {
                console.error('❌ Fehler beim Laden:', err);
                setError('Restaurant konnte nicht geladen werden. Bitte versuche es später erneut.');
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurantData();
    }, [id]);

    // Input-Änderungen tracken
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Formular absenden
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            setSaving(true);
            setError(null);
            setSuccessMessage(null);

            // Restaurant updaten (wie in Restaurant.js mit delete)
            await restaurantService.update(id, formData);
            
            console.log('✅ Restaurant erfolgreich aktualisiert:', formData);
            setSuccessMessage('Restaurant erfolgreich gespeichert!');

            // Nach 1.5 Sekunden zurück zur Detail-Seite
            setTimeout(() => {
                navigate(`/restaurants/${id}`);
            }, 1500);

        } catch (err) {
            console.error('❌ Fehler beim Speichern:', err);
            setError('Fehler beim Speichern. Bitte überprüfe deine Eingaben und versuche es erneut.');
        } finally {
            setSaving(false);
        }
    };

    // Abbrechen
    const handleCancel = () => {
        navigate(`/restaurants/${id}`);
    };

    // Loading State
    if (loading) {
        return (
            <Container>
                <LoadingState>
                    <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🍳</div>
                    Lade Restaurant-Daten...
                </LoadingState>
            </Container>
        );
    }

    // Hauptansicht
    return (
        <Container>
            <BackButton onClick={() => navigate(`/restaurants/${id}`)}>
                ← Zurück zum Restaurant
            </BackButton>

            <PageTitle>✏️ Restaurant bearbeiten</PageTitle>
            <Subtitle>Hier kannst du die Informationen des Restaurants anpassen</Subtitle>

            <EditNavigationTabs restaurantId={id} />

            {error && <ErrorMessage>{error}</ErrorMessage>}
            {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}

            <Form onSubmit={handleSubmit}>
                {/* CARD 1: Basis-Informationen */}
                <InfoCard>
                    <CardTitle>🍽️ Basis-Informationen</CardTitle>

                    <InputGroup>
                        <Label>🏷️ Restaurant-Name</Label>
                        <Input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="z.B. Bella Italia"
                            required
                        />
                    </InputGroup>

                    <InputGroup>
                        <Label>🍕 Klassifizierung / Cuisine</Label>
                        <Input
                            type="text"
                            name="klassifizierung"
                            value={formData.klassifizierung}
                            onChange={handleInputChange}
                            placeholder="z.B. Italienisch"
                        />
                    </InputGroup>

                    <InputGroup>
                        <Label>👨‍🍳 Küchenchef</Label>
                        <Input
                            type="text"
                            name="kuechenchef"
                            value={formData.kuechenchef}
                            onChange={handleInputChange}
                            placeholder="z.B. Mario Rossi"
                        />
                    </InputGroup>
                </InfoCard>

                {/* CARD 2: Kontaktdaten */}
                <InfoCard>
                    <CardTitle>📞 Kontaktdaten</CardTitle>

                    <InputGroup>
                        <Label>📞 Telefon</Label>
                        <Input
                            type="tel"
                            name="telefon"
                            value={formData.telefon}
                            onChange={handleInputChange}
                            placeholder="z.B. +49 (0) 123 456789"
                        />
                    </InputGroup>

                    <InputGroup>
                        <Label>📧 E-Mail</Label>
                        <Input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="z.B. info@restaurant.de"
                        />
                    </InputGroup>
                </InfoCard>

                {/* CARD 3: Adresse (nur Anzeige, da ID) */}
                <InfoCard>
                    <CardTitle>📍 Adresse</CardTitle>

                    <InputGroup>
                        <Label>🏠 Adress-ID</Label>
                        <Input
                            type="text"
                            name="adresseid"
                            value={formData.adresseid}
                            onChange={handleInputChange}
                            placeholder="Adress-ID aus der Datenbank"
                            disabled
                        />
                        <small style={{ 
                            color: colors.text.light, 
                            fontSize: '0.85em',
                            marginTop: '-4px'
                        }}>
                            ℹ️ Die Adress-ID kann aktuell nicht direkt bearbeitet werden
                        </small>
                    </InputGroup>
                </InfoCard>

                {/* Buttons */}
                <ButtonContainer>
                    <CancelButton type="button" onClick={handleCancel}>
                        Abbrechen
                    </CancelButton>
                    <SaveButton type="submit" disabled={saving}>
                        {saving ? '💾 Speichert...' : '💾 Änderungen speichern'}
                    </SaveButton>
                </ButtonContainer>
            </Form>
        </Container>
    );
}

export default EditRestaurantInfos;
