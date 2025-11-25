// services/oeffnungszeitVorlageService.js
import apiClient from '../api/apiClient';

const oeffnungszeitVorlageService = {
  /**
   * Alle Öffnungszeit-Vorlagen abrufen
   * GET /api/oeffnungszeit-vorlagen
   */
  getAll: async () => {
    return await apiClient.get('/api/oeffnungszeit-vorlagen');
  },

  /**
   * Eine Öffnungszeit-Vorlage nach ID abrufen
   * GET /api/oeffnungszeit-vorlagen/{id}
   */
  getById: async (oeffnungszeitId) => {
    return await apiClient.get(`/api/oeffnungszeit-vorlagen/${oeffnungszeitId}`);
  },

  /**
   * Neue Öffnungszeit-Vorlage erstellen
   * POST /api/oeffnungszeit-vorlagen
   */
  create: async (vorlageData) => {
    return await apiClient.post('/api/oeffnungszeit-vorlagen', vorlageData);
  },

  /**
   * Öffnungszeit-Vorlage aktualisieren
   * PUT /api/oeffnungszeit-vorlagen/{id}
   */
  update: async (oeffnungszeitId, vorlageData) => {
    return await apiClient.put(`/api/oeffnungszeit-vorlagen/${oeffnungszeitId}`, vorlageData);
  },

  /**
   * Öffnungszeit-Vorlage löschen
   * DELETE /api/oeffnungszeit-vorlagen/{id}
   */
  delete: async (oeffnungszeitId) => {
    return await apiClient.delete(`/api/oeffnungszeit-vorlagen/${oeffnungszeitId}`);
  },
};

export default oeffnungszeitVorlageService;
