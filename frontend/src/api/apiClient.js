// api/apiClient.js
import axios from 'axios';

// Basis-URL deines Backends - anpassen falls nötig
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Axios-Instanz erstellen
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 Sekunden Timeout
});

// Request Interceptor - wird vor jedem Request ausgeführt
apiClient.interceptors.request.use(
  (config) => {
    // Hier könntest du z.B. einen Auth-Token hinzufügen
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Request-Logging für Debugging
    console.log(`🚀 ${config.method.toUpperCase()} ${config.url}`);
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor - wird nach jedem Response ausgeführt
apiClient.interceptors.response.use(
  (response) => {
    // Erfolgreiche Response
    console.log(`✅ ${response.config.method.toUpperCase()} ${response.config.url} - Status: ${response.status}`);
    return response.data;
  },
  (error) => {
    // Fehlerbehandlung
    console.error('❌ Response Error:', error);
    
    if (error.response) {
      // Server hat mit Fehlercode geantwortet
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          console.error('Nicht autorisiert - bitte einloggen');
          // Optional: Redirect zu Login-Seite
          // window.location.href = '/login';
          break;
        case 403:
          console.error('Zugriff verweigert');
          break;
        case 404:
          console.error('Ressource nicht gefunden');
          break;
        case 422:
          console.error('Validierungsfehler:', data.detail);
          break;
        case 500:
          console.error('Serverfehler');
          break;
        default:
          console.error(`Fehler ${status}:`, data);
      }
      
      // Benutzerfreundliche Fehlermeldung
      const errorMessage = data?.detail || data?.message || 'Ein Fehler ist aufgetreten';
      const normalizedError = new Error(errorMessage);
      normalizedError.status = status;
      normalizedError.details = data;
      return Promise.reject(normalizedError);
    } else if (error.request) {
      // Request wurde gesendet, aber keine Antwort erhalten
      console.error('Keine Antwort vom Server erhalten');
      return Promise.reject(new Error('Server ist nicht erreichbar'));
    } else {
      // Fehler beim Erstellen des Requests
      console.error('Request-Fehler:', error.message);
      return Promise.reject(error);
    }
  }
);

export default apiClient;
