// services/warenkorbService.js
import apiClient from '../api/apiClient';

export const warenkorbService = {
    // Get cart
    getCart: async (kundenid) => {
        console.log('API call: GET /warenkorb/' + kundenid); // ← ADD THIS
        const response = await apiClient.get(`/api/warenkorb/${kundenid}`);
        console.log('API response:', response); // ← ADD THIS
        return response;
    },

    // Add item
    addItem: async (kundenid, item) => {
        const response = await apiClient.post(`/api/warenkorb/${kundenid}/items`, item);
        return response;
    },

    // Update quantity
    updateQuantity: async (kundenid, positionid, menge) => {
        const response = await apiClient.put(
            `/api/warenkorb/${kundenid}/items/${positionid}/quantity`,
            { menge }
        );
        return response;
    },

    // Update notes
    updateNotes: async (kundenid, positionid, aenderungswunsch) => {
        const response = await apiClient.put(
            `/api/warenkorb/${kundenid}/items/${positionid}/notes`,
            { aenderungswunsch }
        );
        return response;
    },

    // Remove item
    removeItem: async (kundenid, positionid) => {
        const response = await apiClient.delete(`/api/warenkorb/${kundenid}/items/${positionid}`);
        return response;
    },

    // Clear cart
    clearCart: async (kundenid) => {
        const response = await apiClient.delete(`/api/warenkorb/${kundenid}/clear`);
        return response;
    },

    // Checkout
    checkout: async (kundenid, checkoutData) => {
        const response = await apiClient.post(`/api/warenkorb/${kundenid}/checkout`, checkoutData);
        return response;
    }
};