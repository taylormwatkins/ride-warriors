import apiClient from "./apiClient";

export const deleteActivity = async (activityId) => {
    try {
        const response = await apiClient.post(`/activities/deleteActivity?activityId=${activityId}`);
        return response.data;
    } catch (error) {
        console.error('Error updating activity:', error.response || error);
        throw error;
    }
};
