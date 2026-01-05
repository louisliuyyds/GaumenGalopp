import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components';
import colors from '../theme/colors';

const LoadingContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: ${colors.background.main};
`;

const LoadingSpinner = styled.div`
    width: 50px;
    height: 50px;
    border: 4px solid ${colors.border.light};
    border-top-color: ${colors.primary.main};
    border-radius: 50%;
    animation: spin 1s linear infinite;

    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;

/**
 * ProtectedRoute - Schützt Routes vor nicht-authentifizierten Usern
 *
 * @param {ReactNode} children - Die zu schützende Komponente
 * @param {string} requiredType - Optional: "kunde" oder "restaurant" - beschränkt auf User-Typ
 * @param {string} requiredRole - Optional: "kritiker" - beschränkt auf Rolle
 */
function ProtectedRoute({ children, requiredType, requiredRole }) {
    const { user, loading, isAuthenticated } = useAuth();

    // Während Auth-Check läuft
    if (loading) {
        return (
            <LoadingContainer>
                <LoadingSpinner />
            </LoadingContainer>
        );
    }

    // Nicht eingeloggt -> Login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Prüfe ob User-Type erforderlich ist
    if (requiredType && user.user_type !== requiredType) {
        // Falsche User-Type -> Redirect zur passenden Startseite
        if (user.user_type === 'restaurant') {
            return <Navigate to="/restaurants" replace />;
        } else {
            return <Navigate to="/kunde/restaurants" replace />;
        }
    }

    // Prüfe ob spezielle Rolle erforderlich ist
    if (requiredRole && user.role !== requiredRole) {
        // Keine Berechtigung -> Redirect zur Startseite
        return <Navigate to="/" replace />;
    }

    // Alles OK -> Zeige Komponente
    return children;
}

export default ProtectedRoute;