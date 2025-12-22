# Sample Hardhat Project

Mạng Blockchain ảo bằng Hardhat framework

# Use case: Thanh toán đơn hàng bằng ETH cryptocurrency
## Flow:
**Quy trình:**
1. Khách hàng chọn phương thức thanh toán là "ETH" khi tạo đơn hàng
2. Frontend kết nối với ví Ethereum của khách hàng (MetaMask, v.v.)
3. Smart contract thanh toán được gọi để thực hiện giao dịch
4. Khách hàng ký xác nhận giao dịch trong ví
5. Sau khi giao dịch được đưa lên blockchain, nhận được transaction hash
6. Khách hàng gọi API `POST /api/payment/confirm` và gửi transaction hash
7. Hệ thống cập nhật trạng thái thanh toán thành `Completed`

# Deploy:

**Bước 1: khởi tạo môi trường**
```shell
cd .\ethereum
npm install
```

**Bước 2: Dịch smart contract sang mã máy**
```shell
npx hardhat compile
```

**Bước 3: Khởi chạy mạng blockchain ảo (Mở terminal mới và để nó chạy ngầm)**
```shell
npx hardhat node
```

**Bước 4: Deploy**
```shell
cd ethereum
npx hardhat run scripts/deploy.js --network localhost
```

**Bước 5: Cài đặt MetaMask, thêm mạng localhost, import ví thử nghiệm**

**Bước 6: Tạo đơn hàng với phương thức thanh toán là "ETH"**

**Bước 7: Giao dịch thành công, trạng thái thanh toán được cập nhật thành "Completed"** 

