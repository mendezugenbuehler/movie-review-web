import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { movieService } from '../../services/movieService';
import ReviewList from '../ReviewList/ReviewList';
import ReviewForm from '../ReviewForm/ReviewForm';
import './MovieDetails.css';

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

const MovieDetails = () => {
    const { movieId } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [recommendations, setRecommendations] = useState({ results: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Convert TMDB 10-point rating to 5-star emoji
    const convertToStars = (rating) => {
        if (!rating) return '';
        // Convert 10-point scale to 5-point scale and round to nearest half
        const fiveStarRating = Math.round((rating / 2) * 2) / 2;
        // Convert to emoji stars
        return '⭐️'.repeat(Math.floor(fiveStarRating)) +
            (fiveStarRating % 1 !== 0 ? '½' : '');
    };

    useEffect(() => {
        loadMovieDetails();
    }, [movieId]);

    const loadMovieDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            const [movieData, recommendationsData] = await Promise.all([
                movieService.getMovieDetails(movieId),
                movieService.getRecommendations(movieId)
            ]);
            console.log('Movie Data:', {
                id: movieData.id,
                title: movieData.title,
                genres: movieData.genres
            });
            // Ensure we're using the correct ID from the URL params
            movieData.id = movieId;
            setMovie(movieData);
            setRecommendations(recommendationsData || { results: [] });
        } catch (error) {
            console.error('Error loading movie details:', error);
            setError('Failed to load movie details. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleRecommendationClick = (movieId) => {
        navigate(`/movies/${movieId}`);
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (!movie) {
        return <div className="error">Movie not found</div>;
    }

    // Get the primary genre
    const genres = movie.genres || [];
    const primaryGenre = genres.reduce((found, genre) => {
        if (found) return found;
        const genreName = typeof genre === 'string' ? genre : genre.name;
        return genreMap[genreName] || null;
    }, null) || 'Drama';

    return (
        <div className="movie-details-container">
            <div className="movie-header">
                <div className="movie-poster">
                    {movie.posterPath && (
                        <img
                            src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                            alt={movie.title}
                        />
                    )}
                </div>
                <div className="movie-info">
                    <h1>{movie.title}</h1>
                    <div className="movie-meta">
                        {movie.release_date && (
                            <span className="movie-year">
                                {new Date(movie.release_date).getFullYear()}
                            </span>
                        )}
                        {movie.runtime && (
                            <span className="movie-runtime">{movie.runtime} min</span>
                        )}
                        {movie.vote_average && (
                            <span className="movie-rating">
                                {convertToStars(movie.vote_average)}
                            </span>
                        )}
                    </div>
                    <div className="movie-genres">
                        <span className="genre-tag">{primaryGenre}</span>
                    </div>
                    {movie.overview && (
                        <p className="movie-overview">{movie.overview}</p>
                    )}
                </div>
            </div>

            <div className="movie-content">
                <div className="reviews-section">
                    <h2>Reviews</h2>
                    <ReviewForm movieId={movie.id} />
                    <ReviewList movieId={movie.id} />
                </div>

                {recommendations.results && recommendations.results.length > 0 && (
                    <div className="recommendations-section">
                        <h2>You May Also Like</h2>
                        <div className="recommendations-grid">
                            {recommendations.results.map((rec) => (
                                <div
                                    key={rec.id}
                                    className="recommendation-card"
                                    onClick={() => handleRecommendationClick(rec.id)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            handleRecommendationClick(rec.id);
                                        }
                                    }}
                                >
                                    {rec.poster_path && (
                                        <img
                                            src={`https://image.tmdb.org/t/p/w200${rec.poster_path}`}
                                            alt={rec.title}
                                        />
                                    )}
                                    <h3>{rec.title}</h3>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MovieDetails; 