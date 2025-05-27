import apiClient from "./apiClient";

// all the get methods
// this will need to be adjusted when i fix them to return http response codes

export const getAllAttractions = async () => {
    try {
        const response = await apiClient.get(`/attractions/all`);
        return response.data;
    } catch (error) {
        console.error('Error fetching all attractions:', error.response || error);
        throw error;
    }
};

export const getAllVisits = async () => {
    try {
        const response = await apiClient.get(`/visits/all`);
        return response.data;
    } catch (error) {
        console.error('Error fetching all visits:', error.response || error);
        throw error;
    }
};

export const getAllUsers = async () => {
    try {
        const response = await apiClient.get('/users/all');
        return response.data;
    } catch (error) {
        console.error('Error fetching all users:', error.response || error);
        throw error;
    }
};

export const getAttractionsByType = async (type) => {
    try {
        const response = await apiClient.get(`/attractions/getByType?type=${type}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching attraction by type:', error.response || error);
        throw error;
    }
};

export const getFoodByAttraction = async (attractionId) => {
    try {
        const response = await apiClient.get(`/fooditems/getByAttraction?attractionId=${attractionId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching food items by attraction:', error.response || error);
        throw error;
    }
};

export const getVisitByDate = async (userId, date) => {
    try {
        const response = await apiClient.post(`/visits/getByDate?userId=${userId}`, { date });
        return response.data;
    } catch (error) {
        console.error('Error changing date:', error.response || error);
        throw error;
    }
};

export const getActivitiesByVisit = async (visitId) => {
    try {
        const response = await apiClient.get(`/activities/getByVisit?visitId=${visitId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching activities by visit:', error.response || error);
        throw error;
    }
};
