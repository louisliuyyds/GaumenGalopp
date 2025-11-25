// services/adresseService.js
import apiClient from '../api/apiClient';

const adresseService = {
  /**
   * Alle Adressen abrufen
   * GET /api/adresse
   */
  getAll: async () => {
    return await apiClient.get('/api/adresse');
  },

  /**
   * Eine Adresse nach ID abrufen
   * GET /api/adresse/{id}
   */
  getById: async (adresseId) => {
    return await apiClient.get(`/api/adresse/${adresseId}`);
  },

  /**
   * Neue Adresse erstellen
   * POST /api/adresse
   */
  create: async (adresseData) => {
    return await apiClient.post('/api/adresse', adresseData);
  },

  /**
   * Adresse aktualisieren
   * PUT /api/adresse/{id}
   */
  update: async (adresseId, adresseData) => {
    return await apiClient.put(`/api/adresse/${adresseId}`, adresseData);
  },

  /**
   * Adresse löschen
   * DELETE /api/adresse/{id}
   */
  delete: async (adresseId) => {
    return await apiClient.delete(`/api/adresse/${adresseId}`);
  },

  /**
   * Adressen nach PLZ suchen
   * GET /api/adresse/plz/{postleitzahl}
   */
  searchByPlz: async (postleitzahl) => {
    return await apiClient.get(`/api/adresse/plz/${postleitzahl}`);
  },
};

export default adresseService;
