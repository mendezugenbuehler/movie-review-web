import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import * as userService from '../../services/userService';
import dashboardImage from '../../assets/images/Dashboard.png'

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await userService.index();
        setUsers(fetchedUsers);
      } catch (err) {
        console.log(err);
      }
    };
    if (user) fetchUsers();
  }, [user]);

  return (
    <main className="dashboard-page">
      <img src={dashboardImage} alt="Color-TV" className="dashboard" />
      <h1>Welcome, {user.username}</h1>
      <p>
        <a href="/reviews" className="dashboard-link">Explore reviews</a>&nbsp;or&nbsp;
        <a href="/reviews/new" className="dashboard-link">share your own thoughts</a> on the latest films.
      </p>
      <p>The main feature stars the critics, the fans, and the film buffs, including:</p>
      <ul className="user-list">
        {users.map(user => (
          <li key={user._id}>{user.username}</li>
        ))}
      </ul>
    </main>
  );
};

export default Dashboard;
