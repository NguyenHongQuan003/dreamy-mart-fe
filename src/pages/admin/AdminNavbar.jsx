import {
    FaChartLine,
    FaClipboardList,
    FaShoppingBag,
    FaSignOutAlt,
    FaTachometerAlt,
    FaTag
} from 'react-icons/fa'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const AdminNavbar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("adminInfo");
        navigate("/admin/login");
    };

    const navItems = [
        { to: "/admin", label: "Bảng điều khiển", icon: <FaTachometerAlt /> },
        { to: "/admin/products", label: "Sản phẩm", icon: <FaShoppingBag /> },
        { to: "/admin/promotions", label: "Khuyến mãi", icon: <FaTag /> },
        { to: "/admin/orders", label: "Đơn hàng", icon: <FaClipboardList /> },
        { to: "/admin/statistics", label: "Thống kê", icon: <FaChartLine /> },
    ];

    return (
        <div className="w-64 bg-[#1e293b] text-white h-screen flex flex-col">
            <div className="p-4">
                <h1 className="text-2xl font-bold">DreamyMart Admin</h1>
            </div>
            <nav className="mt-6 flex-1">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.to;
                    return (
                        <div
                            key={item.to}
                            className={`px-4 py-3 transition-colors ${isActive ? "bg-[#334155]" : "hover:bg-[#334155]"
                                }`}
                        >
                            <Link to={item.to} className="flex items-center text-white">
                                <span className="mr-3">{item.icon}</span>
                                {item.label}
                            </Link>
                        </div>
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
            </nav>
        </div>
    )
}

export default AdminNavbar;
