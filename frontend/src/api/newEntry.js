import apiClient from "./apiClient";


// all the add new methods
// this will also be changed when i fix the api responses

export const addAttraction = async (attraction) => {
    try {
        const response = await apiClient.post('/attractions/add', attraction);
        return response.data;
    } catch (error) {
        console.error('Error adding attraction:', error.response || error);
        throw error;
    }
};

export const addFoodItem = async (foodItem, attractionId) => {
    try {
        const response = await apiClient.post(`/fooditems/add?attractionId=${attractionId}`, foodItem);
        return response.data;
    } catch (error) {
        console.error('Error adding food item:', error.response || error);
        throw error;
    }
};

export const addMeal = async (meal, activityId) => {
    try {
        const response = await apiClient.post(`/meals/add?activityId=${activityId}`, meal);
        return response.data;
    } catch (error) {
        console.error('Error adding meal:', error.response || error);
        throw error;
    }
};


export const addActivity = async (activity, visitId) => {
    try {
        const response = await apiClient.post(`/activities/add?visitId=${visitId}`, activity);
        return response.data;
    } catch (error) {
        console.error('Error adding activity:', error.response || error);
        throw error;
    }
};

export const addVisit = async (visit, userId) => {
    try {
        const response = await apiClient.post(`/visits/add?userId=${userId}`, visit);
        return response.data;
    } catch (error) {
        console.error('Error adding visit:', error.response || error);
        throw error;
    }
};
