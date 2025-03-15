import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import * as reviewService from '../../services/reviewService';

const CommentForm = (props) => {
    const { reviewId, commentId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ text: '' });

    useEffect(() => {
        if (reviewId && commentId) {
            const fetchReview = async () => {
                const reviewData = await reviewService.show(reviewId);
                const comment = reviewData.comments.find((c) => c._id === commentId);
                if (comment) setFormData({ text: comment.text });
            };
            fetchReview();
        }
    }, [reviewId, commentId]);

    const handleChange = (evt) => {
        setFormData({ ...formData, [evt.target.name]: evt.target.value });
    };

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        if (reviewId && commentId) {
            await reviewService.updateComment(reviewId, commentId, formData);
            navigate(`/reviews/${reviewId}`);
        } else {
            props.handleAddComment(formData);
        }
        setFormData({ text: '' });
    };

    return (
        <form className="comment-form" onSubmit={handleSubmit}>
            <label htmlFor="text-input">Your comment:</label>
            <textarea
                required
                name="text"
                id="text-input"
                value={formData.text}
                onChange={handleChange}
                className="comment-box"
            />
            <button type="submit">{commentId ? 'Update Comment' : 'Submit Comment'}</button>
        </form>
    );
};

export default CommentForm;
