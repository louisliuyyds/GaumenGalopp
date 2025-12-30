// services/warenkorbService.js
import apiClient from '../api/apiClient';

export const warenkorbService = {
    // Get cart
    getCart: async (kundenid) => {
        const response = await apiClient.get(`/warenkorb/${kundenid}`);
        return response.data;
    },

    // Add item
    addItem: async (kundenid, item) => {
        const response = await apiClient.post(`/warenkorb/${kundenid}/items`, item);
        return response.data;
    },

    // Update quantity
    updateQuantity: async (kundenid, positionid, menge) => {
        const response = await apiClient.put(
            `/warenkorb/${kundenid}/items/${positionid}/quantity`,
            { menge }
        );
        return response.data;
    },

    // Update notes
    updateNotes: async (kundenid, positionid, aenderungswunsch) => {
        const response = await apiClient.put(
            `/warenkorb/${kundenid}/items/${positionid}/notes`,
            { aenderungswunsch }
        );
        return response.data;
    },

    // Remove item
    removeItem: async (kundenid, positionid) => {
        const response = await apiClient.delete(`/warenkorb/${kundenid}/items/${positionid}`);
        return response.data;
    },

    // Clear cart
    clearCart: async (kundenid) => {
        const response = await apiClient.delete(`/warenkorb/${kundenid}/clear`);
        return response.data;
    },

    // Checkout
    checkout: async (kundenid, checkoutData) => {
        const response = await apiClient.post(`/warenkorb/${kundenid}/checkout`, checkoutData);
        return response.data;
    }
};