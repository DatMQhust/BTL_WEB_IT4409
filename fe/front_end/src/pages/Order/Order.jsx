export default function CheckoutPage() {
  return (
    <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">

      {/* LEFT SECTION */}
      <div className="border rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Your Orders</h2>
        <p>You don't have any orders.</p>
      </div>

      {/* RIGHT SECTION */}
      <div className="border rounded-lg shadow p-6 bg-white overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Hướng dẫn thanh toán</h2>

        <h3 className="font-semibold text-green-600 mb-2">1. Phương thức thanh toán</h3>
        <ul className="list-disc ml-6 mb-4">
          <li>Thanh toán qua QR Code (Chuyển khoản ngân hàng)</li>
          <li>Thanh toán bằng xu (1 xu = 1,000đ)</li>
        </ul>

        <h3 className="font-semibold text-green-600 mb-2">2. Quy tắc chuyển khoản</h3>
        <ul className="list-disc ml-6 mb-4">
          <li>Vui lòng chuyển khoản đúng số tiền được hiển thị</li>
          <li>
            Ghi nội dung chuyển khoản theo cú pháp:{" "}
            <span className="font-bold">[Họ và tên] + [Số điện thoại đã đăng ký]</span>
          </li>
          <li>
            Ví dụ: <span className="font-bold">NguyenVanA 0987654321</span>
          </li>
          <li>Sau khi chuyển khoản xong, nhấn nút "Check Payment"</li>
          <li>Thời gian xử lý: 30s - 1 phút</li>
        </ul>

        <h3 className="font-semibold text-yellow-600 mb-2">3. Lưu ý quan trọng</h3>
        <ul className="list-disc ml-6 mb-4">
          <li>Đơn hàng sẽ tự động hủy sau 24 giờ nếu chưa thanh toán</li>
          <li>Địa chỉ nhận hàng là địa chỉ bạn đã cài đặt</li>
          <li>Số điện thoại nhận hàng là số điện thoại bạn đăng ký</li>
          <li>Nếu chuyển thừa tiền, hệ thống sẽ cộng vào tài khoản xu của bạn</li>
          <li>Nếu chuyển thiếu tiền hoặc nội dung sai, vui lòng liên hệ hỗ trợ</li>
        </ul>

        <h3 className="font-semibold text-blue-600 mb-2">4. Hỗ trợ</h3>
        <ul className="list-disc ml-6 mb-4">
          <li>Hotline: 0948377358</li>
          <li>Email: Quy160104@gmail.com</li>
          <li>Thời gian hỗ trợ: Buổi tối (19h - 23h)</li>
        </ul>
      </div>
    </div>
  );
}
