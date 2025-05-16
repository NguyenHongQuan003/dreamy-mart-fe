import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
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
import EditProduct from "./pages/admin/EditProduct";
import PromotionManagement from "./pages/admin/PromotionManagement";
import AddPromotion from "./pages/admin/AddPromotion";
import EditPromotion from "./pages/admin/EditPromotion";
import DeliveryManagement from "./pages/admin/DeliveryManagement";
import CategoryManagement from "./pages/admin/CategoryManagement";
import ChatbotWidget from "./components/chat/ChatbotWidget";
import Callback from "./pages/Callback";
import InventoryError from "./pages/InventoryError";

const AxiosInterceptorSetup = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setupInterceptors(navigate);
    loadUserFromToken();
  }, [navigate]);

  return null;
};

const ChatbotWrapper = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return !isAdminPage ? <ChatbotWidget /> : null;
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
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders/:orderId" element={<OrderDetail />} />
          <Route path="/payment/notify" element={<NotifyPayment />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/inventory-error" element={<InventoryError />} />
          <Route
            path="/products/category/:categoryName"
            element={<ProductList />}
          />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/products" element={<ProductManagement />} />
          <Route path="/admin/products/edit/:id" element={<EditProduct />} />
          <Route path="/admin/products/add" element={<AddProduct />} />
          <Route path="/admin/orders" element={<OrderManagement />} />
          <Route path="/admin/orders/:orderId" element={<OrderDetail />} />
          <Route path="/admin/promotions" element={<PromotionManagement />} />
          <Route path="/admin/promotions/add" element={<AddPromotion />} />
          <Route path="/admin/promotions/edit/:id" element={<EditPromotion />} />
          <Route path="/admin/delivery" element={<DeliveryManagement />} />
          <Route path="/admin/categories" element={<CategoryManagement />} />
        </Routes>
        <ChatbotWrapper />
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
