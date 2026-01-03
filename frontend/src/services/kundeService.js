// services/kundeService.js
import apiClient from '../api/apiClient';

const kundeService = {
  /**
   * Alle Kunden abrufen
   * GET /api/kunden
   */
  getAll: async () => {
    return await apiClient.get('/api/kunden');
  },

  /**
   * Einen Kunden nach ID abrufen
   * GET /api/kunden/{id}
   */
  getById: async (kundenId) => {
    return await apiClient.get(`/api/kunden/${kundenId}`);
  },

  getAdressIdByKundenId: async (kundenId) => {
    const res = await apiClient.get(`/api/kunden/${kundenId}/adressid`);
    return res
  },

  /**
   * Neuen Kunden erstellen
   * POST /api/kunden
   */
  create: async (kundeData) => {
    return await apiClient.post('/api/kunden', kundeData);
  },

  /**
   * Kunde aktualisieren
   * PUT /api/kunden/{id}
   */
  update: async (kundenId, kundeData) => {
    return await apiClient.put(`/api/kunden/${kundenId}`, kundeData);
  },

  /**
   * Kunde löschen
   * DELETE /api/kunden/{id}
   */
  delete: async (kundenId) => {
    return await apiClient.delete(`/api/kunden/${kundenId}`);
  },

  /**
   * Kunde nach E-Mail suchen
   * GET /api/kunden/email/{email}
   */
  searchByEmail: async (email) => {
    return await apiClient.get(`/api/kunden/email/${email}`);
  },

  /**
   * Kunden nach Nachname suchen
   * GET /api/kunden/nachname/{nachname}
   */
  searchByNachname: async (nachname) => {
    return await apiClient.get(`/api/kunden/nachname/${nachname}`);
  },
};

export default kundeService;
