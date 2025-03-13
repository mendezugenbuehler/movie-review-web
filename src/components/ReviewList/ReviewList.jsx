import { Link } from 'react-router-dom';

const ReviewList = (props) => {
    return (
        <main>
            {props.reviews.map((review) => (
                <Link key={review._id} to={`/reviews/${review._id}`}>
                    <article>
                        <header>
                            <h2>{review.title}</h2>
                            <p>
                                {`${review.author.username} posted on
                  ${new Date(review.createdAt).toLocaleDateString()}`}
                            </p>
                        </header>
                        <p>{review.text}</p>
                    </article>
                </Link>
            ))}
        </main>
    );
};

export default ReviewList;