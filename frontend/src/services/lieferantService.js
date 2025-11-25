// services/lieferantService.js
import apiClient from '../api/apiClient';

const lieferantService = {
  /**
   * Alle Lieferanten abrufen
   * GET /api/lieferanten
   */
  getAll: async () => {
    return await apiClient.get('/api/lieferanten');
  },

  /**
   * Neuen Lieferanten erstellen
   * POST /api/lieferanten
   */
  create: async (lieferantData) => {
    return await apiClient.post('/api/lieferanten', lieferantData);
  },

  /**
   * Lieferant aktualisieren
   * PUT /api/lieferanten/{id}
   */
  update: async (lieferantId, lieferantData) => {
    return await apiClient.put(`/api/lieferanten/${lieferantId}`, lieferantData);
  },

  /**
   * Lieferant löschen
   * DELETE /api/lieferanten/{id}
   */
  delete: async (lieferantId) => {
    return await apiClient.delete(`/api/lieferanten/${lieferantId}`);
  },
};

export default lieferantService;
