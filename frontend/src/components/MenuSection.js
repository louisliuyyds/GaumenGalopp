import React from 'react';
import styled from 'styled-components';
import colors from '../theme/colors';
import { warenkorbService } from "../services/warenkorbService";

// ✅ FIXED: styled.di → styled.div, styled.h → styled.h2, styled.butto → styled.button
const Section = styled.div`
    margin-top: 50px;
`;

const CategoryTitle = styled.h2`
    color: ${colors.text.primary};
    border-bottom: 3px solid ${colors.accent.orange};
    display: inline-block;
    padding-bottom: 5px;
    margin-bottom: 25px;
    font-size: 1.8rem;
`;

const DishGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 20px;
    margin-bottom: 40px;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

const DishCard = styled.div`
    background: ${colors.background.card};
    padding: 20px;
    border-radius: 15px;
    border: 1px solid ${colors.border.light};
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.3s ease;
    box-shadow: ${colors.shadows.small};

    &:hover {
        border-color: ${colors.accent.orange};
        transform: translateY(-3px);
        box-shadow: ${colors.shadows.medium};
    }
`;

const DishInfo = styled.div`
    flex: 1;
    h4 {
        margin: 0;
        font-size: 1.2rem;
        color: ${colors.text.primary};
        font-weight: 700;
    }
    p {
        margin: 5px 0 0 0;
        font-size: 0.9rem;
        color: ${colors.text.light};
        line-height: 1.5;
    }
`;

const PriceArea = styled.div`
    text-align: right;
    margin-left: 20px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;

    .price {
        font-weight: bold;
        color: ${colors.accent.orange};
        font-size: 1.3rem;
        margin-bottom: 10px;
    }
`;

const AddButton = styled.button`
    background: ${colors.gradients.accent};
    color: white;
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 10px;
    cursor: pointer;
    font-weight: bold;
    font-size: 1.3rem;
    transition: all 0.2s ease;
    box-shadow: ${colors.shadows.small};

    &:hover {
        transform: scale(1.1) rotate(90deg);
        box-shadow: ${colors.shadows.medium};
    }

    &:active {
        transform: scale(0.95);
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
    }
`;

const EmptyState = styled.div`
    text-align: center;
    padding: 60px 20px;
    background: ${colors.background.light};
    border-radius: 15px;
    color: ${colors.text.light};
    font-size: 1.1rem;
`;

const MenuHeader = styled.h2`
    font-size: 2rem;
    margin-bottom: 30px;
    color: ${colors.text.primary};
`;

function MenuSection({ restaurant }) {
    console.log('🍽 MenuSection received restaurant:', restaurant);

    // Sammle ALLE Gerichte aus ALLEN Menüs
    const allDishes = [];

    if (restaurant?.menue && Array.isArray(restaurant.menue)) {
        restaurant.menue.forEach(menu => {
            console.log('📋 Processing menu:', menu.name, '- Gerichte:', menu.gericht?.length);
            if (menu.gericht && Array.isArray(menu.gericht)) {
                allDishes.push(...menu.gericht);
            }
        });
    }

    console.log('🍽️ Total dishes found:', allDishes.length);

    // Wenn keine Gerichte vorhanden sind
    if (allDishes.length === 0) {
        console.error('⚠️ MenuSection: NO DISHES FOUND!');
        console.log('Restaurant object:', restaurant);
        console.log('restaurant.menue:', restaurant?.menue);

        return (
            <Section>
                <MenuHeader>🍴 Speisekarte</MenuHeader>
                <EmptyState>
                    <div style={{background: '#ffebee', padding: '20px', borderRadius: '8px', border: '2px solid #f44336'}}>
                        <h3 style={{color: '#d32f2f', marginBottom: '10px'}}>Gerichte folgen in Kürze</h3>
                        <p>Das Restaurant bereitet aktuell sein Menü vor.</p>
                        <p>Bei Rückfragen wenden Sie sich bitte an das Restaurant.</p>
                    </div>
                </EmptyState>
            </Section>
        );
    }

    // Gruppierung nach Kategorie
    const groupedDishes = allDishes.reduce((acc, gericht) => {
        const category = gericht.kategorie || 'Spezialitäten';
        if (!acc[category]) acc[category] = [];
        acc[category].push(gericht);
        return acc;
    }, {});

    console.log('📊 Grouped by category:', Object.keys(groupedDishes));

    // Hilfsfunktion: Hole den aktiven Preis
    const getActivePrice = (preisArray) => {
        if (!preisArray || preisArray.length === 0) return 8.50;

        // Suche aktiven Preis (istaktiv: true)
        const activePrice = preisArray.find(p => p.istaktiv === true);
        if (activePrice) {
            return parseFloat(activePrice.betrag);
        }

        // Fallback: Ersten Preis nehmen
        return parseFloat(preisArray[0].betrag);
    };

    // Hilfsfunktion: Hole die aktive Preis-ID
    const getActivePriceId = (preisArray) => {
        if (!preisArray || preisArray.length === 0) return null;

        // Suche aktiven Preis (istaktiv: true)
        const activePrice = preisArray.find(p => p.istaktiv === true);
        if (activePrice) {
            return activePrice.preisid;
        }

        // Fallback: Ersten Preis nehmen
        return preisArray[0].preisid;
    };

    // Warenkorb-Handler (wie in GerichtDetail.js)
    const handleAddToCart = async (gericht) => {
        if (window.confirm('Artikel in den Warenkorb hinzufügen?')) {
            const kundenId = 20; // TODO: Aus Auth-Context holen
            try {
                const itemData = {
                    restaurantid: parseInt(restaurant.restaurantid),
                    gerichtid: parseInt(gericht.gerichtid),
                    preisid: getActivePriceId(gericht.preis),
                    menge: 1,
                    aenderungswunsch: null
                };
                
                console.log('Sending to cart:', itemData);
                
                await warenkorbService.addItem(kundenId, itemData);
                alert('Artikel wurde dem Warenkorb hinzugefügt!');
            } catch (err) {
                console.error('Fehler beim Hinzufügen:', err);
                console.error('Fehlerdetails:', err.response?.data);
                alert('Fehler beim Hinzufügen des Artikels');
            }
        }
    };

    return (
        <Section>
            <MenuHeader>🍴 Speisekarte</MenuHeader>

            {Object.entries(groupedDishes).map(([category, items]) => (
                <div key={category}>
                    <CategoryTitle>{category}</CategoryTitle>
                    <DishGrid>
                        {items.map(gericht => (
                            <DishCard key={gericht.gerichtid}>
                                <DishInfo>
                                    <h4>{gericht.name}</h4>
                                    <p>{gericht.beschreibung || 'Frisch zubereitet nach Hausrezept.'}</p>
                                </DishInfo>
                                <PriceArea>
                                    <div className="price">
                                        {getActivePrice(gericht.preis).toFixed(2)} €
                                    </div>
                                    <AddButton
                                        title="In den Warenkorb"
                                        onClick={() => handleAddToCart(gericht)}
                                        disabled={!getActivePriceId(gericht.preis)}
                                    >
                                        +
                                    </AddButton>
                                </PriceArea>
                            </DishCard>
                        ))}
                    </DishGrid>
                </div>
            ))}
        </Section>
    );
}

export default MenuSection;