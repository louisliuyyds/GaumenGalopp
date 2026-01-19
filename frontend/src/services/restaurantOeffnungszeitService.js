import apiClient from '../api/apiClient';

const restaurantOeffnungszeitService = {
    /**
     * Alle Restaurant-Öffnungszeit-Zuordnungen abrufen
     * GET /api/restaurant-oeffnungszeit
     */
    getAll: async () => {
        return await apiClient.get('/api/restaurant-oeffnungszeit');
    },

    /**
     * Alle Öffnungszeiten eines Restaurants abrufen
     * GET /api/restaurant-oeffnungszeit/restaurant/{restaurant_id}
     */
    getForRestaurant: async (restaurantId) => {
        return await apiClient.get(`/api/restaurant-oeffnungszeit/restaurant/${restaurantId}`);
    },

    /**
     * Aktive Öffnungszeiten eines Restaurants abrufen (zeitbasiert)
     * GET /api/restaurant-oeffnungszeit/restaurant/{restaurant_id}/active
     */
    getActiveForRestaurant: async (restaurantId) => {
        return await apiClient.get(`/api/restaurant-oeffnungszeit/restaurant/${restaurantId}/active`);
    },

    /**
     * Aktuelle Öffnungszeiten eines Restaurants abrufen (zeitbasiert)
     * GET /api/restaurant-oeffnungszeit/restaurant/{restaurant_id}/current
     */
    getCurrentForRestaurant: async (restaurantId) => {
        return await apiClient.get(`/api/restaurant-oeffnungszeit/restaurant/${restaurantId}/current`);
    },

    /**
     * Neue Restaurant-Öffnungszeit-Zuordnung erstellen
     * POST /api/restaurant-oeffnungszeit
     */
    create: async (assignmentData) => {
        // Entferne ist_aktiv falls vorhanden (existiert nicht mehr)
        const { ist_aktiv, ...cleanData } = assignmentData;
        return await apiClient.post('/api/restaurant-oeffnungszeit', cleanData);
    },

    /**
     * Restaurant-Öffnungszeit-Zuordnung aktualisieren
     * PUT /api/restaurant-oeffnungszeit/{restaurant_id}/{oeffnungszeit_id}/{gueltig_von}
     */
    update: async (restaurantId, oeffnungszeitId, gueltigVon, updateData) => {
        // Entferne ist_aktiv falls vorhanden (existiert nicht mehr)
        const { ist_aktiv, ...cleanData } = updateData;
        return await apiClient.put(
            `/api/restaurant-oeffnungszeit/${restaurantId}/${oeffnungszeitId}/${gueltigVon}`,
            cleanData
        );
    },

    /**
     * Restaurant-Öffnungszeit-Zuordnung löschen
     * DELETE /api/restaurant-oeffnungszeit/{restaurant_id}/{oeffnungszeit_id}/{gueltig_von}
     */
    delete: async (restaurantId, oeffnungszeitId, gueltigVon) => {
        return await apiClient.delete(
            `/api/restaurant-oeffnungszeit/${restaurantId}/${oeffnungszeitId}/${gueltigVon}`
        );
    },
};

export default restaurantOeffnungszeitService;