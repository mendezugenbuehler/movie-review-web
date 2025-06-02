import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const movieService = {
    // Search movies
    searchMovies: async (query) => {
        try {
            const response = await axios.get(`${API_URL}/movies/search?query=${encodeURIComponent(query)}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get movie details
    getMovieDetails: async (movieId) => {
        try {
            const timestamp = new Date().getTime();
            const response = await axios.get(`${API_URL}/movies/${movieId}?t=${timestamp}`);
            const movieData = response.data;
            movieData.id = movieId;
            return movieData;
        } catch (error) {
            throw error;
        }
    },

    // Get movie recommendations
    getRecommendations: async (movieId) => {
        try {
            const response = await axios.get(`${API_URL}/movies/${movieId}/recommendations`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get popular movies
    getPopularMovies: async () => {
        try {
            const response = await axios.get(`${API_URL}/movies/popular`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}; 