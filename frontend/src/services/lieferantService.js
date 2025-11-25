// services/lieferantService.js
import apiClient from '../api/apiClient';

const lieferantService = {
  /**
   * Alle Lieferanten abrufen
   * GET /lieferanten
   */
  getAll: async () => {
    return await apiClient.get('/lieferanten');
  },

  /**
   * Neuen Lieferanten erstellen
   * POST /lieferanten
   */
  create: async (lieferantData) => {
    return await apiClient.post('/lieferanten', lieferantData);
  },

  /**
   * Lieferant aktualisieren
   * PUT /lieferanten/{id}
   */
  update: async (lieferantId, lieferantData) => {
    return await apiClient.put(`/lieferanten/${lieferantId}`, lieferantData);
  },

  /**
   * Lieferant löschen
   * DELETE /lieferanten/{id}
   */
  delete: async (lieferantId) => {
    return await apiClient.delete(`/lieferanten/${lieferantId}`);
  },
};

export default lieferantService;
