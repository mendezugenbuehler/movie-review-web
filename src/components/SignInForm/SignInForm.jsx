import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn } from '../../services/authService';
import { UserContext } from '../../contexts/UserContext';

const SignInForm = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({ username: '', password: '' });

  useEffect(() => {
    if (user !== null) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (evt) => {
    setMessage('');
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const signedInUser = await signIn(formData);
      setUser(signedInUser);
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 100);
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <main>
      <img src="/src/assets/images/SignIn.png" alt="TV Remote" className="sign-in-logo" />
      <h1>Sign In</h1>
      <p>{message}</p>
      <form autoComplete='off' onSubmit={handleSubmit}>
        <div>
          <label htmlFor='username'>Username:</label>
          <input type='text' id='username' value={formData.username} name='username' onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor='password'>Password:</label>
          <input type='password' id='password' value={formData.password} name='password' onChange={handleChange} required />
        </div>
        <div className="form-buttons">
          <button>Sign In</button>
          <button type="button" onClick={() => navigate('/')}>Cancel</button>
        </div>
      </form>
    </main>
  );
};

export default SignInForm;
