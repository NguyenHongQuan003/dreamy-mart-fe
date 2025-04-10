// import { useEffect, useState } from "react";
// import { getCurrentUser, login } from "../services/authService";
// import PropTypes from "prop-types";
// import { AuthContext } from "../utils/authUtils";
// import { useNavigate } from "react-router-dom";
// import { setupInterceptors } from "../utils/axiosConfig";
// import { toast } from "react-toastify";

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [token, setToken] = useState(localStorage.getItem("access_token"));
//   const navigate = useNavigate();

//   const setAccessToken = (token) => {
//     if (token) {
//       localStorage.setItem("access_token", token);
//       setToken(token);
//     } else {
//       localStorage.removeItem("access_token");
//       setToken(null);
//     }
//   };

//   const setRefreshToken = (refresh_token) => {
//     if (refresh_token) {
//       localStorage.setItem("refresh_token", refresh_token);
//     } else {
//       localStorage.removeItem("refresh_token");
//     }
//   };

// useEffect(() => {
//   const verifyToken = async () => {
//     if (token) {
//       try {
//         const userData = await getCurrentUser(token);
//         setUser(userData);
//       } catch (error) {
//         console.error("Token verification failed:", error);
//       }
//     }
//     setLoading(false);
//   };
//   verifyToken();
// }, [token]);

// useEffect(() => {
//   setupInterceptors(navigate, setAccessToken);
// }, [navigate]);

// const signIn = async (username, password) => {
//   try {
//     const dataToken = await login(username, password);
//     const { access_token, refresh_token } = dataToken.result;

//     setAccessToken(access_token);
//     setRefreshToken(refresh_token);

//     const userData = await getCurrentUser(access_token);
//     console.log("User data:", userData);
//     setUser(userData);
//     navigate("/");
//   } catch (error) {
//     console.error("Sign in failed:", error);
//     throw error;
//   }
// };

// const signOut = async () => {
//   try {
// await logout(localStorage.getItem("refresh_token"));
//     setUser(null);
//     setAccessToken(null);
//     setRefreshToken(null);
//     navigate("/login");
//     toast.success("Đăng xuất thành công!");
//   } catch (error) {
//     console.error("Sign out failed:", error);
//     toast.error("Đăng xuất không thành công!");
//   }
// };

// if (loading) {
//   return <div>Loading...</div>;
// }

//   return (
//     <AuthContext.Provider value={{ user, signIn, signOut }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Định nghĩa PropTypes
// AuthProvider.propTypes = {
//   children: PropTypes.node.isRequired,
// };
