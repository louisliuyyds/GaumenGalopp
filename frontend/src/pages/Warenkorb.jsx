import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import colors from '../theme/colors';
import {warenkorbService} from "../services/warenkorbService";
import {kundeService} from "../services";
import { useAuth } from '../context/AuthContext';


const SearchBox = styled.div`
    background: ${colors.background.card};
    padding: 30px;
    border-radius: 15px;
    border: 2px solid ${colors.border.light};
    margin-bottom: 30px;
    display: flex;
    gap: 15px;
    align-items: center;
`;

const Input = styled.input`
    padding: 12px 20px;
    border-radius: 10px;
    border: 2px solid ${colors.border.medium};
    font-size: 1rem;
    flex: 1;
    transition: border-color 0.2s;
    &:focus { outline: none; border-color: ${colors.accent.orange}; }
`;

const Button = styled.button`
    background: ${colors.gradients.accent};
    color: white;
    border: none;
    padding: 12px 25px;
    border-radius: 10px;
    cursor: pointer;
    font-weight: bold;
    transition: transform 0.2s, box-shadow 0.2s;
    &:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3); }
    &:disabled { opacity: 0.6; cursor: not-allowed; }
`;


const Container = styled.div`
    max-width: 1400px;
    margin: 0 auto;
`;

const Header = styled.h1`
    color: ${colors.text.primary};
    margin-bottom: 30px;
    font-size: 2.5em;
    font-weight: 700;
`;

const SubHeader = styled.h2`
    color: ${colors.text.primary};
    margin-bottom: 30px;
    font-size: 2em;
    font-weight: 550;
`;

const Bestellposition = styled.div`
    background: ${colors.background.card};
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: ${colors.shadows.medium};
    border: 2px solid transparent;
    transition: 0.3s;
`;

const BestellpositionHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const BestellpositionName = styled.h2`
    color: ${colors.text.primary};
    margin-bottom: 10px;
    font-size: 1.4em;
    font-weight: 600;
`;

const Preis = styled.div`
    color: ${colors.accent.orange};
    font-size: 1.2em;
    font-weight: 700;
`;

const Beschreibung = styled.p`
color: ${colors.text.light};
margin-top: 10px;
font-size: 0.95em;
`;


const Aenderungen = styled.div`
margin-top: 8px;
font-size: 0.9em;
color: ${colors.text.secondary};
font-style: italic;
`;


const Menge = styled.div`
margin-top: 10px;
font-size: 1em;
color: ${colors.text.primary};
font-weight: 600;
`;

const Footer = styled.div`
margin-top: 30px;
padding: 20px;
background: ${colors.background.card};
border-radius: 12px;
box-shadow: ${colors.shadows.medium};
display: flex;
justify-content: space-between;
align-items: center;
`;


const TotalText = styled.span`
font-size: 1.4em;
font-weight: 700;
color: ${colors.text.primary};
`;


const BestellButton = styled.button`
background: ${colors.accent.orange};
color: white;
padding: 12px 25px;
border: none;
border-radius: 10px;
cursor: pointer;
font-size: 1em;
font-weight: 600;
transition: 0.3s;
&:hover {
background: ${colors.accent.black};
}
`;

function Warenkorb() {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);
    const [statusMsg, setStatusMsg] = useState('');
    const [editingNoteId, setEditingNoteId] = useState(null);
    const [editingNoteText, setEditingNoteText] = useState('');
    const { user } = useAuth();
    const kundenId = user?.user_id;


    useEffect(() => {
        if (kundenId) {
            handleSearch();
        }
    }, []);

    const handleSearch = async () => {
        if (!kundenId) {
            setStatusMsg('Bitte geben Sie eine Kunden-ID ein.');
            return;
        }

        setLoading(true);
        setStatusMsg('Lade Warenkorb...');

        try {
            console.log('Requesting cart for customer:', kundenId); // ← ADD THIS
            const data = await warenkorbService.getCart(kundenId);
            console.log('Received data:', data); // ← ADD THIS
            console.log('Items:', data.items); // ← ADD THIS
            setCart(data);
            setStatusMsg('');
        } catch (err) {
            console.error('Full error:', err); // ← CHANGE THIS
            console.error('Error response:', err.response); // ← ADD THIS
            setStatusMsg('Fehler beim Abrufen der Daten.');
            setCart(null);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateQuantity = async (positionid, newMenge) => {
        try {
            const updatedCart = await warenkorbService.updateQuantity(kundenId, positionid, newMenge);
            setCart(updatedCart);
        } catch (err) {
            console.error('Fehler beim Aktualisieren:', err);
            alert('Fehler beim Aktualisieren der Menge');
        }
    };

    const handleRemoveItem = async (positionid) => {
        if (window.confirm('Artikel aus Warenkorb entfernen?')) {
            try {
                const updatedCart = await warenkorbService.removeItem(kundenId, positionid);
                setCart(updatedCart);
            } catch (err) {
                console.error('Fehler beim Entfernen:', err);
                alert('Fehler beim Entfernen des Artikels');
            }
        }
    };

    const handleStartEditNote = (positionid, currentNote) => {
        setEditingNoteId(positionid);
        setEditingNoteText(currentNote || '');
    };

    const handleCancelEditNote = () => {
        setEditingNoteId(null);
        setEditingNoteText('');
    };

    const handleSaveNote = async (positionid) => {
        try {
            const updatedCart = await warenkorbService.updateNotes(
                kundenId,
                positionid,
                editingNoteText
            );
            setCart(updatedCart);
            setEditingNoteId(null);
            setEditingNoteText('');
        } catch (err) {
            console.error('Fehler beim Speichern:', err);
            alert('Fehler beim Speichern der Notiz');
        }
    };

    const handleClearCart = async () => {
        if (window.confirm('Warenkorb leeren?')) {
            try {
                await warenkorbService.clearCart(kundenId);
                setCart({ items: [], subtotal: 0, item_count: 0 });
            } catch (err) {
                console.error('Fehler:', err);
                alert('Fehler beim Leeren des Warenkorbs');
            }
        }
    };

    const handleCheckout = async () => {
        const data = await kundeService.getAdressIdByKundenId(kundenId);
        const { adressid } = data;

        const lieferantid = 1; // Placeholder

        try {
            const result = await warenkorbService.checkout(kundenId, { adressid, lieferantid });
            alert(`Bestellung erfolgreich! Bestellnummer: ${result.bestellungid}`);
            setCart({ items: [], subtotal: 0, item_count: 0 });
        } catch (err) {
            console.error('Fehler beim Bestellen:', err);
            alert('Fehler beim Abschließen der Bestellung');
        }
    };

    return (
        <Container>
            <Header>Warenkorb</Header>



            {statusMsg && <StatusMessage>{statusMsg}</StatusMessage>}

            {cart && (
                <>
                    {cart.items.length === 0 ? (
                        <EmptyCart>
                            <EmptyIcon>🛒</EmptyIcon>
                            <EmptyText>Ihr Warenkorb ist leer</EmptyText>
                        </EmptyCart>
                    ) : (
                        <>
                            <SubHeader>
                                Restaurant: {cart.restaurantname || 'Nicht zugewiesen'}
                            </SubHeader>

                            {cart.items.map(item => (
                                <Bestellposition key={item.positionid}>
                                    <BestellpositionHeader>
                                        <BestellpositionName>{item.name}</BestellpositionName>
                                        <Preis>€{item.preis.toFixed(2)}</Preis>
                                    </BestellpositionHeader>

                                    <Beschreibung>{item.beschreibung}</Beschreibung>

                                    {editingNoteId === item.positionid ? (
                                        // EDITING MODE
                                        <NotesEditSection>
                                            <NotesInput
                                                type="text"
                                                placeholder="Besondere Wünsche (z.B. ohne Zwiebeln)..."
                                                value={editingNoteText}
                                                onChange={(e) => setEditingNoteText(e.target.value)}
                                                autoFocus
                                            />
                                            <NoteButtonGroup>
                                                <SaveButton onClick={() => handleSaveNote(item.positionid)}>
                                                    ✓ Speichern
                                                </SaveButton>
                                                <CancelNoteButton onClick={handleCancelEditNote}>
                                                    ✕ Abbrechen
                                                </CancelNoteButton>
                                            </NoteButtonGroup>
                                        </NotesEditSection>
                                    ) : (
                                        // VIEW MODE
                                        <NotesViewSection>
                                            {item.aenderungswunsch ? (
                                                <Aenderungen>
                                                    Änderungen: {item.aenderungswunsch}
                                                </Aenderungen>
                                            ) : (
                                                <NoNotes>Keine besonderen Wünsche</NoNotes>
                                            )}
                                            <EditNoteButton
                                                onClick={() => handleStartEditNote(item.positionid, item.aenderungswunsch)}
                                            >
                                                📝 Bearbeiten
                                            </EditNoteButton>
                                        </NotesViewSection>
                                    )}

                                    <QuantityControls>
                                        <QuantityButton
                                            onClick={() => handleUpdateQuantity(item.positionid, item.menge - 1)}
                                        >
                                            -
                                        </QuantityButton>
                                        <Menge>Menge: {item.menge}</Menge>
                                        <QuantityButton
                                            onClick={() => handleUpdateQuantity(item.positionid, item.menge + 1)}
                                        >
                                            +
                                        </QuantityButton>
                                        <RemoveButton onClick={() => handleRemoveItem(item.positionid)}>
                                            🗑️ Entfernen
                                        </RemoveButton>
                                    </QuantityControls>

                                    <ItemTotal>
                                        Zwischensumme: €{item.item_total.toFixed(2)}
                                    </ItemTotal>
                                </Bestellposition>
                            ))}

                            <Footer>
                                <div>
                                    <TotalText>Gesamt: €{cart.subtotal.toFixed(2)}</TotalText>
                                    <ItemCount>{cart.item_count} Artikel</ItemCount>
                                </div>
                                <ButtonGroup>
                                    <ClearButton onClick={handleClearCart}>
                                        Warenkorb leeren
                                    </ClearButton>
                                    <BestellButton onClick={handleCheckout}>
                                        Jetzt bestellen
                                    </BestellButton>
                                </ButtonGroup>
                            </Footer>
                        </>
                    )}
                </>
            )}
        </Container>
    );
}

// Additional styled components
const StatusMessage = styled.div`
    padding: 15px;
    background: ${colors.primary.light};
    color: ${colors.text.primary};
    border-radius: 10px;
    margin-bottom: 20px;
    text-align: center;
`;

const EmptyCart = styled.div`
    text-align: center;
    padding: 60px 20px;
    background: ${colors.background.card};
    border-radius: 15px;
`;

const EmptyIcon = styled.div`
    font-size: 5em;
    margin-bottom: 20px;
`;

const EmptyText = styled.p`
    font-size: 1.3em;
    color: ${colors.text.secondary};
`;

const QuantityControls = styled.div`
    display: flex;
    align-items: center;
    gap: 15px;
    margin-top: 15px;
`;

const QuantityButton = styled.button`
    background: ${colors.accent.orange};
    color: white;
    border: none;
    width: 35px;
    height: 35px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1.2em;
    font-weight: bold;
    transition: 0.2s;
    
    &:hover {
        background: ${colors.accent.black};
    }
`;

const RemoveButton = styled.button`
    background: ${colors.accent.red || '#cc2020'};
    color: white;
    border: none;
    padding: 8px 15px;
    border-radius: 8px;
    cursor: pointer;
    margin-left: auto;
    transition: 0.2s;
    
    &:hover {
        opacity: 0.8;
    }
`;

const ItemTotal = styled.div`
    margin-top: 10px;
    font-size: 1.1em;
    font-weight: 600;
    color: ${colors.accent.orange};
    text-align: right;
`;

const ItemCount = styled.div`
    font-size: 0.9em;
    color: ${colors.text.secondary};
    margin-top: 5px;
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 15px;
`;

const ClearButton = styled.button`
    background: ${colors.text.secondary};
    color: white;
    padding: 12px 25px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-size: 1em;
    font-weight: 600;
    transition: 0.3s;
    
    &:hover {
        opacity: 0.8;
    }
`;

const NotesViewSection = styled.div`
    margin-top: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 15px;
    background: ${colors.background.main};
    border-radius: 8px;
    border: 1px solid ${colors.border.light};
`;

const NoNotes = styled.span`
    color: ${colors.text.secondary};
    font-style: italic;
    font-size: 0.9em;
`;

const EditNoteButton = styled.button`
    background: transparent;
    color: ${colors.accent.orange};
    border: 2px solid ${colors.accent.orange};
    padding: 6px 15px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.85em;
    font-weight: 600;
    transition: 0.2s;
    
    &:hover {
        background: ${colors.accent.orange};
        color: white;
    }
`;

const NotesEditSection = styled.div`
    margin-top: 15px;
    padding: 15px;
    background: ${colors.background.main};
    border-radius: 8px;
    border: 2px solid ${colors.accent.orange};
`;

const NotesInput = styled.input`
    width: 100%;
    box-sizing: border-box;
    padding: 12px 15px;
    border: 2px solid ${colors.border.medium};
    border-radius: 8px;
    font-size: 1em;
    margin-bottom: 10px;
    
    &:focus {
        outline: none;
        border-color: ${colors.accent.orange};
    }
`;

const NoteButtonGroup = styled.div`
    display: flex;
    gap: 10px;
    justify-content: flex-end;
`;

const SaveButton = styled.button`
    background: ${colors.accent.orange};
    color: white;
    border: none;
    padding: 8px 20px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9em;
    font-weight: 600;
    transition: 0.2s;
    
    &:hover {
        background: ${colors.accent.black};
    }
`;

const CancelNoteButton = styled.button`
    background: ${colors.text.secondary};
    color: white;
    border: none;
    padding: 8px 20px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9em;
    font-weight: 600;
    transition: 0.2s;
    
    &:hover {
        opacity: 0.8;
    }
`;

export default Warenkorb;
