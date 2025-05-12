import {
    FaClipboardList,
    // FaFileAlt,
    FaList,
    FaShoppingBag,
    FaSignOutAlt,
    FaTachometerAlt,
    FaTag,
    FaTruck
} from 'react-icons/fa'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { logout } from '../../services/authService';
import { APP_INFO } from '../../constants/app.constants';
import { useSelector } from 'react-redux';

const AdminNavbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);

    const handleLogout = () => {
        logout();
        navigate("/admin/login");
    };

    const navItems = [
        { to: "/admin", label: "Bảng điều khiển", icon: <FaTachometerAlt /> },
        { to: "/admin/products", label: "Sản phẩm", icon: <FaShoppingBag /> },
        { to: "/admin/categories", label: "Danh mục sản phẩm", icon: <FaList /> },
        { to: "/admin/promotions", label: "Khuyến mãi", icon: <FaTag /> },
        { to: "/admin/orders", label: "Đơn hàng", icon: <FaClipboardList /> },
        { to: "/admin/delivery", label: "Giao hàng", icon: <FaTruck /> },
        // { to: "/admin/reports", label: "Báo cáo", icon: <FaFileAlt /> },
    ];

    return (
        <div className="w-64 max-w-64 min-w-64 bg-[#1e293b] text-white min-h-screen flex flex-col">
            <div className="px-4 py-2">
                <h1 className="text-2xl font-bold">DreamyMart Admin</h1>
            </div>
            <div className="py-3 hover:bg-[#334155] transition-colors mt-auto">
                {user && (
                    <div className="relative px-4">
                        <button
                            className="flex items-center hover:cursor-pointer w-full"
                        >
                            <img
                                src={user.avatar || APP_INFO.DEFAULT_AVATAR}
                                className="h-12 w-12 rounded-full border-1 border-white object-cover"
                            />
                            <span className="hidden md:block text-[#0078E8] ml-2 pr-1 truncate">
                                <strong>{user.fullName}</strong>
                            </span>
                        </button>
                    </div>
                )}
            </div>
            <nav className=" flex-1">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.to;
                    return (
                        <Link
                            to={item.to}
                            key={item.to}
                        >
                            <div className={`px-4 py-3 flex items-center text-white ${isActive ? "bg-[#334155]" : "hover:bg-[#334155]"}`}>
                                <span className="mr-3">{item.icon}</span>
                                {item.label}
                            </div>
                        </Link>
                    );
                })}
                <div className="px-4 py-3 hover:bg-[#334155] transition-colors mt-auto">
                    <button
                        onClick={handleLogout}
                        className="flex items-center text-white w-full text-left"
                    >
                        <FaSignOutAlt className="mr-3" />
                        Đăng xuất
                    </button>
                </div>

            </nav >

        </div >
    )
}

export default AdminNavbar;
