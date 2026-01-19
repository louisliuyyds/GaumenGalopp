import axios from 'axios';

const API_URL = 'http://localhost:8000/api/auth';

class AuthService {
    /**
     * Login für Kunde oder Restaurant
     * @param {string} type - "kunde" oder "restaurant"
     * @param {string} email
     * @param {string} password
     * @returns {Promise} - Response mit Token und User-Daten
     */
    async login(type, email, password) {
        const response = await axios.post(`${API_URL}/login`, {
            type,
            email,
            password
        });

        if (response.data.access_token) {
            // Token und User-Daten im localStorage speichern
            localStorage.setItem('access_token', response.data.access_token);
            localStorage.setItem('user_type', response.data.user_type);
            localStorage.setItem('user_id', response.data.user_id);
            localStorage.setItem('role', response.data.role);
        }

        return response.data;
    }

    /**
     * Kunde registrieren
     */
    async registerKunde(userData) {
        const response = await axios.post(`${API_URL}/register`, userData);

        if (response.data.access_token) {
            localStorage.setItem('access_token', response.data.access_token);
            localStorage.setItem('user_type', response.data.user_type);
            localStorage.setItem('user_id', response.data.user_id);
            localStorage.setItem('role', response.data.role);
        }

        return response.data;
    }

    /**
     * Restaurant registrieren
     */
    async registerRestaurant(restaurantData) {
        const response = await axios.post(`${API_URL}/register/restaurant`, restaurantData);

        if (response.data.access_token) {
            localStorage.setItem('access_token', response.data.access_token);
            localStorage.setItem('user_type', response.data.user_type);
            localStorage.setItem('user_id', response.data.user_id);
            localStorage.setItem('role', response.data.role);
        }

        return response.data;
    }

    /**
     * Logout - Entfernt alle Daten aus localStorage
     */
    logout() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_type');
        localStorage.removeItem('user_id');
        localStorage.removeItem('role');
    }

    /**
     * Hole aktuelle User-Info vom Backend
     * @returns {Promise} - User-Daten
     */
    async getCurrentUser() {
        const token = this.getToken();
        if (!token) {
            throw new Error('Nicht eingeloggt');
        }

        const response = await axios.get(`${API_URL}/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        return response.data;
    }

    /**
     * Gibt den aktuellen Token zurück
     */
    getToken() {
        return localStorage.getItem('access_token');
    }

    /**
     * Prüft ob User eingeloggt ist
     */
    isAuthenticated() {
        return !!this.getToken();
    }

    /**
     * Gibt den User-Type zurück ("kunde" oder "restaurant")
     */
    getUserType() {
        return localStorage.getItem('user_type');
    }

    /**
     * Gibt die User-ID zurück
     */
    getUserId() {
        return localStorage.getItem('user_id');
    }

    /**
     * Gibt die Rolle zurück ("kunde", "kritiker" oder "restaurant")
     */
    getRole() {
        return localStorage.getItem('role');
    }

    /**
     * Prüft ob User ein Restaurant ist
     */
    isRestaurant() {
        return this.getUserType() === 'restaurant';
    }

    /**
     * Prüft ob User ein Kunde ist
     */
    isKunde() {
        return this.getUserType() === 'kunde';
    }

    /**
     * Prüft ob User ein Kritiker ist
     */
    isKritiker() {
        return this.getRole() === 'kritiker';
    }
}

export default new AuthService();