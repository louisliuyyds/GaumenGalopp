// services/bestellpositionService.js
import apiClient from '../api/apiClient';

const bestellpositionService = {
  /**
   * Neue Bestellposition hinzufügen
   * POST /api/bestellpositionen
   */
  create: async (positionData) => {
    return await apiClient.post('/api/bestellpositionen', positionData);
  },

  /**
   * Alle Positionen einer Warenkorb abrufen
   * GET /api/bestellpositionen/bestellung/{bestellungid}
   */
  getByBestellung: async (bestellungId) => {
    return await apiClient.get(`/api/bestellpositionen/bestellung/${bestellungId}`);
  },

  /**
   * Bestellposition löschen
   * DELETE /api/bestellpositionen/{id}
   */
  delete: async (positionId) => {
    return await apiClient.delete(`/api/bestellpositionen/${positionId}`);
  },
};

export default bestellpositionService;
