import apiClient from "./apiClient";


export const login = async (name) => {
    try {
        const response = await apiClient.post('/users/login', { name });
        return response;
    } catch (error) {
        console.error('Error logging in:', error.response || error);
        throw error;
    }
}

export const createNewUser = async (name) => {
    try {
        const response = await apiClient.post('/users/newUser', { name });
        return response;
    } catch (error) {
        console.error('Error creating new user:', error.response || error);
        throw error;
    }
}

// // check if user is logged in
// export const checkUserSession = async () => {
//     try {
//         const response = await apiClient.get(`/users/checkSession`);
//         return response;
//     } catch (error) {
//         console.error('Error checking user session:', error.response || error);
//         throw error;
//     }
// };

export const userLogout = async () => {
    try {
        const response = await apiClient.post(`/users/logout`);
        return response;
    } catch (error) {
        console.error('Error logging out:', error.response || error);
        throw error;
    }
};