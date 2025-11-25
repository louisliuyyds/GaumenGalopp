// services/bewertungService.js
import apiClient from '../api/apiClient';

const bewertungService = {
  /**
   * Alle Bewertungen abrufen
   * GET /api/bewertungen
   */
  getAll: async () => {
    return await apiClient.get('/api/bewertungen');
  },

  /**
   * Eine Bewertung nach ID abrufen
   * GET /api/bewertungen/{id}
   */
  getById: async (bewertungId) => {
    return await apiClient.get(`/api/bewertungen/${bewertungId}`);
  },

  /**
   * Neue Bewertung erstellen
   * POST /api/bewertungen
   */
  create: async (bewertungData) => {
    return await apiClient.post('/api/bewertungen', bewertungData);
  },

  /**
   * Bewertung aktualisieren
   * PUT /api/bewertungen/{id}
   */
  update: async (bewertungId, bewertungData) => {
    return await apiClient.put(`/api/bewertungen/${bewertungId}`, bewertungData);
  },

  /**
   * Bewertung löschen
   * DELETE /api/bewertungen/{id}
   */
  delete: async (bewertungId) => {
    return await apiClient.delete(`/api/bewertungen/${bewertungId}`);
  },
};

export default bewertungService;
