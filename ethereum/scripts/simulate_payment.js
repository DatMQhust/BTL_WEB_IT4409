// File: server/ethereum/scripts/simulate_payment.js
const hre = require("hardhat");

async function main() {
  // --- CẤU HÌNH TẠM THỜI (Sửa mỗi lần test) ---
  const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; //lấy ở terminal sau khi deploy
  const ORDER_ID_TO_PAY = "6946f8dde0a7b97cad8a28de"; //Lấy ở Postman sau khi tạo đơn hàng
  const AMOUNT_ETH = "0.01"; // Số tiền muốn trả
  // ---------------------------------------------

  console.log(`⏳ Đang kết nối tới Contract tại: ${CONTRACT_ADDRESS}`);

  //lấy Contract instance
  const PaymentContract = await hre.ethers.getContractFactory("ethPayment");
  const contract = PaymentContract.attach(CONTRACT_ADDRESS);

  // Lấy danh sách ví (Dùng ví thứ 2 để mua, ví 0 là chủ shop)
  const [owner, buyer] = await hre.ethers.getSigners();
  console.log(`👤 Người mua: ${buyer.address}`);

  // Thực hiện thanh toán
  console.log(` Đang thanh toán ${AMOUNT_ETH} ETH cho đơn hàng: ${ORDER_ID_TO_PAY}...`);
  
  const tx = await contract.connect(buyer).payOrder(ORDER_ID_TO_PAY, {
    value: hre.ethers.parseEther(AMOUNT_ETH)
  });

  console.log("-------------------------------------------------------------");
  console.log(" GIAO DỊCH THÀNH CÔNG!");
  console.log(" Transaction Hash (Copy cái này ném vào Postman):");
  console.log(tx.hash);
  console.log("-------------------------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});