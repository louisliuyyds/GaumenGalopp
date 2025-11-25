// services/bestellungService.js
import apiClient from '../api/apiClient';

const bestellungService = {
  /**
   * Alle Bestellungen abrufen
   * GET /bestellungen
   */
  getAll: async () => {
    return await apiClient.get('/bestellungen');
  },

  /**
   * Eine Bestellung nach ID abrufen
   * GET /bestellungen/{id}
   */
  getById: async (bestellungId) => {
    return await apiClient.get(`/bestellungen/${bestellungId}`);
  },

  /**
   * Gesamtpreis einer Bestellung abrufen
   * GET /bestellungen/{id}/total
   */
  getTotal: async (bestellungId) => {
    return await apiClient.get(`/bestellungen/${bestellungId}/total`);
  },

  /**
   * Neue Bestellung erstellen
   * POST /bestellungen
   */
  create: async (bestellungData) => {
    return await apiClient.post('/bestellungen', bestellungData);
  },

  /**
   * Bestellung aktualisieren
   * PUT /bestellungen/{id}
   */
  update: async (bestellungId, bestellungData) => {
    return await apiClient.put(`/bestellungen/${bestellungId}`, bestellungData);
  },
};

export default bestellungService;
