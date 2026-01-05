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
   * Eine Warenkorb nach ID abrufen
   * GET /api/bestellungen/{id}
   */
  getById: async (bestellungId) => {
    return await apiClient.get(`/api/bestellungen/${bestellungId}`);
  },

  /**
   * Gesamtpreis einer Warenkorb abrufen
   * GET /api/bestellungen/{id}/total
   */
  getTotal: async (bestellungId) => {
    return await apiClient.get(`/api/bestellungen/${bestellungId}/total`);
  },
  // NEU: Hole Details für eine Bestellung
    getDetails: async (bestellungId) => {
        try {
            // Versuche zuerst den /details Endpunkt
            const response = await apiClient.get(`/api/bestellungen/${bestellungId}/details`);
            return response?.data || response;
        } catch (error) {
            // Falls /details nicht existiert, hole Daten separat
            console.log("Details-Endpunkt nicht verfügbar, hole Daten separat...");

            const [bestellung, total] = await Promise.all([
                apiClient.get(`/api/bestellungen/${bestellungId}`),
                apiClient.get(`/api/bestellungen/${bestellungId}/total`)
            ]);

            return {
                ...(bestellung?.data || bestellung),
                gesamtpreis: total?.data || total
            };
        }
    },

  /**
   * Neue Warenkorb erstellen
   * POST /api/bestellungen
   */
  create: async (bestellungData) => {
    return await apiClient.post('/api/bestellungen', bestellungData);
  },

  /**
   * Warenkorb aktualisieren
   * PUT /api/bestellungen/{id}
   */
  update: async (bestellungId, bestellungData) => {
    return await apiClient.put(`/api/bestellungen/${bestellungId}`, bestellungData);
  },
};

export default bestellungService;