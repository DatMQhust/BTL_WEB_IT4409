import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import EthPayment from '../../components/Payment/EthPayment';
import './Payment.css';
import VietQRPayment from '../../components/Payment/VietQRPayment';
import SepayPayment from '../../components/Payment/SepayPayment';

const Payment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { orderData, paymentMethod: initialMethod } = location.state || {};
    const [paymentMethod, setPaymentMethod] = useState(initialMethod || '');
    const [showMetaMaskPopup, setShowMetaMaskPopup] = useState(false);

    useEffect(() => {
        if (!orderData) {
            alert("Không tìm thấy thông tin đơn hàng. Vui lòng đặt hàng lại.");
            navigate('/cart');
        }
    }, [orderData, navigate]);

    useEffect(() => {
        if (paymentMethod === 'ETH') {
            if (typeof window.ethereum === 'undefined') {
                setShowMetaMaskPopup(true);
            }
        }
    }, [paymentMethod]);


    const handleMethodChange = (e) => {
        setPaymentMethod(e.target.value);
    };

    const handleFinishCOD = () => {
        alert("Đặt hàng thành công! Cảm ơn bạn đã mua sắm.");
        navigate('/my-orders');
    };


    const handleEthSuccess = (txHash) => {
        alert(`Thanh toán ETH thành công!\nCảm ơn bạn đã mua sắm.\nMã giao dịch: ${txHash}`);
        navigate('/my-orders');
    };

    const handleVietQRSuccess = () => {
        alert("Xác nhận thanh toán VietQR thành công!");
        navigate('/my-orders');
    }

    const handleSepaySuccess = () => {
        alert("Thanh toán SePay thành công! Cảm ơn bạn đã mua sắm.");
        navigate('/my-orders');
    }

    if (!orderData) return <div className="p-8 text-center">Đang tải thông tin...</div>;


    const totalAmount = orderData.totalAmount || orderData.total || 0;
    const orderId = orderData._id || orderData.id;

    return (
        <div className="checkout-container">
            <h1 className="checkout-title">Thanh toán đơn hàng</h1>

            {/* Order Information Summary */}
            <div className="order-info">
                <h2>Mã đơn hàng: {orderId}</h2>
                {orderData.items && orderData.items.map((item, index) => (
                    <div key={index} className="order-item">
                        {/* Handle structure variance: item.product.name or item.name */}
                        <span>{item.quantity} x {item.product?.name || item.name}</span>
                        <span>{(item.price || 0).toLocaleString()}đ</span>
                    </div>
                ))}

                <div className="order-total" style={{ marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                    <span>Tổng cộng</span>
                    <span className="text-orange-600" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                        {totalAmount.toLocaleString()}đ
                    </span>
                </div>
            </div>

            {/* Payment Interface */}
            {/* Payment Methods Selection */}
            <div className="payment-section">
                <h3 className="payment-title">Chọn phương thức thanh toán:</h3>
                <div className="payment-options">

                    {/* COD Option */}
                    <label className={`payment-option-label ${paymentMethod === 'COD' ? 'active' : ''}`}>
                        <input
                            type="radio"
                            name="payment"
                            value="COD"
                            checked={paymentMethod === 'COD'}
                            onChange={handleMethodChange}
                        />
                        <span>Thanh toán khi nhận hàng (COD)</span>
                    </label>

                    {/* SePay Option */}
                    <label className={`payment-option-label ${paymentMethod === 'SePay' ? 'active' : ''}`}>
                        <input
                            type="radio"
                            name="payment"
                            value="SePay"
                            checked={paymentMethod === 'SePay'}
                            onChange={handleMethodChange}
                        />
                        <span>Chuyển khoản ngân hàng (SePay - Tự động xác nhận)</span>
                    </label>

                    {/* VietQR Option */}
                    <label className={`payment-option-label ${paymentMethod === 'VietQR' ? 'active' : ''}`}>
                        <input
                            type="radio"
                            name="payment"
                            value="VietQR"
                            checked={paymentMethod === 'VietQR'}
                            onChange={handleMethodChange}
                        />
                        <span>Chuyển khoản ngân hàng (VietQR)</span>
                    </label>

                    {/* ETH Option */}
                    <label className={`payment-option-label ${paymentMethod === 'ETH' ? 'active' : ''}`}>
                        <input
                            type="radio"
                            name="payment"
                            value="ETH"
                            checked={paymentMethod === 'ETH'}
                            onChange={handleMethodChange}
                        />
                        <span>Thanh toán bằng tiền điện tử (ETH)</span>
                    </label>
                </div>

                {/* Conditional Rendering Areas */}

                {paymentMethod === 'COD' && (
                    <div className="payment-content">
                        <p className="mb-4">Bạn sẽ thanh toán bằng tiền mặt khi nhận được hàng.</p>
                        <button onClick={handleFinishCOD} className="btn-finish">Hoàn thành</button>
                    </div>
                )}

                {paymentMethod === 'SePay' && (
                    <div className="payment-content">
                        <SepayPayment
                            orderId={orderId}
                            totalAmount={totalAmount}
                            onPaymentSuccess={handleSepaySuccess}
                        />
                    </div>
                )}

                {paymentMethod === 'VietQR' && (
                    <div className="payment-content">
                        <VietQRPayment
                            orderId={orderId}
                            totalAmount={totalAmount}
                            onPaymentSuccess={handleVietQRSuccess}
                        />
                    </div>
                )}

                {paymentMethod === 'ETH' && typeof window.ethereum !== 'undefined' && (
                    <div className="payment-content">
                        <EthPayment
                            orderId={orderId}
                            amountVND={totalAmount}
                            onSuccess={handleEthSuccess}
                        />
                    </div>
                )}

                {/* xử lý nếu ví metâmsk lỗi */}
                {paymentMethod === 'ETH' && typeof window.ethereum === 'undefined' && (
                    <p className="text-red-500">Vui lòng cài đặt MetaMask để tiếp tục.</p>
                )}
            </div>

            {/* popup khi thieu metamask */}
            {showMetaMaskPopup && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="text-4xl mb-4">🦊</div>
                        <h3 className="modal-title">Vui lòng cài đặt Metamask</h3>
                        <div className="mt-4">
                            <button
                                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                                onClick={() => setShowMetaMaskPopup(false)}
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

export default Payment;
