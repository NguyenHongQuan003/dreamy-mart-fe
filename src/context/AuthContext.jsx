import { useEffect, useState } from "react";
import { getCurrentUser, login } from "../services/authService";
import PropTypes from "prop-types";
import { AuthContext } from "../utils/authUtils";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    localStorage.getItem("auth_token") || null
  );
  const [loading, setLoading] = useState(true);

  // Định nghĩa PropTypes
  AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const userData = await getCurrentUser(token);
          setUser(userData);
        } catch (error) {
          setToken(null);
          localStorage.removeItem("auth_token");
          console.error("Token verification failed:", error);
        }
      }
      setLoading(false);
    };
    verifyToken();
  }, [token]);

  const signIn = async (email, password) => {
    const data = await login(email, password);
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem("auth_token", data.token);
  };

  const signOut = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth_token");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, token, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
