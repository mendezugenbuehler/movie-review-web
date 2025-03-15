import { Link } from 'react-router-dom';

const ReviewList = (props) => {
    return (
        <main className="review-list-page">
            <img src="/src/assets/images/Reviews.png" alt="VHS Tape" className="reviewlist" />
            <h1>Reviews</h1>
            <p>Here's what the viewers have to say:</p>
            <div className="review-container">
                {props.reviews.map((review) => (
                    <article key={review._id} className="review-box">
                        <header>
                            <h2>{review.author.username}'s review of {review.movie}</h2>
                        </header>
                        <p>{review.review}</p>
                        <Link to={`/reviews/${review._id}`} className="read-more">Read more</Link>
                    </article>
                ))}
            </div>
        </main>
    );
};

export default ReviewList;
