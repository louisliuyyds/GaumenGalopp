// services/kundeService.js
import apiClient from '../api/apiClient';

const BASE_PATH = '/api/kunde';

const kundeService = {
  /**
   * Alle Kunden abrufen
   * GET /api/kunde
   */
  getAll: async () => {
    return await apiClient.get(`${BASE_PATH}`);
  },

  /**
   * Einen Kunden nach ID abrufen
   * GET /api/kunde/{id}
   */
  getById: async (kundenId) => {
    return await apiClient.get(`${BASE_PATH}/${kundenId}`);
  },

  getAdressIdByKundenId: async (kundenId) => {
    const res = await apiClient.get(`/api/kunden/${kundenId}/adressid`);
    return res.data
  },

  getKuerzelById: async (kundenId) => {
    return await apiClient.get(`/api/kunde/getKuerzelById/${kundenId}`);
  },

  /**
   * Neuen Kunden erstellen
   * POST /api/kunde
   */
  create: async (kundeData) => {
    return await apiClient.post(`${BASE_PATH}`, kundeData);
  },

  /**
   * Kunde aktualisieren
   * PUT /api/kunde/{id}
   */
  update: async (kundenId, kundeData) => {
    return await apiClient.put(`${BASE_PATH}/${kundenId}`, kundeData);
  },

  /**
   * Kunde löschen
   * DELETE /api/kunde/{id}
   */
  delete: async (kundenId) => {
    return await apiClient.delete(`${BASE_PATH}/${kundenId}`);
  },

  /**
   * Kunde nach E-Mail suchen
   * GET /api/kunde/email/{email}
   */
  searchByEmail: async (email) => {
    return await apiClient.get(`${BASE_PATH}/email/${email}`);
  },

  /**
   * Kunden nach Nachname suchen
   * GET /api/kunde/nachname/{nachname}
   */
  searchByNachname: async (nachname) => {
    return await apiClient.get(`${BASE_PATH}/nachname/${nachname}`);
  },

  /**
   * Profil eines Nutzer laden (inkl. Adresse)
   * GET /api/kunde/{id}/profil
   */
  getProfile: async (kundenId) => {
    return await apiClient.get(`${BASE_PATH}/${kundenId}/profil`);
  },

  /**
   * Profil eines Nutzer aktualisieren (inkl. Adresse)
   * PUT /api/kunde/{id}/profil
   */
  updateProfile: async (kundenId, profileData) => {
    return await apiClient.put(`${BASE_PATH}/${kundenId}/profil`, profileData);
  },

  /**
   * Demo-Endpunkte für aktuellen Nutzer
   */
  getCurrentProfile: async () => {
    return await apiClient.get(`${BASE_PATH}/me`);
  },
  updateCurrentProfile: async (profileData) => {
    return await apiClient.put(`${BASE_PATH}/me`, profileData);
  },
};

export default kundeService;
