// services/bestellungService.js
import apiClient from '../api/apiClient';

const bestellungService = {
  /**
   * Alle Bestellungen abrufen
   * GET /api/bestellungen
   */
  getAll: async () => {
    return await apiClient.get('/api/bestellungen');
  },

  /**
   * Eine Bestellung nach ID abrufen
   * GET /api/bestellungen/{id}
   */
  getById: async (bestellungId) => {
    return await apiClient.get(`/api/bestellungen/${bestellungId}`);
  },

  /**
   * Gesamtpreis einer Bestellung abrufen
   * GET /api/bestellungen/{id}/total
   */
  getTotal: async (bestellungId) => {
    return await apiClient.get(`/api/bestellungen/${bestellungId}/total`);
  },

  /**
   * Neue Bestellung erstellen
   * POST /api/bestellungen
   */
  create: async (bestellungData) => {
    return await apiClient.post('/api/bestellungen', bestellungData);
  },

  /**
   * Bestellung aktualisieren
   * PUT /api/bestellungen/{id}
   */
  update: async (bestellungId, bestellungData) => {
    return await apiClient.put(`/api/bestellungen/${bestellungId}`, bestellungData);
  },
};

export default bestellungService;
