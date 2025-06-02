import { movieService } from './movieService';

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/reviews`;

const index = async () => {
    try {
        const res = await fetch(BASE_URL, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        return res.json();
    } catch (error) {
        console.log(error);
    }
};

const show = async (reviewId) => {
    try {
        const res = await fetch(`${BASE_URL}/${reviewId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        return res.json();
    } catch (error) {
        console.log(error);
    }
};

const create = async (reviewFormData) => {
    try {
        const res = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reviewFormData),
        });
        return res.json();
    } catch (error) {
        console.log(error);
    }
};

const deleteReview = async (reviewId) => {
    try {
        const res = await fetch(`${BASE_URL}/${reviewId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return res.json();
    } catch (error) {
        console.log(error);
    }
};

async function update(hootId, hootFormData) {
    try {
        const res = await fetch(`${BASE_URL}/${hootId}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(hootFormData),
        });
        return res.json();
    } catch (error) {
        console.log(error);
    }
}

const createComment = async (reviewId, commentFormData) => {
    try {
        const res = await fetch(`${BASE_URL}/${reviewId}/comments`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(commentFormData),
        });
        return res.json();
    } catch (error) {
        console.log(error);
    }
};

const deleteComment = async (reviewId, commentId) => {
    try {
        const res = await fetch(`${BASE_URL}/${reviewId}/comments/${commentId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return res.json();
    } catch (error) {
        console.log(error);
    }
};

const updateComment = async (reviewId, commentId, commentFormData) => {
    try {
        const res = await fetch(`${BASE_URL}/${reviewId}/comments/${commentId}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(commentFormData),
        });
        return res.json();
    } catch (error) {
        console.log(error);
    }
};

const getReviewsByMovieId = async (movieId) => {
    try {
        // First get all reviews
        const allReviews = await index();
        console.log('All reviews:', allReviews);

        // Get the movie title from the current movie
        const movieData = await movieService.getMovieDetails(movieId);
        const movieTitle = movieData.title;
        console.log('Looking for reviews matching:', { movieId, movieTitle });

        // Filter reviews that match either the tmdbId or the movie title
        const matchingReviews = allReviews.filter(review => {
            console.log('Checking review:', review);
            return review.tmdbId === movieId || review.movie === movieTitle;
        });

        console.log('Matching reviews:', matchingReviews);
        return matchingReviews;
    } catch (error) {
        console.log('Error in getReviewsByMovieId:', error);
        return [];
    }
};

export {
    index,
    show,
    create,
    deleteReview,
    update,
    createComment,
    deleteComment,
    updateComment,
    getReviewsByMovieId,
};