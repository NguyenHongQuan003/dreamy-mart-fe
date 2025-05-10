import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getToken, getCurrentUser } from "../services/authService";
import { store } from "../redux/store";
import { setCredentials, setUser } from "../redux/slices/authSlice";
import { toast } from "react-toastify";

const Callback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const code = searchParams.get("code");
                console.log("code", code);
                if (!code) {
                    toast.error("Không tìm thấy mã xác thực!");
                    navigate("/login");
                    return;
                }

                const result = await getToken(code);
                if (result) {
                    const { access_token, refresh_token } = result;
                    store.dispatch(
                        setCredentials({
                            user: null,
                            access_token,
                            refresh_token,
                        })
                    );

                    // Lấy thông tin user
                    console.log("access_token", access_token);
                    console.log("refresh_token", refresh_token);
                    const userData = await getCurrentUser();
                    console.log("userData", userData);
                    store.dispatch(setUser(userData));

                    toast.success("Đăng nhập thành công!");
                    navigate("/");
                }
            } catch (error) {
                console.log("Error in callback:", error);
                // toast.error(error.response.data.message);
                navigate("/login");
            }
        };

        handleCallback();
    }, [searchParams, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <h2 className="text-2xl font-semibold mb-4">Đang xử lý đăng nhập...</h2>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            </div>
        </div>
    );
};

export default Callback; 