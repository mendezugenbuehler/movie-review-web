import { Link } from 'react-router-dom';
import landingImage from '../../assets/images/Landing.png'

const Landing = () => {
  return (
    <main className="landing-page">
      <img src={landingImage} alt="Blank-TV" className="landing" />
      <h1>Welcome to the Movie Review App!</h1>
      <p>This is where every review has a sequel & every opinion is a plot twist.</p>
      <p>
        <Link to="/sign-in" className="link">Sign in</Link> or <Link to="/sign-up" className="link">sign up</Link> & may the reviews be with you.
      </p>
    </main>
  );
};

export default Landing;