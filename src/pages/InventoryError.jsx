import { Link } from "react-router-dom";
import { FaExclamationTriangle, FaShoppingCart, FaHome } from "react-icons/fa";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Button from "../components/common/Button";

const InventoryError = () => {
    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center bg-red-100 rounded-full">
                            <FaExclamationTriangle className="text-red-500 text-4xl" />
                        </div>
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">
                            Rất tiếc, số lượng sản phẩm không đủ
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Một số sản phẩm trong giỏ hàng của bạn đã hết hàng hoặc không đủ số lượng.
                            Vui lòng kiểm tra lại giỏ hàng và điều chỉnh số lượng sản phẩm.
                        </p>
                        <div className="flex justify-center space-x-4">
                            <Link to="/cart">
                                <Button variant="primary" className="flex items-center">
                                    <FaShoppingCart className="mr-2" />
                                    Xem giỏ hàng
                                </Button>
                            </Link>
                            <Link to="/">
                                <Button variant="outline" className="flex items-center">
                                    <FaHome className="mr-2" />
                                    Về trang chủ
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default InventoryError; 