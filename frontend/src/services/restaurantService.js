// services/restaurantService.js
import apiClient from '../api/apiClient';

const restaurantService = {
    /**
     * Alle Restaurants abrufen
     * GET /api/restaurants
     */
    getAll: async () => {
        return await apiClient.get('/api/restaurants');
    },

    /**
     * Ein Restaurant nach ID abrufen (mit Menü und Adresse)
     * GET /api/restaurants/{id}
     */
    getById: async (restaurantId) => {
        return await apiClient.get(`/api/restaurants/${restaurantId}`);
    },

    /**
     * Neues Restaurant erstellen
     * POST /api/restaurants
     */
    create: async (restaurantData) => {
        return await apiClient.post('/api/restaurants', restaurantData);
    },

    /**
     * Restaurant aktualisieren
     * PUT /api/restaurants/{id}
     */
    update: async (restaurantId, restaurantData) => {
        return await apiClient.put(`/api/restaurants/${restaurantId}`, restaurantData);
    },

    /**
     * Restaurant löschen
     * DELETE /api/restaurants/{id}
     */
    delete: async (restaurantId) => {
        return await apiClient.delete(`/api/restaurants/${restaurantId}`);
    },

    /**
     * Restaurant-Profil mit Adresse abrufen
     * GET /api/restaurants/{id}/profil
     */
    getProfile: async (restaurantId) => {
        return await apiClient.get(`/api/restaurants/${restaurantId}/profil`);
    },

    /**
     * Restaurant-Profil mit Adresse aktualisieren
     * PUT /api/restaurants/{id}/profil
     */
    updateProfile: async (restaurantId, profileData) => {
        return await apiClient.put(`/api/restaurants/${restaurantId}/profil`, profileData);
    },

    /**
     * Öffnungszeiten eines Restaurants abrufen
     * GET /api/restaurants/{id}/oeffnungszeiten
     */
    getOpeningHours: async (restaurantId) => {
        return await apiClient.get(`/api/restaurants/${restaurantId}/oeffnungszeiten`);
    },

    /**
     * Öffnungszeiten eines Restaurants aktualisieren
     * PUT /api/restaurants/{id}/oeffnungszeiten
     */
    updateOpeningHours: async (restaurantId, openingData) => {
        return await apiClient.put(`/api/restaurants/${restaurantId}/oeffnungszeiten`, openingData);
    },

    // ===== NEUE BEWERTUNGS-METHODEN =====

    /**
     * Aggregierte Bewertungen eines Restaurants abrufen
     * Kombiniert Kunden- und Kritiker-Bewertungen
     * GET /api/restaurants/{id}/bewertungen-gesamt
     */
    getRestaurantBewertungen: async (restaurantId) => {
        return await apiClient.get(`/api/restaurants/${restaurantId}/bewertungen-gesamt`);
    },

    /**
     * Top 5 Gerichte mit höchsten Kritiker-Bewertungen
     * GET /api/restaurants/{id}/kritiker-highlights
     */
    getKritikerHighlights: async (restaurantId) => {
        return await apiClient.get(`/api/restaurants/${restaurantId}/kritiker-highlights`);
    },

    /**
     * Top 5 Gerichte mit höchsten Kunden-Bewertungen inkl. Kommentare
     * GET /api/restaurants/{id}/customer-favorites
     */
    getCustomerFavorites: async (restaurantId) => {
        return await apiClient.get(`/api/restaurants/${restaurantId}/customer-favorites`);
    },
};

export default restaurantService;