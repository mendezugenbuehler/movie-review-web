import { useContext, useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

import NavBar from './components/NavBar/NavBar';
import SignUpForm from './components/SignUpForm/SignUpForm';
import SignInForm from './components/SignInForm/SignInForm';
import Landing from './components/Landing/Landing';
import Dashboard from './components/Dashboard/Dashboard';
import ReviewList from './components/ReviewList/ReviewList';
import * as reviewService from './services/reviewService';
import ReviewDetails from './components/ReviewDetails/ReviewDetails';
import ReviewForm from './components/ReviewForm/ReviewForm';
import CommentForm from './components/CommentForm/CommentForm';

import { UserContext } from './contexts/UserContext';

const App = () => {
  const { user } = useContext(UserContext);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchAllReviews = async () => {
      const reviewsData = await reviewService.index();
      setReviews(reviewsData);
    };
    if (user) fetchAllReviews();
  }, [user]);

  const navigate = useNavigate();

  const handleAddReview = async (reviewFormData) => {
    const newReview = await reviewService.create(reviewFormData);
    setReviews([newReview, ...reviews]);
    navigate('/reviews');
  };

  const handleDeleteReview = async (reviewId) => {
    const deletedReview = await reviewService.deleteReview(reviewId);
    setReviews(reviews.filter((review) => review._id !== deletedReview._id));
    navigate('/reviews');
  };

  const handleUpdateReview = async (reviewId, reviewFormData) => {
    const updatedReview = await reviewService.update(reviewId, reviewFormData);
    setReviews(reviews.map((review) => (reviewId === review._id ? updatedReview : review)));
    navigate(`/reviews/${reviewId}`);
  };

  return (
    <>
      <NavBar />
      <Routes>
        <Route path='/' element={user ? <Dashboard /> : <Landing />} />
        {user ? (
          <>
            {/* Protected routes (available only to signed-in users) */}
            <Route path='/reviews' element={<ReviewList reviews={reviews} />} />
            <Route path='/reviews/:reviewId' element={<ReviewDetails handleDeleteReview={handleDeleteReview} />} />
            <Route path='/reviews/new' element={<ReviewForm handleAddReview={handleAddReview} />} />
            <Route path='/reviews/:reviewId/edit' element={<ReviewForm handleUpdateReview={handleUpdateReview} />} />
            <Route path='/reviews/:reviewId/comments/:commentId/edit' element={<CommentForm />} />
          </>
        ) : (
          <>
            {/* Non-user routes (available only to guests) */}
            <Route path='/sign-up' element={<SignUpForm />} />
            <Route path='/sign-in' element={<SignInForm />} />
          </>
        )}
      </Routes>
    </>
  );
};

export default App;
