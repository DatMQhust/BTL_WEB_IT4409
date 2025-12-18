// smart_contract/contracts/EcommercePayment.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract ethPayment {
    address public owner;

    // Sự kiện được bắn ra khi nhận tiền thành công
    event PaymentReceived(string orderId, address from, uint256 amount, uint256 timestamp);

    constructor() {
        owner = msg.sender;
    }

    // Hàm thanh toán: Nhận OrderID và ETH
    function payOrder(string memory _orderId) public payable {
        require(msg.value > 0, "So tien phai lon hon 0");
        require(bytes(_orderId).length > 0, "Phai co Order ID");

        // Emit sự kiện để lưu log trên Blockchain
        emit PaymentReceived(_orderId, msg.sender, msg.value, block.timestamp);
    }

    // Hàm rút tiền về ví chủ shop (Admin)
    function withdraw() public {
        require(msg.sender == owner, "Chi chu shop moi duoc rut tien");
        payable(owner).transfer(address(this).balance);
    }
}