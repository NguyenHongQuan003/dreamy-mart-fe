import { useEffect } from 'react';
import { hostNgrok } from '../constants/api.constants';
const NotifyPayment = () => {
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const orderId = params.get("orderId");

        if (orderId) {
            // Tùy chọn: thêm loading delay hoặc xử lý logic trước khi chuyển hướng
            setTimeout(() => {
                window.location.href = `http://${hostNgrok}/orders/${orderId}`;
            }, 800); // Hiển thị 1 giây trước khi chuyển
        }
    }, []);

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <div className="text-xl font-bold">Vui lòng đợi trong giây lát</div>
            </div>
        </div>
    );
};

export default NotifyPayment;
