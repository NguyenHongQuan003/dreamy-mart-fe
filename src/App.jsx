import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductList from "./pages/ProductList";
import { AuthProvider } from "./context/AuthContext";
import Profile from "./pages/Profile";
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route
            path="/products/:category/:subcategory"
            element={<ProductList />}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
