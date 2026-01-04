// services/kritikerService.js
import apiClient from '../api/apiClient';

const kritikerService = {
  /**
   * Alle Kritiker abrufen
   * GET /api/kritikers
   */
  getAll: async () => {
    return await apiClient.get('/api/kritikers');
  },

  /**
   * Einen Kritiker nach ID abrufen
   * GET /api/kritikers/{id}
   */
  getById: async (kritikerId) => {
    return await apiClient.get(`/api/kritikers/${kritikerId}`);
  },

  /**
   * Kritiker eines Kunden abrufen
   * GET /api/kritikers/by-kunden/{kundenId}
   */
  getByKundenId: async (kundenId) => {
    return await apiClient.get(`/api/kritikers/by-kunden/${kundenId}`);
  },

  /**
   * Neuen Kritiker erstellen
   * POST /api/kritikers
   */
  create: async (kritikerData) => {
    return await apiClient.post('/api/kritikers', kritikerData);
  },

  /**
   * Kritiker aktualisieren
   * PUT /api/kritikers/{id}
   */
  update: async (kritikerId, kritikerData) => {
    return await apiClient.put(`/api/kritikers/${kritikerId}`, kritikerData);
  },

  /**
   * Kritiker löschen
   * DELETE /api/kritikers/{id}
   */
  delete: async (kritikerId) => {
    return await apiClient.delete(`/api/kritikers/${kritikerId}`);
  },
};

export default kritikerService;
