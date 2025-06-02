import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as reviewService from '../../services/reviewService';
import reviewsImage from '../../assets/images/Reviews.png'

const ReviewList = ({ movieId }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoading(true);
                if (movieId) {
                    // Fetch reviews for a specific movie
                    console.log('Fetching reviews for movie ID:', movieId);
                    const data = await reviewService.getReviewsByMovieId(movieId);
                    console.log('Fetched reviews:', data);
                    setReviews(data || []);
                } else {
                    // Fetch only the logged-in user's reviews
                    console.log('Fetching user reviews');
                    const data = await reviewService.index();
                    // Filter to only show the current user's reviews
                    const userReviews = data.filter(review => review.author._id === localStorage.getItem('userId'));
                    console.log('Fetched user reviews:', userReviews);
                    setReviews(userReviews || []);
                }
            } catch (error) {
                console.error('Error fetching reviews:', error);
                setReviews([]);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [movieId]);

    const scrollToReviewForm = () => {
        const reviewForm = document.getElementById('review-form');
        if (reviewForm) {
            reviewForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <main className="review-list-page">
            <img src={reviewsImage} alt="VHS-Tape" className="reviewlist" />
            <h1>Reviews</h1>
            <div className="review-container">
                {loading ? (
                    <div className="loading">Loading reviews...</div>
                ) : reviews && reviews.length > 0 ? (
                    <>
                        <p className="review-intro">Here are your reviews:</p>
                        {reviews.map((review) => (
                            <article key={review._id} className="review-box">
                                <header>
                                    <h2>Your review of {review.movie}</h2>
                                </header>
                                <p>{review.review}</p>
                                <Link to={`/reviews/${review._id}`} className="read-more">Read more</Link>
                            </article>
                        ))}
                    </>
                ) : (
                    <div className="no-reviews">
                        <p>You haven't written a review yet.</p>
                        <div className="cta-buttons">
                            <button
                                className="primary-button"
                                onClick={() => navigate('/reviews/new')}
                            >
                                Write a Review
                            </button>
                            <button
                                className="secondary-button"
                                onClick={() => navigate('/movies')}
                            >
                                Browse Movies
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
};

export default ReviewList;
