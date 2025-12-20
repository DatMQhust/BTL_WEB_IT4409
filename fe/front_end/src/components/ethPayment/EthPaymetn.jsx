import React, { useState } from 'react';
import { ethers } from 'ethers';
import ContractABI from '../../config/contractABI.json'; // ABI của hợp đồng
import { CONTRACT_ADDRESS } from '../../config/constants';

const EthPayment = ({ orderId, amountVND, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handlePayment = async () => {
        setError('');
        setLoading(true);

        try {
            if (!window.ethereum) throw new Error("Vui lòng cài đặt Metamask!");

            // 1. Kết nối ví
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            // 2. Tính toán số ETH (Giả sử 1 ETH = 50,000,000 VND cho môi trường test)
            // Trong thực tế bạn cần gọi API lấy tỷ giá
            const exchangeRate = 50000000; 
            const ethAmount = (amountVND / exchangeRate).toFixed(18); // Giữ 18 số thập phân
            const weiAmount = ethers.parseEther(ethAmount.toString());

            // 3. Khởi tạo Contract
            const contract = new ethers.Contract(CONTRACT_ADDRESS, ContractABI.abi, signer);

            // 4. Gửi giao dịch
            console.log(`Đang thanh toán cho Order: ${orderId} với giá ${ethAmount} ETH`);
            const tx = await contract.payOrder(orderId, {
                value: weiAmount
            });

            // 5. Chờ xác nhận
            await tx.wait();
            
            console.log("Giao dịch thành công:", tx.hash);
            
            // 6. Gọi Callback để báo cho component cha (để gọi API Backend)
            onSuccess(tx.hash);

        } catch (err) {
            console.error(err);
            // Xử lý lỗi user từ chối
            if (err.code === 'ACTION_REJECTED') {
                setError('Bạn đã từ chối giao dịch.');
            } else {
                setError(err.message || 'Lỗi thanh toán.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-4 p-4 border rounded bg-gray-50">
            <h3 className="font-bold mb-2">Thanh toán Crypto (ETH)</h3>
            <p className="mb-2">Tổng tiền: {amountVND.toLocaleString()}đ</p>
            
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            
            <button 
                onClick={handlePayment}
                disabled={loading}
                className={`w-full py-2 px-4 rounded text-white font-bold ${
                    loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'
                }`}
            >
                {loading ? 'Đang xử lý Blockchain...' : 'Thanh toán bằng Metamask'}
            </button>
        </div>
    );
};

export default EthPayment;