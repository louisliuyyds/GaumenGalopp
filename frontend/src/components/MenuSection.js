import styled from "styled-components";
import colors from "../theme/colors";
import {useNavigate, useParams, useLocation} from "react-router-dom";
import {useState} from "react";

const MenuSectionWrapper = styled.div`
    background: ${colors.background.card};
    border-radius: 12px;
    padding: 40px;
    box-shadow: ${colors.shadows.medium};
`;

const MenuHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
`;

const AddGerichtButton = styled.button`
    background: ${colors.gradients.accent};
    color: ${colors.text.white};
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1em;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: ${colors.shadows.accent};

    &:hover {
        transform: translateY(-2px);
        box-shadow: ${colors.shadows.accentHover};
    }
`;

const GerichteGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
`;

const GerichtCard = styled.div`
    background: ${colors.background.gradient};
    border-radius: 12px;
    padding: 20px;
    border: 2px solid ${colors.border.light};
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
        transform: translateY(-5px);
        box-shadow: ${colors.shadows.medium};
        border-color: ${colors.accent.orange};
    }
`;

const CardTitle = styled.h2`
    color: ${colors.text.primary};
    font-size: 1.5em;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 3px solid ${colors.accent.orange};
    display: inline-block;
`;

const GerichtName = styled.h3`
    color: ${colors.text.primary};
    font-size: 1.3em;
    margin-bottom: 10px;
    font-weight: 600;
`;

const GerichtDescription = styled.p`
    color: ${colors.text.light};
    font-size: 0.95em;
    margin-bottom: 15px;
    line-height: 1.5;
`;

const GerichtFooter = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid ${colors.border.light};
`;

const GerichtPrice = styled.span`
    color: ${colors.accent.orange};
    font-size: 1.2em;
    font-weight: 700;
`;

const GerichtCategory = styled.span`
    background: ${colors.primary.light};
    color: ${colors.text.primary};
    padding: 5px 12px;
    border-radius: 15px;
    font-size: 0.85em;
    font-weight: 600;
`;

const ActionButtons = styled.div`
    display: flex;
    gap: 10px;
    margin-top: 10px;
`;

const EditButton = styled.button`
    background: ${colors.status.success};
    color: ${colors.text.white};
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9em;
    font-weight: 600;
    transition: all 0.2s ease;

    &:hover {
        background: ${colors.status.successHover};
        transform: scale(1.05);
    }
`;

const DeleteButton = styled.button`
    background: ${colors.status.error};
    color: ${colors.text.white};
    border: none;
    padding: 8px 16px;
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

// Restaurant-Daten werden jetzt als Props übergeben!
const MenuSection = ({ restaurant }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const isCustomerView = location.pathname.startsWith('/kunde');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

    const handleGerichtClick = (gerichtId) => {
        if (isCustomerView) {
            navigate(`/kunde/restaurants/${id}/gericht/${gerichtId}`);
        } else {
            navigate(`/restaurants/${id}/gericht/${gerichtId}`);
        }
    };

    const handleDeleteGericht = (e, gerichtId) => {
        e.stopPropagation();
        if (showDeleteConfirm === gerichtId) {
            console.log(`Gericht ${gerichtId} löschen`);
            setShowDeleteConfirm(null);
        } else {
            setShowDeleteConfirm(gerichtId);
            setTimeout(() => setShowDeleteConfirm(null), 3000);
        }
    };

    const handleEditGericht = (e, gerichtId) => {
        e.stopPropagation();
        navigate(`/restaurants/${id}/gericht/${gerichtId}`);
    };

    return(
        <MenuSectionWrapper>
            <MenuHeader>
                <CardTitle>🍴 Menü ({restaurant?.gerichte?.length || 0} Gerichte)</CardTitle>
                {!isCustomerView && (
                    <AddGerichtButton onClick={() => console.log('Neues Gericht hinzufügen')}>
                        + Neues Gericht
                    </AddGerichtButton>
                )}
            </MenuHeader>

            {restaurant?.gerichte && restaurant.gerichte.length > 0 ? (
                <GerichteGrid>
                    {restaurant.gerichte.map((gericht) => (
                        <GerichtCard
                            key={gericht.id}
                            onClick={() => handleGerichtClick(gericht.id)}
                        >
                            <GerichtName>{gericht.name}</GerichtName>
                            <GerichtCategory>{gericht.category}</GerichtCategory>
                            <GerichtDescription>{gericht.description}</GerichtDescription>
                            <GerichtFooter>
                                <GerichtPrice>{gericht.price.toFixed(2)} €</GerichtPrice>
                            </GerichtFooter>
                            {!isCustomerView && (
                                <ActionButtons>
                                    <EditButton onClick={(e) => handleEditGericht(e, gericht.id)}>
                                        ✏️ Bearbeiten
                                    </EditButton>
                                    <DeleteButton onClick={(e) => handleDeleteGericht(e, gericht.id)}>
                                        {showDeleteConfirm === gericht.id ? '❗ Bestätigen?' : '🗑️ Löschen'}
                                    </DeleteButton>
                                </ActionButtons>
                            )}
                        </GerichtCard>
                    ))}
                </GerichteGrid>
            ) : (
                <p style={{ color: colors.text.light, textAlign: 'center', padding: '40px' }}>
                    Noch keine Gerichte vorhanden. Füge das erste Gericht hinzu!
                </p>
            )}
        </MenuSectionWrapper>
    )
}

export default MenuSection;