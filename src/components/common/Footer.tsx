import { Box, Grid, Typography, Link } from "@mui/material";

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        py: 4,
      }}
    >
      <Grid container spacing={4} justifyContent="center">
        {/* THÔNG TIN CÔNG TY */}
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            THÔNG TIN CÔNG TY
          </Typography>
          <Typography variant="body2">Techshop</Typography>
          <Typography variant="body2">
            • CÔNG TY CỔ PHẦN TECHSHOP VIỆT NAM
          </Typography>
          <Typography variant="body2">
            • Số 28/1/459 T3 Đức Giang, Phường Thượng Thanh, Quận Long Biên,
            Thành phố Hà Nội, Việt Nam
          </Typography>
          <Typography variant="body2">
            • SĐT: 024.7106.9999 – Email: contact@techshop.vn
          </Typography>
          <Typography variant="body2">
            • Website: techshoplaptop88.vn
          </Typography>
          <Typography variant="body2">
            • Mã số doanh nghiệp: 0108528423, cấp lần đầu ngày 28/11/2018
          </Typography>
        </Grid>

        {/* VỀ TECHSHOP */}
        <Grid item xs={12} sm={6} md={2.5}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            VỀ TECHSHOP
          </Typography>
          <Typography variant="body2">• Giới thiệu chung</Typography>
          <Typography variant="body2">• Chăm sóc khách hàng</Typography>
          <Typography variant="body2">• Hotline: 024.7106.9999</Typography>
          <Typography variant="body2">• Thời gian: 24/7</Typography>
          <Typography variant="body2">• Email: contact@techshop.vn</Typography>
          <Typography variant="body2">
            •{" "}
            <Link href="#" underline="hover">
              Liên hệ
            </Link>
          </Typography>
        </Grid>

        {/* CHÍNH SÁCH */}
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            CHÍNH SÁCH
          </Typography>
          {[
            "Chính sách mua hàng từ xa",
            "Chính sách đặt cọc sản phẩm",
            "Chính sách giao nhận - đổi trả",
            "Chính sách bảo hành",
            "Chính sách bảo mật thông tin",
            "Thỏa thuận sử dụng và quy định giao dịch chung",
          ].map((policy, index) => (
            <Typography key={index} variant="body2">
              •{" "}
              <Link href="#" underline="hover">
                {policy}
              </Link>
            </Typography>
          ))}
        </Grid>

        {/* THANH TOÁN & LOGO */}
        {/* <Grid item xs={12} sm={6} md={3}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            THANH TOÁN
          </Typography>
          <Typography variant="body2">
            • Thanh toán trực tuyến (Internet Banking)
          </Typography>
          <Typography variant="body2">
            • Thanh toán khi nhận hàng (COD)
          </Typography>
          <Box mt={2}>
            <img
              src="/footer.png" // Hãy chắc chắn ảnh ở public/footer.png
              alt="Bộ Công Thương"
              style={{ maxWidth: "180px" }}
            />
          </Box>
        </Grid> */}
      </Grid>
    </Box>
  );
};

export default Footer;
