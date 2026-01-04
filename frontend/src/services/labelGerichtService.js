// services/labelGerichtService.js
import apiClient from '../api/apiClient';

const labelGerichtService = {


getAll: async (labelId) => {
  return await apiClient.get(`/api/labelGericht/}`);
},

getByLabelId: async (labelId) => {
  return await apiClient.get(`/api/labelGericht/byLabelId/${labelId}`);
},

getByGerichtId: async (gerichtId) => {
  return await apiClient.get(`/api/labelGericht/byGerichtId/${gerichtId}`);
},

delete: async (gerichtId, labelId) => {
  return await apiClient.delete(`/api/labelGericht/${gerichtId}/${labelId}`);
},
};

export default labelGerichtService;
