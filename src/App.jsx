import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductList from "./pages/ProductList";
import Profile from "./pages/Profile";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderDetail from "./pages/OrderDetail";
import AdminLogin from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import ProductManagement from "./pages/admin/ProductManagement";
import OrderManagement from "./pages/admin/OrderManagement";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ForgotPassword from "./pages/ForgotPassword";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setupInterceptors } from "./utils/axiosConfig";
import { loadUserFromToken } from "./services/authService";
import AddProduct from "./pages/admin/AddProduct";
import NotifyPayment from "./pages/NotifyPayment";
import ProductEdit from "./pages/admin/ProductEdit";

const AxiosInterceptorSetup = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setupInterceptors(navigate);
    loadUserFromToken();
  }, [navigate]);

  return null;
};



function App() {
  return (
    <Provider store={store}>
      <Router>
        <AxiosInterceptorSetup />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={
            <Cart />
          } />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders/:orderId" element={<OrderDetail />} />
          <Route path="/payment/notify" element={<NotifyPayment />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route
            path="/products/category/:categoryName"
            element={<ProductList />}
          />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/products" element={<ProductManagement />} />
          <Route path="/admin/products/edit/:id" element={<ProductEdit />} />
          <Route path="/admin/products/add" element={<AddProduct />} />
          <Route path="/admin/orders" element={<OrderManagement />} />
          <Route path="/admin/orders/:orderId" element={<OrderDetail />} />
        </Routes>
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </Router>
    </Provider>
  );
}

export default App;
