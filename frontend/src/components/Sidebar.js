import React from 'react';
import styled from 'styled-components';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import colors from '../theme/colors';

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
    background: ${props => props.type === 'restaurant' ?
            colors.primary.main : colors.secondary.main};
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

const NavSection = styled.div`
    margin-bottom: 20px;
`;

const SectionTitle = styled.div`
    padding: 8px 20px;
    font-size: 0.75em;
    color: ${colors.text.light};
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 700;
    margin-top: 10px;
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
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Prüft ob der aktuelle Pfad aktiv ist
    const isActive = (path) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(path);
    };

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
                        {isKritiker && <RoleBadge type={user.user_type}>Kritiker</RoleBadge>}
                    </UserRole>
                </UserInfo>
            )}

            <NavMenu>
                {/* Restaurant Navigation */}
                {isRestaurant && (
                    <>
                        <NavSection>
                            <NavItem
                                to="/"
                                className={isActive('/') && !isActive('/restaurants') ? 'active' : ''}
                            >
                                Dashboard
                            </NavItem>
                        </NavSection>

                        <SectionTitle>Restaurant Verwaltung</SectionTitle>
                        <NavSection>
                            <NavItem
                                to={`/restaurants/${user.user_id}`}
                                className={isActive(`/restaurants/${user.user_id}`) ? 'active' : ''}
                            >
                                🍽️ Mein Restaurant
                            </NavItem>
                            <NavItem
                                to="/restaurants"
                                className={isActive('/restaurants') && !isActive(`/restaurants/${user.user_id}`) ? 'active' : ''}
                            >
                                Alle Restaurants
                            </NavItem>
                        </NavSection>
                    </>
                )}

                {/* Kunden Navigation */}
                {isKunde && (
                    <>
                        <NavSection>
                            <NavItem
                                to="/kunde"
                                className={location.pathname === '/kunde' ? 'active' : ''}
                            >
                                Startseite
                            </NavItem>
                        </NavSection>

                        <SectionTitle>Bestellen</SectionTitle>
                        <NavSection>
                            <NavItem
                                to="/kunde/restaurants"
                                className={isActive('/kunde/restaurants') ? 'active' : ''}
                            >
                                Restaurants
                            </NavItem>
                            <NavItem
                                to="/kunde/warenkorb"
                                className={isActive('/kunde/warenkorb') ? 'active' : ''}
                            >
                                Warenkorb
                            </NavItem>
                        </NavSection>

                        <SectionTitle>Mein Konto</SectionTitle>
                        <NavSection>
                            <NavItem
                                to="/kunde/bestellhistorie"
                                className={isActive('/kunde/bestellhistorie') ? 'active' : ''}
                            >
                                Bestellhistorie
                            </NavItem>
                            <NavItem
                                to="/kunde/profil"
                                className={isActive('/kunde/profil') ? 'active' : ''}
                            >
                                Mein Profil
                            </NavItem>
                        </NavSection>
                    </>
                )}
            </NavMenu>

            <LogoutButton onClick={handleLogout}>
                Ausloggen
            </LogoutButton>
        </SidebarContainer>
    );
}

export default Sidebar;