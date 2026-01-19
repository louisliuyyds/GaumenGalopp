import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Beim App-Start: Prüfe ob User eingeloggt ist
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            if (authService.isAuthenticated()) {
                // Hole User-Daten vom Backend
                const userData = await authService.getCurrentUser();
                setUser(userData);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            // Token ist ungültig - Logout
            authService.logout();
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (type, email, password) => {
        try {
            const data = await authService.login(type, email, password);
            // User-State aktualisieren
            setUser({
                user_id: data.user_id,
                user_type: data.user_type,
                role: data.role,
                email: email
            });
            return data;
        } catch (error) {
            throw error;
        }
    };

    const registerKunde = async (userData) => {
        try {
            const data = await authService.registerKunde(userData);
            setUser({
                user_id: data.user_id,
                user_type: data.user_type,
                role: data.role,
                email: userData.email
            });
            return data;
        } catch (error) {
            throw error;
        }
    };

    const registerRestaurant = async (restaurantData) => {
        try {
            const data = await authService.registerRestaurant(restaurantData);
            setUser({
                user_id: data.user_id,
                user_type: data.user_type,
                role: data.role,
                email: restaurantData.email
            });
            return data;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const value = {
        user,
        loading,
        login,
        logout,
        registerKunde,
        registerRestaurant,
        isAuthenticated: !!user,
        isRestaurant: user?.user_type === 'restaurant',
        isKunde: user?.user_type === 'kunde',
        isKritiker: user?.role === 'kritiker'
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom Hook für einfachen Zugriff
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth muss innerhalb von AuthProvider verwendet werden');
    }
    return context;
};

export default AuthContext;