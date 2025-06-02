import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as reviewService from '../../services/reviewService';
import { movieService } from '../../services/movieService';
import newReviewImage from '../../assets/images/NewReview.png'

// Map TMDB genres to our available genres
const genreMap = {
    'Animation': 'Animation',
    'Family': 'Animation',
    'Comedy': 'Comedy',
    'Drama': 'Drama',
    'Action': 'Action',
    'Adventure': 'Action',
    'Fantasy': 'Fantasy',
    'Science Fiction': 'Science Fiction',
    'Horror': 'Mystery',
    'Thriller': 'Mystery',
    'Mystery': 'Mystery',
    'Crime': 'Drama',
    'Romance': 'Drama',
    'Documentary': 'Drama',
    'Music': 'Drama',
    'History': 'Drama',
    'War': 'Action',
    'Western': 'Action'
};

const ReviewForm = (props) => {
    const { reviewId, movieId } = useParams();

    const [formData, setFormData] = useState({
        movie: '',
        director: '',
        genre: 'Action',
        rating: '⭐️',
        review: '',
        tmdbId: movieId || '',
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (evt) => {
        setFormData({ ...formData, [evt.target.name]: evt.target.value });
    };

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        if (reviewId) {
            props.handleUpdateReview(reviewId, formData);
        } else {
            props.handleAddReview(formData);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                if (reviewId) {
                    // Fetch existing review data
                    const reviewData = await reviewService.show(reviewId);
                    setFormData({
                        movie: reviewData.movie || '',
                        director: reviewData.director || '',
                        genre: reviewData.genre || 'Action',
                        rating: reviewData.rating || '⭐️',
                        review: reviewData.review || '',
                        tmdbId: reviewData.tmdbId || '',
                    });
                }

                // If we have a movieId, fetch movie data from TMDB
                if (movieId) {
                    const movieData = await movieService.getMovieDetails(movieId);
                    console.log('Movie Data in ReviewForm:', {
                        id: movieData.id,
                        title: movieData.title,
                        credits: movieData.credits,
                        genres: movieData.genres,
                        rawCredits: movieData.credits?.crew,
                        rawGenres: movieData.genres
                    });

                    // Get director from credits
                    const directors = movieData.credits?.crew?.filter(
                        person => person.job === 'Director'
                    ) || [];

                    console.log('Raw crew data:', movieData.credits?.crew);
                    console.log('Filtered directors:', directors);

                    const director = directors.length > 0
                        ? directors.map(d => d.name).join(' & ')
                        : 'Unknown';

                    console.log('Found Directors:', directors, 'Final director string:', director);

                    // Map TMDB genre to our available genres
                    const tmdbGenres = movieData.genres || [];
                    // Try to find the first genre that maps to one of our available genres
                    const mappedGenre = tmdbGenres.reduce((found, genre) => {
                        if (found) return found;
                        return genreMap[genre] || null;
                    }, null) || 'Action';

                    console.log('TMDB Genres:', tmdbGenres, 'Mapped to:', mappedGenre);

                    setFormData(prevData => ({
                        ...prevData,
                        movie: movieData.title || '',
                        director: director,
                        genre: mappedGenre,
                        tmdbId: movieId,
                    }));
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [reviewId, movieId]);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <main id="review-form">
            <img src={newReviewImage} alt="Popcorn" className="newreview" />
            <h1>{reviewId ? 'Edit Review' : 'New Review'}</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor='movie-input'>Movie</label>
                <input
                    required
                    type='text'
                    name='movie'
                    id='movie-input'
                    value={formData.movie}
                    onChange={handleChange}
                    readOnly={!!movieId}
                />

                <label htmlFor='director-input'>Director</label>
                <input
                    required
                    type='text'
                    name='director'
                    id='director-input'
                    value={formData.director}
                    onChange={handleChange}
                    readOnly={!!movieId}
                />

                <label htmlFor='genre-input'>Genre</label>
                <select
                    required
                    name='genre'
                    id='genre-input'
                    value={formData.genre}
                    onChange={handleChange}
                    disabled={!!movieId}
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
                <select required name='rating' id='rating-input' value={formData.rating} onChange={handleChange}>
                    <option value='⭐️'>⭐️</option>
                    <option value='⭐️⭐️'>⭐️⭐️</option>
                    <option value='⭐️⭐️⭐️'>⭐️⭐️⭐️</option>
                    <option value='⭐️⭐️⭐️⭐️'>⭐️⭐️⭐️⭐️</option>
                    <option value='⭐️⭐️⭐️⭐️⭐️'>⭐️⭐️⭐️⭐️⭐️</option>
                </select>

                <label htmlFor='review-input'>Your Review</label>
                <textarea required name='review' id='review-input' value={formData.review} onChange={handleChange} />

                <button type='submit'>Submit</button>
            </form>
        </main>
    );
};

export default ReviewForm;