import React from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import colors from '../theme/colors';

const TabsContainer = styled.div`
    display: flex;
    gap: 10px;
    margin-bottom: 40px;
    border-bottom: 2px solid ${colors.border.light};
    padding-bottom: 0;
`;

const TabButton = styled.button`
    background: ${props => props.$isActive ? colors.gradients.primary : 'transparent'};
    color: ${props => props.$isActive ? colors.text.white : colors.text.secondary};
    border: none;
    padding: 14px 28px;
    border-radius: 8px 8px 0 0;
    cursor: pointer;
    font-size: 1em;
    font-weight: 600;
    transition: all 0.3s ease;
    position: relative;
    bottom: -2px;
    
    ${props => props.$isActive && `
        box-shadow: ${colors.shadows.primarySmall};
    `}

    &:hover:not(:disabled) {
        background: ${props => props.$isActive ? colors.gradients.primary : colors.background.light};
        color: ${props => props.$isActive ? colors.text.white : colors.text.primary};
    }

    &:disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }
`;

function EditNavigationTabs({ restaurantId }) {
    const navigate = useNavigate();
    const location = useLocation();

    const tabs = [
        { path: `/restaurants/${restaurantId}/edit`, label: '🍽️ Basis-Infos' },
        { path: `/restaurants/${restaurantId}/edit/opening`, label: '🕐 Öffnungszeiten' },
        { path: `/restaurants/${restaurantId}/edit/menu`, label: '📋 Speisekarte' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <TabsContainer>
            {tabs.map(tab => (
                <TabButton
                    key={tab.path}
                    $isActive={isActive(tab.path)}
                    onClick={() => navigate(tab.path)}
                >
                    {tab.label}
                </TabButton>
            ))}
        </TabsContainer>
    );
}

export default EditNavigationTabs;
