// services/bewertungkritikerService.js
import apiClient from '../api/apiClient';

const bewertungkritikerService = {
  /**
   * Alle Kritiker-Bewertungen abrufen
   * GET /api/bewertungkritikers
   */
  getAll: async () => {
    return await apiClient.get('/api/bewertungkritikers');
  },

  /**
   * Eine Kritiker-Bewertung nach ID abrufen
   * GET /api/bewertungkritikers/{id}
   */
  getById: async (bewertungkritikerId) => {
    return await apiClient.get(`/api/bewertungkritikers/${bewertungkritikerId}`);
  },

  /**
   * Neue Kritiker-Bewertung erstellen
   * POST /api/bewertungkritikers
   */
  create: async (bewertungkritikerData) => {
    return await apiClient.post('/api/bewertungkritikers', bewertungkritikerData);
  },

  /**
   * Kritiker-Bewertung aktualisieren
   * PUT /api/bewertungkritikers/{id}
   */
  update: async (bewertungkritikerId, bewertungkritikerData) => {
    return await apiClient.put(`/api/bewertungkritikers/${bewertungkritikerId}`, bewertungkritikerData);
  },

  /**
   * Kritiker-Bewertung löschen
   * DELETE /api/bewertungkritikers/{id}
   */
  delete: async (bewertungkritikerId) => {
    return await apiClient.delete(`/api/bewertungkritikers/${bewertungkritikerId}`);
  },
};

export default bewertungkritikerService;
