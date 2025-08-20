# Changelog

## [2024-12-19] - Tách phần hoàn hàng

### Thay đổi
- ✅ **Tách phần hoàn hàng ra khỏi trang Đơn hàng**
  - Loại bỏ các trạng thái hoàn hàng (7, 8, 9) khỏi OrderList.tsx
  - Phần hoàn hàng giờ đây được quản lý riêng biệt tại `/admin/return-requests`
  - Menu navigation đã được cập nhật với mục "Hoàn hàng" riêng

### Cải thiện
- 🔧 **OrderList.tsx**: Chỉ xử lý các trạng thái đơn hàng cơ bản (1-6)
- 🔧 **ReturnRequestList.tsx**: Xử lý tất cả yêu cầu hoàn hàng và hủy đơn
- 🎯 **UX**: Tách biệt rõ ràng giữa quản lý đơn hàng và quản lý hoàn hàng

### Truy cập
- **Đơn hàng**: http://localhost:5173/admin/orders
- **Hoàn hàng**: http://localhost:5173/admin/return-requests