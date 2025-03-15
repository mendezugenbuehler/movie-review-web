import { useParams, Link } from 'react-router';
import { useState, useEffect, useContext } from 'react';
import * as reviewService from '../../services/reviewService';
import CommentForm from '../CommentForm/CommentForm';
import { UserContext } from '../../contexts/UserContext';
import reviewDetailsImage from '../../assets/images/ReviewDetails.png'

const ReviewDetails = (props) => {
  const { reviewId } = useParams();
  const { user } = useContext(UserContext);
  const [review, setReview] = useState(null);

  useEffect(() => {
    const fetchReview = async () => {
      const reviewData = await reviewService.show(reviewId);
      setReview(reviewData);
    };
    fetchReview();
  }, [reviewId]);

  const handleAddComment = async (commentFormData) => {
    const newComment = await reviewService.createComment(reviewId, commentFormData);
    setReview({ ...review, comments: [...review.comments, newComment] });
  };

  const handleDeleteComment = async (commentId) => {
    await reviewService.deleteComment(reviewId, commentId);
    setReview({
      ...review,
      comments: review.comments.filter((comment) => comment._id !== commentId),
    });
  };

  if (!review) return <main>Loading...</main>;

  return (
    <main>
      <img src={reviewDetailsImage} alt="Film-Strip" className="review" />
      <section>
        <header>
          <h1>{review.movie}</h1>
          <p>
            <strong>Director:</strong> {review.director}
          </p>
          <p>
            <strong>Genre:</strong> {review.genre}
          </p>
          <p>
            <strong>Rating:</strong> {review.rating}
          </p>
          <p>{`${review.author.username} posted on ${new Date(review.createdAt).toLocaleDateString()}`}</p>
        </header>

        <div className="review-content">
          <p>{review.review}</p>
          {review.author._id === user._id && (
            <div className="review-actions">
              <Link to={`/reviews/${reviewId}/edit`}>
                <button className="edit-delete-button">Edit</button>
              </Link>
              <button onClick={() => props.handleDeleteReview(reviewId)} className="edit-delete-button">
                Delete
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="comments-section">
        <h2>Comments</h2>
        {review.comments.length === 0 && <p>No comments yet.</p>}
        {review.comments.map((comment) => (
          <article key={comment._id} className="comment">
            <header>
              <p>{`${comment.author.username} posted on ${new Date(comment.createdAt).toLocaleDateString()}`}</p>
            </header>
            <p>{comment.text}</p>
            {comment.author._id === user._id && (
              <div className="comment-actions">
                <Link to={`/reviews/${reviewId}/comments/${comment._id}/edit`}>
                  <button className="edit-delete-button">Edit</button>
                </Link>
                <button onClick={() => handleDeleteComment(comment._id)} className="edit-delete-button">
                  Delete
                </button>
              </div>
            )}
          </article>
        ))}
        <CommentForm handleAddComment={handleAddComment} />
      </section>
    </main>
  );
};

export default ReviewDetails;
