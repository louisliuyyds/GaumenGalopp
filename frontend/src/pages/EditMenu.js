import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import colors from '../theme/colors';
import { restaurantService, gerichtService, preisService } from '../services';
import EditNavigationTabs from '../components/EditNavigationTabs';

// ==================== STYLED COMPONENTS ====================

const Container = styled.div`
    max-width: 1200px;
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

const HeaderRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
`;

const AddButton = styled.button`
    background: ${colors.status.success};
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1em;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: ${colors.shadows.small};

    &:hover {
        background: ${colors.status.successHover};
        transform: translateY(-2px);
        box-shadow: ${colors.shadows.medium};
    }
`;

const GerichtCard = styled.div`
    background: ${colors.background.card};
    border-radius: 12px;
    padding: 25px;
    margin-bottom: 20px;
    box-shadow: ${colors.shadows.medium};
    border: 2px solid ${colors.border.light};
    transition: all 0.3s ease;

    &:hover {
        border-color: ${colors.primary.light};
        transform: translateY(-2px);
    }
`;

const GerichtHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 15px;
`;

const GerichtInfo = styled.div`
    flex: 1;
`;

const GerichtName = styled.h3`
    color: ${colors.text.primary};
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0 0 8px 0;
`;

const GerichtBeschreibung = styled.p`
    color: ${colors.text.secondary};
    font-size: 0.95em;
    margin: 0;
    line-height: 1.5;
`;

const GerichtMeta = styled.div`
    display: flex;
    gap: 15px;
    margin-top: 12px;
    align-items: center;
`;

const CategoryBadge = styled.span`
    background: ${colors.primary.light};
    color: ${colors.text.primary};
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 0.85em;
    font-weight: 600;
`;

const PriceTag = styled.span`
    background: ${colors.status.success};
    color: white;
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 1.1em;
    font-weight: 700;
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 10px;
`;

const EditButton = styled.button`
    background: ${colors.primary.main};
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9em;
    font-weight: 600;
    transition: all 0.2s ease;

    &:hover {
        background: ${colors.primary.dark};
        transform: scale(1.05);
    }
`;

const DeleteButton = styled.button`
    background: ${colors.status.error};
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9em;
    font-weight: 600;
    transition: all 0.2s ease;

    &:hover {
        background: ${colors.status.errorHover};
        transform: scale(1.05);
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

const EmptyState = styled.div`
    text-align: center;
    padding: 80px 20px;
    background: ${colors.background.card};
    border-radius: 12px;
    color: ${colors.text.light};
    font-size: 1.2em;
`;

// Modal Styles
const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    padding: 20px;
`;

const ModalContent = styled.div`
    background: white;
    border-radius: 16px;
    padding: 40px;
    max-width: 600px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: ${colors.shadows.large};
`;

const ModalTitle = styled.h2`
    color: ${colors.text.primary};
    font-size: 2rem;
    margin-bottom: 30px;
    font-weight: 700;
`;

const InputGroup = styled.div`
    margin-bottom: 20px;
`;

const Label = styled.label`
    display: block;
    font-weight: 600;
    color: ${colors.text.secondary};
    margin-bottom: 8px;
    font-size: 0.95em;
`;

const Input = styled.input`
    width: 100%;
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
`;

const Textarea = styled.textarea`
    width: 100%;
    padding: 12px 16px;
    border: 2px solid ${colors.border.light};
    border-radius: 8px;
    font-size: 1em;
    color: ${colors.text.primary};
    background: ${colors.background.main};
    min-height: 100px;
    resize: vertical;
    font-family: inherit;
    transition: all 0.2s ease;

    &:focus {
        outline: none;
        border-color: ${colors.primary.main};
        background: white;
    }
`;

const ModalButtonGroup = styled.div`
    display: flex;
    gap: 15px;
    justify-content: flex-end;
    margin-top: 30px;
`;

const CancelButton = styled.button`
    background: ${colors.background.card};
    color: ${colors.text.primary};
    border: 2px solid ${colors.border.medium};
    padding: 12px 28px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1em;
    font-weight: 600;
    transition: all 0.3s ease;

    &:hover {
        background: ${colors.border.light};
    }
`;

const SaveButton = styled.button`
    background: ${colors.gradients.primary};
    color: white;
    border: none;
    padding: 12px 28px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1em;
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
    }
`;

// ==================== HAUPTKOMPONENTE ====================

function EditMenu() {
    const { id } = useParams();
    const navigate = useNavigate();

    // States
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [gerichte, setGerichte] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingGericht, setEditingGericht] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        beschreibung: '',
        kategorie: '',
        preis: ''
    });

    // Gerichte laden
    const fetchGerichte = async () => {
        try {
            setLoading(true);
            setError(null);

            const restaurant = await restaurantService.getById(id);
            
            // Alle Gerichte aus allen Menüs sammeln
            const allGerichte = [];
            if (restaurant.menue && Array.isArray(restaurant.menue)) {
                restaurant.menue.forEach(menu => {
                    if (menu.gericht && Array.isArray(menu.gericht)) {
                        menu.gericht.forEach(gericht => {
                            // Aktuellen Preis finden
                            const aktiverPreis = gericht.preis?.find(p => p.istaktiv) || gericht.preis?.[0];
                            allGerichte.push({
                                ...gericht,
                                menuName: menu.name,
                                aktuellerPreis: aktiverPreis
                            });
                        });
                    }
                });
            }

            setGerichte(allGerichte);
            console.log(' Gerichte geladen:', allGerichte.length);

        } catch (err) {
            console.error(' Fehler beim Laden der Gerichte:', err);
            setError('Gerichte konnten nicht geladen werden.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGerichte();
    }, [id]);

    // Gericht bearbeiten öffnen
    const handleEdit = (gericht) => {
        setEditingGericht(gericht);
        setFormData({
            name: gericht.name || '',
            beschreibung: gericht.beschreibung || '',
            kategorie: gericht.kategorie || '',
            preis: gericht.aktuellerPreis?.betrag || ''
        });
        setShowModal(true);
    };

    // Neues Gericht öffnen
    const handleAddNew = () => {
        setEditingGericht(null);
        setFormData({
            name: '',
            beschreibung: '',
            kategorie: '',
            preis: ''
        });
        setShowModal(true);
    };

    // Modal schließen
    const handleCloseModal = () => {
        setShowModal(false);
        setEditingGericht(null);
        setFormData({ name: '', beschreibung: '', kategorie: '', preis: '' });
    };

    // Input ändern
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Speichern
    const handleSave = async () => {
        try {
            setError(null);
            setSuccessMessage(null);

            if (editingGericht) {
                //  GERICHT UPDATEN (existiert schon)
                await gerichtService.update(editingGericht.gerichtid, {
                    name: formData.name,
                    beschreibung: formData.beschreibung,
                    kategorie: formData.kategorie
                });

                // Preis updaten (wenn vorhanden)
                if (editingGericht.aktuellerPreis && formData.preis) {
                    await preisService.update(editingGericht.aktuellerPreis.preisid, {
                        betrag: parseFloat(formData.preis)
                    });
                }

                setSuccessMessage('Gericht erfolgreich aktualisiert!');
            } else {
                //  NEUES GERICHT ERSTELLEN

                // 1. Hole alle Menüs des Restaurants
                const restaurantData = await restaurantService.getById(id);

                if (!restaurantData.menue || restaurantData.menue.length === 0) {
                    setError('Dieses Restaurant hat noch keine Menüs. Bitte erstelle zuerst ein Menü.');
                    return;
                }

                // 2. Nutze das erste Menü (oder lass User wählen - siehe unten)
                const menuid = restaurantData.menue[0].menuid;

                // 3. Erstelle das Gericht
                const neuesGericht = await gerichtService.create({
                    menuid: menuid,
                    name: formData.name,
                    beschreibung: formData.beschreibung,
                    kategorie: formData.kategorie
                });

                console.log(' Gericht erstellt:', neuesGericht);

                // 4. Erstelle einen Preis für das Gericht
                if (formData.preis) {
                    await preisService.create({
                        gerichtid: neuesGericht.gerichtid,
                        betrag: parseFloat(formData.preis),
                        gueltigvon: new Date().toISOString(),
                        gueltigbis: null,
                        preistyp: 'Standard',
                        istaktiv: true
                    });
                    console.log(' Preis erstellt');
                }

                setSuccessMessage('Gericht erfolgreich erstellt!');
            }

            // Modal schließen und Liste neu laden
            setTimeout(() => {
                handleCloseModal();
                fetchGerichte();
            }, 1000);

        } catch (err) {
            console.error(' Fehler beim Speichern:', err);
            setError('Fehler beim Speichern. Bitte versuche es erneut.');
        }
    };

    // Gericht löschen
    const handleDelete = async (gerichtId, name) => {
        if (!window.confirm(`Möchtest du "${name}" wirklich löschen?`)) {
            return;
        }

        try {
            setError(null);
            await gerichtService.delete(gerichtId);
            setSuccessMessage('Gericht erfolgreich gelöscht!');
            await fetchGerichte();
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            console.error(' Fehler beim Löschen:', err);
            setError('Fehler beim Löschen des Gerichts.');
        }
    };

    // Loading
    if (loading) {
        return (
            <Container>
                <LoadingState>
                    <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🍽️</div>
                    Lade Speisekarte...
                </LoadingState>
            </Container>
        );
    }

    return (
        <Container>
            <BackButton onClick={() => navigate(`/restaurants/${id}`)}>
                ← Zurück zum Restaurant
            </BackButton>

            <PageTitle>📋 Speisekarte bearbeiten</PageTitle>
            <Subtitle>Verwalte die Gerichte deines Restaurants</Subtitle>

            <EditNavigationTabs restaurantId={id} />

            {error && <ErrorMessage>{error}</ErrorMessage>}
            {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}

            <HeaderRow>
                <h2 style={{ color: colors.text.primary, margin: 0 }}>
                    {gerichte.length} {gerichte.length === 1 ? 'Gericht' : 'Gerichte'}
                </h2>
                <AddButton onClick={handleAddNew}>
                    + Neues Gericht
                </AddButton>
            </HeaderRow>

            {gerichte.length === 0 ? (
                <EmptyState>
                    <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🍽️</div>
                    <p>Noch keine Gerichte vorhanden</p>
                    <p style={{ fontSize: '0.9em', marginTop: '10px' }}>
                        Füge dein erstes Gericht hinzu!
                    </p>
                </EmptyState>
            ) : (
                gerichte.map(gericht => (
                    <GerichtCard key={gericht.gerichtid}>
                        <GerichtHeader>
                            <GerichtInfo>
                                <GerichtName>{gericht.name}</GerichtName>
                                <GerichtBeschreibung>
                                    {gericht.beschreibung || 'Keine Beschreibung vorhanden'}
                                </GerichtBeschreibung>
                                <GerichtMeta>
                                    <CategoryBadge>{gericht.kategorie || 'Ohne Kategorie'}</CategoryBadge>
                                    <PriceTag>
                                        {gericht.aktuellerPreis 
                                            ? `${parseFloat(gericht.aktuellerPreis.betrag).toFixed(2)} €`
                                            : 'Kein Preis'
                                        }
                                    </PriceTag>
                                </GerichtMeta>
                            </GerichtInfo>
                            <ButtonGroup>
                                <EditButton onClick={() => handleEdit(gericht)}>
                                    ✏️ Bearbeiten
                                </EditButton>
                                <DeleteButton onClick={() => handleDelete(gericht.gerichtid, gericht.name)}>
                                    🗑️ Löschen
                                </DeleteButton>
                            </ButtonGroup>
                        </GerichtHeader>
                    </GerichtCard>
                ))
            )}

            {/* Edit Modal */}
            {showModal && (
                <ModalOverlay onClick={handleCloseModal}>
                    <ModalContent onClick={(e) => e.stopPropagation()}>
                        <ModalTitle>
                            {editingGericht ? '✏️ Gericht bearbeiten' : '➕ Neues Gericht'}
                        </ModalTitle>

                        <InputGroup>
                            <Label>🍽️ Name</Label>
                            <Input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="z.B. Pizza Margherita"
                                required
                            />
                        </InputGroup>

                        <InputGroup>
                            <Label>📝 Beschreibung</Label>
                            <Textarea
                                name="beschreibung"
                                value={formData.beschreibung}
                                onChange={handleInputChange}
                                placeholder="Beschreibe das Gericht..."
                            />
                        </InputGroup>

                        <InputGroup>
                            <Label>🏷️ Kategorie</Label>
                            <Input
                                type="text"
                                name="kategorie"
                                value={formData.kategorie}
                                onChange={handleInputChange}
                                placeholder="z.B. Hauptgericht, Vorspeise, Dessert"
                            />
                        </InputGroup>

                        <InputGroup>
                            <Label>💰 Preis (€)</Label>
                            <Input
                                type="number"
                                step="0.01"
                                name="preis"
                                value={formData.preis}
                                onChange={handleInputChange}
                                placeholder="z.B. 12.50"
                            />
                        </InputGroup>

                        <ModalButtonGroup>
                            <CancelButton onClick={handleCloseModal}>
                                Abbrechen
                            </CancelButton>
                            <SaveButton onClick={handleSave}>
                                💾 Speichern
                            </SaveButton>
                        </ModalButtonGroup>
                    </ModalContent>
                </ModalOverlay>
            )}
        </Container>
    );
}

export default EditMenu;
