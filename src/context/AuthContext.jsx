import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, login } from "../services/authService";
import PropTypes from "prop-types";

const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    localStorage.getItem("auth_token") || null
  );

  AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };
  const [loading, setLoading] = useState(true);

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

export const useAuth = () => useContext(AuthContext);
