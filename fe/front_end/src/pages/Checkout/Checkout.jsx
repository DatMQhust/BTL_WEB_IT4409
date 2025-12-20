import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EthPayment from '../../components/EthPayment/EthPayment';
import './Checkout.css';

const Checkout = () => {
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState(''); // 'cod', 'qr', 'eth'
    const [showMetaMaskPopup, setShowMetaMaskPopup] = useState(false);

    // Dữ liệu đơn hàng giả lập
    const orderData = {
        id: "ORD-2024-999",
        items: [
            { name: "Sách: Lập Trình Web Nâng Cao", price: 150000, quantity: 1 },
            { name: "Khóa học ReactJS Master", price: 2350000, quantity: 1 }
        ],
        total: 2500000
    };

    const handleMethodChange = (e) => {
        const method = e.target.value;
        setPaymentMethod(method);

        // Logic kiểm tra MetaMask chỉ khi chọn ETH
        if (method === 'eth') {
            if (typeof window.ethereum === 'undefined') {
                setShowMetaMaskPopup(true);
            }
        }
    };

    const handleFinishCOD = () => {
        alert("Đặt hàng thành công! Cảm ơn bạn đã mua sắm.");
        navigate('/'); // Chuyển hướng về Home
    };

    const handleEthSuccess = (txHash) => {
        alert(`Thanh toán ETH thành công!\nCảm ơn bạn đã mua sắm.\nMã giao dịch: ${txHash}`);
        // Có thể gọi API cập nhật trạng thái đơn hàng ở đây
        navigate('/');
    };

    return (
        <div className="checkout-container">
            <h1 className="checkout-title">Thanh toán đơn hàng</h1>

            {/* 1. Order Information */}
            <div className="order-info">
                <h2>Thông tin đơn hàng ({orderData.id})</h2>
                {orderData.items.map((item, index) => (
                    <div key={index} className="order-item">
                        <span>{item.quantity} x {item.name}</span>
                        <span>{item.price.toLocaleString()}đ</span>
                    </div>
                ))}
                <div className="order-total">
                    <span>Tổng cộng</span>
                    <span className="text-orange-600">{orderData.total.toLocaleString()}đ</span>
                </div>
            </div>

            {/* 2. Payment Methods Selection */}
            <div className="payment-section">
                <h3 className="payment-title">Chọn phương thức thanh toán:</h3>
                <div className="payment-options">

                    {/* COD Option */}
                    <label className={`payment-option-label ${paymentMethod === 'cod' ? 'active' : ''}`}>
                        <input
                            type="radio"
                            name="payment"
                            value="cod"
                            checked={paymentMethod === 'cod'}
                            onChange={handleMethodChange}
                        />
                        <span>Thanh toán khi nhận hàng (COD)</span>
                    </label>

                    {/* VietQR Option */}
                    <label className={`payment-option-label ${paymentMethod === 'qr' ? 'active' : ''}`}>
                        <input
                            type="radio"
                            name="payment"
                            value="qr"
                            checked={paymentMethod === 'qr'}
                            onChange={handleMethodChange}
                        />
                        <span>Chuyển khoản ngân hàng (VietQR)</span>
                    </label>

                    {/* ETH Option */}
                    <label className={`payment-option-label ${paymentMethod === 'eth' ? 'active' : ''}`}>
                        <input
                            type="radio"
                            name="payment"
                            value="eth"
                            checked={paymentMethod === 'eth'}
                            onChange={handleMethodChange}
                        />
                        <span>Thanh toán bằng tiền điện tử (ETH)</span>
                    </label>
                </div>

                {/* Conditional Rendering Areas */}

                {paymentMethod === 'cod' && (
                    <div className="payment-content">
                        <p className="mb-4">Bạn sẽ thanh toán bằng tiền mặt khi nhận được hàng.</p>
                        <button onClick={handleFinishCOD} className="btn-finish">Hoàn thành</button>
                    </div>
                )}

                {paymentMethod === 'qr' && (
                    <div className="payment-content">
                        <p className="mb-2 font-bold">Quét mã QR để thanh toán:</p>
                        <div className="qr-placeholder">
                            {/* Dummy QR Code */}
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PAY|${orderData.total}|${orderData.id}`}
                                alt="VietQR"
                                style={{ width: '100%' }}
                            />
                        </div>
                        <p className="qr-text">Nội dung chuyển khoản: <strong>{orderData.id}</strong></p>
                    </div>
                )}

                {paymentMethod === 'eth' && typeof window.ethereum !== 'undefined' && (
                    <div className="payment-content">
                        <EthPayment
                            orderId={orderData.id}
                            amountVND={orderData.total}
                            onSuccess={handleEthSuccess}
                        />
                    </div>
                )}
            </div>

            {/* MetaMask Missing Popup */}
            {showMetaMaskPopup && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="text-4xl mb-4">🦊</div>
                        <h3 className="modal-title">Vui lòng cài đặt Metamask</h3>
                        <p className="modal-desc">
                            Để thực hiện thanh toán bằng ETH, trình duyệt của bạn cần cài đặt ví MetaMask extension.
                        </p>
                        <div className="modal-actions">
                            <a
                                href="https://chromewebstore.google.com/detail/nkbihfbeogaeaoehlefnkodbefgpgknn?utm_source=item-share-cb"
                                target="_blank"
                                rel="noreferrer"
                                className="btn-metamask"
                            >
                                Đi tới MetaMask Chrome Extension
                            </a>
                            <button
                                onClick={() => window.location.reload()}
                                className="btn-reload"
                            >
                                Đã cài đặt (Tải lại trang)
                            </button>
                            <button
                                onClick={() => {
                                    setShowMetaMaskPopup(false);
                                    setPaymentMethod(''); // Reset selection
                                }}
                                className="btn-close-modal"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Checkout;
