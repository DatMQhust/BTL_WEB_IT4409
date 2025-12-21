import React, { useState } from 'react';
import { ethers } from 'ethers';
import ContractABI from '../../config/contractABI.json';
import { CONTRACT_ADDRESS } from '../../config/constants';
import './EthPayment.css';

const EthPayment = ({ orderId, amountVND, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async () => {
    setError('');
    setLoading(true);

    try {
      if (!window.ethereum) {
        throw new Error('Vui lòng cài đặt MetaMask!');
      }

      // Kết nối ví
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      
      const exchangeRate = 78696589;
      const ethAmount = (amountVND / exchangeRate).toFixed(18);
      const weiAmount = ethers.parseEther(ethAmount);

      // Khởi tạo smart contract
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        ContractABI.abi,
        signer
      );

      // Gửi giao dịch
      const tx = await contract.payOrder(orderId, {
        value: weiAmount,
      });

      await tx.wait();

      // Callback cho component cha
      onSuccess(tx.hash);
    } catch (err) {
      console.error(err);

      if (err.code === 'ACTION_REJECTED') {
        setError('Bạn đã từ chối giao dịch.');
      } else if (
        err.code === -32002 ||
        (err.info && err.info.error && err.info.error.code === -32002)
      ) {
        setError(
          'Yêu cầu kết nối ví đang chờ. Vui lòng mở MetaMask để xác nhận!'
        );
      } else {
        setError(err.message || 'Lỗi thanh toán.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="eth-payment">
      <h3 className="eth-payment__title">Thanh toán Crypto (ETH)</h3>
      <p className="eth-payment__amount">
        Tổng tiền: {amountVND.toLocaleString()}đ
      </p>

      {error && <p className="eth-payment__error">{error}</p>}

      <button
        className={`eth-payment__button ${
          loading ? 'eth-payment__button--disabled' : ''
        }`}
        onClick={handlePayment}
        disabled={loading}
      >
        {loading ? 'Đang xử lý Blockchain...' : 'Thanh toán bằng MetaMask'}
      </button>
    </div>
  );
};

export default EthPayment;
