import axios from 'axios';

const API_KEY = 'C892hps6JKh2xVDPeAuMxJa3LsmDfb2uINi35zPK9RoCblckJwiNsNvR';
const BASE_URL = 'https://api.pexels.com/v1/search';

export const fetchImages = async (query) => {
    try {
        const response = await axios.get(BASE_URL, {
            headers: { Authorization: API_KEY },
            params: { query, per_page: 12 },
        });
        return response.data.photos;
    } catch (error) {
        console.error('Error fetching images:', error);
        return [];
    }
};
