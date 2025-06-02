import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { movieService } from '../../services/movieService';
import './Movies.css';

const Movies = () => {
    const [movies, setMovies] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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
        loadPopularMovies();
    }, []);

    const loadPopularMovies = async () => {
        try {
            // Only show loading state if we're not clearing the search
            if (searchQuery) {
                setLoading(true);
            }
            const data = await movieService.getPopularMovies();
            setMovies(data.results || []);
        } catch (error) {
            console.error('Error loading popular movies:', error);
            setMovies([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) {
            loadPopularMovies();
            return;
        }

        try {
            setLoading(true);
            const data = await movieService.searchMovies(searchQuery);
            setMovies(data.results || []);
        } catch (error) {
            console.error('Error searching movies:', error);
            setMovies([]);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);

        // If the input matches a movie title exactly, update the search query
        const exactMatch = movies.find(movie =>
            movie.title.toLowerCase() === value.toLowerCase()
        );
        if (exactMatch) {
            setSearchQuery(exactMatch.title);
        }
    };

    const handleMovieClick = (movieId) => {
        navigate(`/movies/${movieId}`);
    };

    const clearSearch = () => {
        setSearchQuery('');
        // Keep current movies visible while loading new ones
        const currentMovies = [...movies];
        loadPopularMovies().then(() => {
            // If the load fails, at least we still have the previous movies
            if (movies.length === 0) {
                setMovies(currentMovies);
            }
        });
    };

    return (
        <div className="movies-container">
            <div className="search-section">
                <form onSubmit={handleSearch} className="search-form">
                    <div className="search-input-container">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleInputChange}
                            placeholder="Search for movies..."
                            className="search-input"
                            autoComplete="off"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                className="clear-button"
                                onClick={clearSearch}
                                aria-label="Clear search"
                            >
                                ×
                            </button>
                        )}
                    </div>
                    <button type="submit" className="search-button" disabled={loading}>
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </form>
            </div>

            {loading ? (
                <div className="loading">Loading movies...</div>
            ) : movies.length === 0 ? (
                <div className="no-results">No movies found</div>
            ) : (
                <div className="movies-grid">
                    {movies.map((movie) => (
                        <div
                            key={movie.id}
                            className="movie-card"
                            onClick={() => handleMovieClick(movie.id)}
                            role="button"
                            tabIndex={0}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleMovieClick(movie.id);
                                }
                            }}
                        >
                            <img
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                alt={movie.title}
                                className="movie-poster"
                            />
                            <div className="movie-info">
                                <h3>{movie.title}</h3>
                                <p className="movie-year">
                                    {new Date(movie.release_date).getFullYear()}
                                </p>
                                <div className="movie-rating">
                                    {convertToStars(movie.vote_average)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Movies; 