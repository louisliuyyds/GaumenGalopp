// services/oeffnungszeitDetailService.js - KORRIGIERTE VERSION
import apiClient from '../api/apiClient';

const oeffnungszeitDetailService = {
    /**
     * Alle Öffnungszeit-Details abrufen
     * GET /api/oeffnungszeit-details
     */
    getAll: async () => {
        return await apiClient.get('/api/oeffnungszeit-details');
    },

    /**
     * Ein Öffnungszeit-Detail nach ID abrufen
     * GET /api/oeffnungszeit-details/{id}
     */
    getById: async (detailId) => {
        return await apiClient.get(`/api/oeffnungszeit-details/${detailId}`);
    },

    /**
     * Details für eine Vorlage abrufen
     * GET /api/oeffnungszeit-details/vorlage/{oeffnungszeit_id}
     */
    getByVorlageId: async (oeffnungszeitId) => {
        return await apiClient.get(`/api/oeffnungszeit-details/vorlage/${oeffnungszeitId}`);
    },

    /**
     * Neues Öffnungszeit-Detail erstellen
     * POST /api/oeffnungszeit-details
     */
    create: async (detailData) => {
        return await apiClient.post('/api/oeffnungszeit-details', detailData);
    },

    /**
     * Öffnungszeit-Detail aktualisieren
     * PUT /api/oeffnungszeit-details/{id}
     */
    update: async (detailId, detailData) => {
        return await apiClient.put(`/api/oeffnungszeit-details/${detailId}`, detailData);
    },

    /**
     * Öffnungszeit-Detail löschen
     * DELETE /api/oeffnungszeit-details/{id}
     */
    delete: async (detailId) => {
        return await apiClient.delete(`/api/oeffnungszeit-details/${detailId}`);
    },
};

export default oeffnungszeitDetailService;