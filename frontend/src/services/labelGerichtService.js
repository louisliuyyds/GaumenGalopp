// services/labelGerichtService.js
import apiClient from '../api/apiClient';

const labelGerichtService = {
  /**
   * Label-Gericht-Zuordnungen nach Label-ID abrufen
   * GET /labelGericht/byLabelId/{labelid}
   */
  getByLabelId: async (labelId) => {
    return await apiClient.get(`/labelGericht/byLabelId/${labelId}`);
  },

  /**
   * Label-Gericht-Zuordnungen nach Gericht-ID abrufen
   * GET /labelGericht/byGerichtId/{gerichtid}
   */
  getByGerichtId: async (gerichtId) => {
    return await apiClient.get(`/labelGericht/byGerichtId/${gerichtId}`);
  },

  /**
   * Neue Label-Gericht-Zuordnung erstellen
   * POST /labelGericht
   */
  create: async (labelGerichtData) => {
    return await apiClient.post('/labelGericht', labelGerichtData);
  },

  /**
   * Label-Gericht-Zuordnung löschen
   * DELETE /labelGericht/{gerichtid}/{labelid}
   */
  delete: async (gerichtId, labelId) => {
    return await apiClient.delete(`/labelGericht/${gerichtId}/${labelId}`);
  },
};

export default labelGerichtService;
