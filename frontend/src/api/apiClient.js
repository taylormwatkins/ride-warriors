
import axios from 'axios';

const BASE_URL = 'https://ridewarriors-backend-144195073722.us-central1.run.app/api/'; 


const apiClient = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,  
});


export default apiClient;
