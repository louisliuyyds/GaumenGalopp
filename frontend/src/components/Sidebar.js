import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import colors from '../theme/colors';

const SidebarContainer = styled.div`
    width: 200px;
    height: 100vh;
    background: ${colors.gradients.primary};
    position: fixed;
    left: 0;
    top: 0;
    padding: 20px;
    box-shadow: 4px 0 15px ${colors.overlay.dark};
    display: flex;
    flex-direction: column;
`;

const LogoContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    margin-bottom: 30px;
`;

const LogoImage = styled.img`
    width: 100px;
    height: auto;
    object-fit: contain;
`;

const LogoText = styled.h1`
    color: ${colors.text.white};
    font-size: 1.5em;
    font-weight: 700;
    letter-spacing: 0.5px;
    margin: 0;
`;

const ToggleContainer = styled.div`
    background: ${colors.overlay.dark};
    border-radius: 10px;
    padding: 4px;
    display: flex;
    margin-bottom: 30px;
    position: relative;
`;

const ToggleButton = styled.button`
    flex: 1;
    padding: 10px 8px;
    border: none;
    background: ${props => props.$active ? colors.gradients.accent : 'transparent'};
    color: ${props => props.$active ? colors.text.white : colors.primary.light};
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.85em;
    font-weight: ${props => props.$active ? '700' : '500'};
    transition: all 0.3s ease;
    z-index: 1;

    &:hover {
        color: ${colors.text.white};
    }
`;

const NavList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    flex: 1;
    overflow-y: auto;
`;

const NavItem = styled.li`
    margin-bottom: 8px;
`;

const NavLink = styled(Link)`
    display: block;
    padding: 12px 15px;
    color: ${colors.primary.light};
    text-decoration: none;
    border-radius: 8px;
    transition: all 0.3s ease;
    font-weight: 500;
    font-size: 0.95em;

    &:hover {
        background-color: ${colors.overlay.light};
        transform: translateX(5px);
    }

    &.active {
        background: ${colors.gradients.accent};
        color: ${colors.text.white};
        box-shadow: ${colors.shadows.accent};
    }
`;

const ViewLabel = styled.div`
    color: ${colors.primary.light};
    font-size: 0.75em;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 15px;
    padding: 0 5px;
    opacity: 0.7;
`;

function Sidebar() {
    const location = useLocation();
    const [isAdminView, setIsAdminView] = useState(true); // true = Verwaltung, false = Kunde

    // Navigation für Verwaltungsansicht
    const adminNavItems = [
        { path: '/', label: 'Dashboard' },
        { path: '/restaurants', label: 'Restaurants' },
        { path: '/restaurants/profil', label: 'Restaurant-Profil' },
        { path: '/neuesRestaurant', label: 'Neues Restaurant' },
        { path: '/beispiel', label: 'Beispiel' },
    ];

    // Navigation für Kundenansicht
    const customerNavItems = [
        { path: '/kunde', label: 'Home' },
        { path: '/kunde/restaurants', label: 'Restaurants'},
        { path: '/kunde/bestellungen', label: 'Meine Bestellungen' },
        { path: '/kunde/favoriten', label: 'Favoriten' },
        { path: '/kunde/profil', label: 'Profil' },
    ];

    const currentNavItems = isAdminView ? adminNavItems : customerNavItems;

    return (
        <SidebarContainer>
            <LogoContainer>
                <LogoImage src="/horseLogo.png" alt="GaumenGalopp Logo" />
                <LogoText>GaumenGalopp</LogoText>
            </LogoContainer>

            <ToggleContainer>
                <ToggleButton
                    $active={!isAdminView}
                    onClick={() => setIsAdminView(false)}
                >
                    Kunde
                </ToggleButton>
                <ToggleButton
                    $active={isAdminView}
                    onClick={() => setIsAdminView(true)}
                >
                    Verwaltung
                </ToggleButton>
            </ToggleContainer>

            <ViewLabel>
                {isAdminView ? '🔧 Verwaltungsansicht' : '👥 Kundenansicht'}
            </ViewLabel>

            <NavList>
                {currentNavItems.map((item) => (
                    <NavItem key={item.path}>
                        <NavLink
                            to={item.path}
                            className={location.pathname === item.path ||
                            (item.path !== '/' && location.pathname.includes(item.path))
                                ? 'active' : ''}
                        >
                            {item.icon} {item.label}
                        </NavLink>
                    </NavItem>
                ))}
            </NavList>
        </SidebarContainer>
    );
}

export default Sidebar;