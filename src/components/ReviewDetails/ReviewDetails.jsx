import { useParams, Link } from 'react-router';
import { useState, useEffect, useContext } from 'react';
import * as reviewService from '../../services/reviewService';
import CommentForm from '../CommentForm/CommentForm';
import { UserContext } from '../../contexts/UserContext';

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
      <section>
        <header>
          <h1>{review.reviewTitle}</h1>
          <p>
            {`${review.author.username} posted on
            ${new Date(review.createdAt).toLocaleDateString()}`}
          </p>
          {review.author._id === user._id && (
            <>
              <Link to={`/reviews/${reviewId}/edit`}>Edit</Link>
              <button onClick={() => props.handleDeleteReview(reviewId)}>Delete</button>
            </>
          )}
        </header>
        <p>{review.text}</p>
      </section>
      <section>
        <h2>Comments</h2>
        <CommentForm handleAddComment={handleAddComment} />
        {!review.comments.length && <p>There are no comments.</p>}
        {review.comments.map((comment) => (
          <article key={comment._id}>
            <header>
              <p>
                {`${comment.author.username} posted on
                ${new Date(comment.createdAt).toLocaleDateString()}`}
              </p>
              {comment.author._id === user._id && (
                <>
                  <Link to={`/reviews/${reviewId}/comments/${comment._id}/edit`}>Edit</Link>
                  <button onClick={() => handleDeleteComment(comment._id)}>Delete</button>
                </>
              )}
            </header>
            <p>{comment.text}</p>
          </article>
        ))}
      </section>
    </main>
  );
};

export default ReviewDetails;
