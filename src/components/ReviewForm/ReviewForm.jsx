import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import * as reviewService from '../../services/reviewService';
import * as reviewService from '../../services/reviewService';

const ReviewForm = (props) => {
    const { reviewId } = useParams(); // Get reviewId for editing mode

    const [formData, setFormData] = useState({
        reviewTitle: '',
        movie: '',
        director: '',
        genre: 'Action',
        rating: '⭐️',
    });

    const handleChange = (evt) => {
        setFormData({ ...formData, [evt.target.name]: evt.target.value });
    };

    const handleSubmit = (evt) => {
        evt.preventDefault();
        if (reviewId) {
            props.handleUpdateReview(reviewId, formData);
        } else {
            props.handleAddReview(formData);
        }
    };

    useEffect(() => {
        const fetchReview = async () => {
            try {
                const reviewData = await reviewService.show(reviewId);
                setFormData({
                    reviewTitle: reviewData.reviewTitle || '',
                    movie: reviewData.movie || '',
                    director: reviewData.director || '',
                    genre: reviewData.genre || 'Action',
                    rating: reviewData.rating || '⭐️',
                });
            } catch (error) {
                console.error('Error fetching review:', error);
            }
        };

        if (reviewId) fetchReview();

        // Cleanup function to reset the form
        return () => {
            setFormData({
                reviewTitle: '',
                movie: '',
                director: '',
                genre: 'Action',
                rating: '⭐️',
            });
        };
    }, [reviewId]);

    return (
        <main>
            <h1>{reviewId ? 'Edit Review' : 'New Review'}</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor='reviewTitle-input'>Review Title</label>
                <input
                    required
                    type='text'
                    name='reviewTitle'
                    id='reviewTitle-input'
                    value={formData.reviewTitle}
                    onChange={handleChange}
                />

                <label htmlFor='movie-input'>Movie</label>
                <input
                    required
                    type='text'
                    name='movie'
                    id='movie-input'
                    value={formData.movie}
                    onChange={handleChange}
                />

                <label htmlFor='director-input'>Director</label>
                <input
                    required
                    type='text'
                    name='director'
                    id='director-input'
                    value={formData.director}
                    onChange={handleChange}
                />

                <label htmlFor='genre-input'>Genre</label>
                <select
                    required
                    name='genre'
                    id='genre-input'
                    value={formData.genre}
                    onChange={handleChange}
                >
                    <option value='Action'>Action</option>
                    <option value='Animation'>Animation</option>
                    <option value='Comedy'>Comedy</option>
                    <option value='Drama'>Drama</option>
                    <option value='Fantasy'>Fantasy</option>
                    <option value='Mystery'>Mystery</option>
                    <option value='Science Fiction'>Science Fiction</option>
                </select>

                <label htmlFor='rating-input'>Rating</label>
                <select
                    required
                    name='rating'
                    id='rating-input'
                    value={formData.rating}
                    onChange={handleChange}
                >
                    <option value='⭐️'>⭐️</option>
                    <option value='⭐️⭐️'>⭐️⭐️</option>
                    <option value='⭐️⭐️⭐️'>⭐️⭐️⭐️</option>
                    <option value='⭐️⭐️⭐️⭐️'>⭐️⭐️⭐️⭐️</option>
                    <option value='⭐️⭐️⭐️⭐️⭐️'>⭐️⭐️⭐️⭐️⭐️</option>
                </select>

                <button type='submit'>SUBMIT</button>
            </form>
        </main>
    );
};

export default ReviewForm;
