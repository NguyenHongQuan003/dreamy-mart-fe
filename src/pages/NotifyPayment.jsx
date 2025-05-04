import { useEffect } from 'react';

const NotifyPayment = () => {
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const orderId = params.get("orderId");

        if (orderId) {
            // Tùy chọn: thêm loading delay hoặc xử lý logic trước khi chuyển hướng
            setTimeout(() => {
                window.location.href = `http://localhost:5173/orders/${orderId}`;
            }, 1000); // Hiển thị 1 giây trước khi chuyển
        }
    }, []);

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>🔄 Đang xử lý thanh toán...</h2>
            <p>Bạn sẽ được chuyển hướng trong giây lát.</p>
        </div>
    );
};

export default NotifyPayment;
