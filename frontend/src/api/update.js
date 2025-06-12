import apiClient from "./apiClient";



export const updateActivity = async (activity, activityId) => {
    try {
        const response = await apiClient.put(`/activities/updateActivity?activityId=${activityId}`, activity);
        console.log("response from updateActivity:", response);
        return response.data;
    } catch (error) {
        console.error('Error updating activity:', error.response || error);
        throw error;
    }
};


export const updateMeal = async (meal, activityId) => {
    try {
        const response = await apiClient.put(`/meals/updateMeal?activityId=${activityId}`, meal);
        return response.data;
    } catch (error) {
        console.error('Error updating meal:', error.response || error);
        throw error;
    }
};