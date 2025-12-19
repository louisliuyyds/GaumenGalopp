import apiClient from '../api/apiClient';

const bestellungService = {

    getByKunde: async (kundenId) => {
        const response = await apiClient.get(
            `/api/bestellungen/kunde/${kundenId}`
        );
        console.log("API Response:", response);
        const data = response?.data || response;
        console.log("Extrahierte Daten:", data);
        return data;
    },

    getAll: async () => {
        const response = await apiClient.get('/api/bestellungen/');
        return response?.data || response;
    },

    getById: async (bestellungId) => {
        const response = await apiClient.get(`/api/bestellungen/${bestellungId}`);
        return response?.data || response;
    },

    // NEU: Hole Details für eine Bestellung
    getDetails: async (bestellungId) => {
        try {
            // Versuche zuerst den /details Endpunkt
            const response = await apiClient.get(`/api/bestellungen/${bestellungId}/details`);
            return response?.data || response;
        } catch (error) {
            // Falls /details nicht existiert, hole Daten separat
            console.log("Details-Endpunkt nicht verfügbar, hole Daten separat...");

            const [bestellung, total] = await Promise.all([
                apiClient.get(`/api/bestellungen/${bestellungId}`),
                apiClient.get(`/api/bestellungen/${bestellungId}/total`)
            ]);

            return {
                ...(bestellung?.data || bestellung),
                gesamtpreis: total?.data || total
            };
        }
    },

    getTotal: async (bestellungId) => {
        const response = await apiClient.get(`/api/bestellungen/${bestellungId}/total`);
        return response?.data || response;
    },

    create: async (bestellungData) => {
        const response = await apiClient.post('/api/bestellungen/', bestellungData);
        return response?.data || response;
    },

    update: async (bestellungId, bestellungData) => {
        const response = await apiClient.put(
            `/api/bestellungen/${bestellungId}`,
            bestellungData
        );
        return response?.data || response;
    },
};

export default bestellungService;