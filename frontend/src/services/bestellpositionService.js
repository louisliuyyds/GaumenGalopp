// services/bestellpositionService.js
import apiClient from '../api/apiClient';

const bestellpositionService = {
  /**
   * Neue Bestellposition hinzufügen
   * POST /bestellpositionen
   */
  create: async (positionData) => {
    return await apiClient.post('/bestellpositionen', positionData);
  },

  /**
   * Alle Positionen einer Bestellung abrufen
   * GET /bestellpositionen/bestellung/{bestellungid}
   */
  getByBestellung: async (bestellungId) => {
    return await apiClient.get(`/bestellpositionen/bestellung/${bestellungId}`);
  },

  /**
   * Bestellposition löschen
   * DELETE /bestellpositionen/{id}
   */
  delete: async (positionId) => {
    return await apiClient.delete(`/bestellpositionen/${positionId}`);
  },
};

export default bestellpositionService;
