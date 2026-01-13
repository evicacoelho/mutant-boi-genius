import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { authAPI } from '../../../services/api';
import './style.css';

interface RequireAuthProps {
  children: React.ReactNode;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = authAPI.getToken();
      if (!token) {
        setIsChecking(false);
        return;
      }

      try {
        await authAPI.getCurrentUser();
        setIsAuthenticated(true);
      } catch (error) {
        // Token is invalid, remove it
        authAPI.logout();
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await authAPI.login({ username, password });
      
      // Store token
      authAPI.setToken(response.token);
      setIsAuthenticated(true);
    } catch (error: any) {
      setError(error.message || 'Login failed. Please check your credentials.');
      setPassword('');
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    setIsAuthenticated(false);
  };

  if (isChecking) {
    return (
      <div className="login-page">
        <div className="login-container">
          <div className="loading-spinner">Loading...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="login-page">
        <div className="login-container">
          <h2>Admin Login</h2>
          <form onSubmit={handleLogin} className="login-form">
            {error && <div className="error-message">{error}</div>}
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username or email"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <button type="submit">Login</button>
          </form>
          <div className="login-note">
            <p>If you're not the Mutant Boi Genius and want to collaborate, please send a message in our contact section in the menu on the left.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="authenticated-content">
      <div className="admin-header">
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
      {children}
    </div>
  );
};

export default RequireAuth;