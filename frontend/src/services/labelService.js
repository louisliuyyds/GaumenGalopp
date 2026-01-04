// services/labelService.js
import apiClient from '../api/apiClient';

const labelService = {
getById: async (labelId) => {
  return await apiClient.get(`/api/label/${labelId}`);
},

getByGerichtId: async (gerichtId) => {
  return await apiClient.get(`/api/label/byGerichtId/${gerichtId}`);
},

update: async (labelId, labelData) => {
  return await apiClient.put(`/api/label/${labelId}`, labelData);
},

delete: async (labelId) => {
  return await apiClient.delete(`/api/label/${labelId}`);
},
};

export default labelService;
