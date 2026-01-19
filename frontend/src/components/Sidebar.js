import React from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import colors from '../theme/colors';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

const SidebarContainer = styled.div`
    width: 220px;
    height: 100vh;
    background: ${colors.background.card};
    border-right: 1px solid ${colors.border.light};
    display: flex;
    flex-direction: column;
    position: fixed;
    left: 0;
    top: 0;
    box-shadow: ${colors.shadows.medium};
`;

const Logo = styled.div`
    padding: 30px 20px;
    font-size: 1.5em;
    font-weight: 800;
    color: ${colors.primary.main};
    border-bottom: 1px solid ${colors.border.light};
    background: ${colors.gradients.primary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
`;

const UserInfo = styled.div`
    padding: 15px 20px;
    border-bottom: 1px solid ${colors.border.light};
    background: ${colors.background.main};
`;

const UserType = styled.div`
    font-size: 0.75em;
    color: ${colors.text.light};
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 5px;
`;

const UserRole = styled.div`
    font-size: 0.9em;
    color: ${colors.text.primary};
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
`;

const RoleBadge = styled.span`
    background: ${props => props.type === 'restaurant' ? colors.primary.main : colors.secondary.main};
    color: white;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 0.7em;
    font-weight: 700;
`;

const NavMenu = styled.nav`
    flex: 1;
    padding: 20px 0;
    overflow-y: auto;
`;

const NavItem = styled(Link)`
    display: block;
    padding: 12px 20px;
    color: ${colors.text.primary};
    text-decoration: none;
    transition: all 0.3s ease;
    font-weight: 500;
    border-left: 3px solid transparent;

    &:hover {
        background: ${colors.background.main};
        border-left-color: ${colors.primary.main};
        color: ${colors.primary.main};
    }

    &.active {
        background: ${colors.background.main};
        border-left-color: ${colors.primary.main};
        color: ${colors.primary.main};
        font-weight: 700;
    }
`;

const LogoutButton = styled.button`
    margin: 20px;
    padding: 12px;
    background: ${colors.gradients.primary};
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: ${colors.shadows.primarySmall};

    &:hover {
        transform: translateY(-2px);
        box-shadow: ${colors.shadows.primaryMedium};
    }
`;

function Sidebar() {
    const { user, logout, isRestaurant, isKunde, isKritiker } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };
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
        { path: '/kunde/bestellungen', label: 'Meine Bestellungen' },
        { path: '/kunde/restaurants', label: 'Restaurants'},
        { path: '/kunde/warenkorb', label: 'Warenkorb' },
        { path: '/bestellhistorie', label: 'Bestellhistorie' },
        { path: '/kunde/favoriten', label: 'Favoriten' },
        { path: '/kunde/profil', label: 'Profil' },
    ];

    const currentNavItems = isAdminView ? adminNavItems : customerNavItems;

    return (
        <SidebarContainer>
            <Logo>GaumenGalopp</Logo>

            {user && (
                <UserInfo>
                    <UserType>
                        {isRestaurant ? '🍽️ Restaurant-Verwaltung' : '👤 Kundenbereich'}
                    </UserType>
                    <UserRole>
                        {user.email}
                        {isKritiker && <RoleBadge>Kritiker</RoleBadge>}
                    </UserRole>
                </UserInfo>
            )}

            <NavMenu>
                {/* Restaurant Navigation */}
                {isRestaurant && (
                    <>
                        <NavItem to="/">Dashboard</NavItem>
                        <NavItem to="/restaurants">Meine Restaurants</NavItem>
                        <NavItem to="/neuesRestaurant">Neues Restaurant</NavItem>
                    </>
                )}

                {/* Kunden Navigation */}
                {isKunde && (
                    <>
                        <NavItem to="/kunde">Startseite</NavItem>
                        <NavItem to="/kunde/restaurants">Restaurants</NavItem>
                        <NavItem to="/kunde/bestellungen">Meine Bestellungen</NavItem>
                    </>
                )}

                {/* Shared Navigation */}
                <NavItem to="/beispiel">Beispiel</NavItem>
            </NavMenu>

            <LogoutButton onClick={handleLogout}>
                Ausloggen
            </LogoutButton>
        </SidebarContainer>
    );
}

export default Sidebar;