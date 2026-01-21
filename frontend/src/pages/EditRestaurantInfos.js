import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import colors from '../theme/colors';
import { restaurantService } from '../services';
import EditNavigationTabs from '../components/EditNavigationTabs';
import kochstilService from '../services/kochstilService';
import kochstilRestaurantService from '../services/kochstilRestaurantService';

// ==================== STYLED COMPONENTS ====================

const Container = styled.div`
    max-width: 900px;
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
    }
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
    margin-top: 15px;
    color: ${colors.text.secondary};
    font-size: 0.9em;
    line-height: 1.6;
`;

// ==================== HAUPTKOMPONENTE ====================

function EditRestaurantInfos() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Ein State für ALLES (Restaurant + Adresse)
    const [formData, setFormData] = useState({
        // Restaurant-Felder
        name: '',
        klassifizierung: '',
        telefon: '',
        email: '',
        kuechenchef: '',

        // Adress-Felder (Backend macht Copy-on-Write!)
        straße: '',
        hausnummer: '',
        postleitzahl: '',
        ort: '',
        land: ''
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [availableKochstile, setAvailableKochstile] = useState([]);
    const [selectedKochstile, setSelectedKochstile] = useState([]);
    const [originalKochstile, setOriginalKochstile] = useState([]); // Für Diff beim Speichern
    const [newKochstil, setNewKochstil] = useState('');

    // Daten beim Laden holen
    useEffect(() => {
        const fetchRestaurantData = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await restaurantService.getById(id);
                console.log('Restaurant geladen:', data);

                // Alle Felder in einen State
                setFormData({
                    // Restaurant
                    name: data.name || '',
                    klassifizierung: data.klassifizierung || '',
                    telefon: data.telefon || '',
                    email: data.email || '',
                    kuechenchef: data.kuechenchef || '',

                    // Adresse (aus nested Object)
                    straße: data.adresse?.straße || '',
                    hausnummer: data.adresse?.hausnummer || '',
                    postleitzahl: data.adresse?.postleitzahl || '',
                    ort: data.adresse?.ort || '',
                    land: data.adresse?.land || ''
                });

                const [kochstileResponse, assignedResponse] = await Promise.all([
                    kochstilService.getAll(),
                    kochstilRestaurantService.getKochstileByRestaurant(id)
                ]);

                setAvailableKochstile(kochstileResponse);
                const assignedIds = assignedResponse.map(k => k.stilid);
                setSelectedKochstile(assignedIds);
                setOriginalKochstile(assignedIds);

            } catch (err) {
                console.error('Fehler beim Laden:', err);
                setError('Restaurant konnte nicht geladen werden');
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurantData();
    }, [id]);

    // Ein Handler für ALLE Felder
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Toggle bestehende Kategorie
    const toggleKochstil = (stilId) => {
        setSelectedKochstile(prev =>
            prev.includes(stilId)
                ? prev.filter(id => id !== stilId)
                : [...prev, stilId]
        );
    };

// Neue Kategorie hinzufügen
    const handleAddNewKochstil = async () => {
        if (!newKochstil.trim()) return;

        const existing = availableKochstile.find(
            k => k.kochstil.toLowerCase() === newKochstil.toLowerCase()
        );

        if (existing) {
            toggleKochstil(existing.stilid);
            setNewKochstil('');
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
        } catch (error) {
            console.error('Fehler beim Erstellen:', error);
        }
    };

    // Formular absenden - Backend macht Copy-on-Write automatisch
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError(null);
            setSuccessMessage(null);

            // 1. Restaurant-Daten aktualisieren
            await restaurantService.update(id, formData);
            console.log('✅ Restaurant erfolgreich aktualisiert');

            // 2. Kochstile aktualisieren
            const toAdd = selectedKochstile.filter(stilId => !originalKochstile.includes(stilId));
            const toRemove = originalKochstile.filter(stilId => !selectedKochstile.includes(stilId));

            // Neue Kochstile hinzufügen
            for (const stilId of toAdd) {
                await kochstilRestaurantService.assignKochstilToRestaurant({
                    restaurantid: parseInt(id),
                    stilid: stilId
                });
            }

            // Entfernte Kochstile löschen
            for (const stilId of toRemove) {
                await kochstilRestaurantService.removeKochstilFromRestaurant(parseInt(id), stilId);
            }

            console.log('✅ Kochstile erfolgreich aktualisiert');

            // 3. Original-State updaten (für weitere Edits)
            setOriginalKochstile(selectedKochstile);

            // 4. Success-Message anzeigen
            setSuccessMessage('Restaurant erfolgreich gespeichert!');

            // 5. Nach 1.5 Sekunden zurück zur Detail-Seite
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
                    <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🍽️</div>
                    Lade Restaurant-Daten...
                </LoadingState>
            </Container>
        );
    }

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
                        <Label>📝 Name</Label>
                        <Input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="z.B. Restaurant Bella Vista"
                            required
                        />
                    </InputGroup>

                    <InputGroup>
                        <Label>🏷️ Klassifizierung</Label>
                        <Input
                            type="text"
                            name="klassifizierung"
                            value={formData.klassifizierung}
                            onChange={handleInputChange}
                            placeholder="z.B. Italienisch, Sterne-Restaurant"
                        />
                    </InputGroup>

                    <InputGroup>
                        <Label>👨‍🍳 Küchenchef</Label>
                        <Input
                            type="text"
                            name="kuechenchef"
                            value={formData.kuechenchef}
                            onChange={handleInputChange}
                            placeholder="z.B. Giovanni Rossi"
                        />
                    </InputGroup>
                    <InputGroup>
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
                            placeholder="z.B. +49 30 12345678"
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

                {/* CARD 3: Adresse */}
                <InfoCard>
                    <CardTitle>📍 Adresse</CardTitle>

                    <InputGroup>
                        <Label>🏠 Straße</Label>
                        <Input
                            type="text"
                            name="straße"
                            value={formData.straße}
                            onChange={handleInputChange}
                            placeholder="z.B. Hauptstraße"
                            required
                        />
                    </InputGroup>

                    <InputGroup>
                        <Label>🔢 Hausnummer</Label>
                        <Input
                            type="text"
                            name="hausnummer"
                            value={formData.hausnummer}
                            onChange={handleInputChange}
                            placeholder="z.B. 123"
                            required
                        />
                    </InputGroup>

                    <InputGroup>
                        <Label>📮 Postleitzahl</Label>
                        <Input
                            type="text"
                            name="postleitzahl"
                            value={formData.postleitzahl}
                            onChange={handleInputChange}
                            placeholder="z.B. 10115"
                            required
                        />
                    </InputGroup>

                    <InputGroup>
                        <Label>🏙️ Ort</Label>
                        <Input
                            type="text"
                            name="ort"
                            value={formData.ort}
                            onChange={handleInputChange}
                            placeholder="z.B. Berlin"
                            required
                        />
                    </InputGroup>

                    <InputGroup>
                        <Label>🌍 Land</Label>
                        <Input
                            type="text"
                            name="land"
                            value={formData.land}
                            onChange={handleInputChange}
                            placeholder="z.B. Deutschland"
                            required
                        />
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
