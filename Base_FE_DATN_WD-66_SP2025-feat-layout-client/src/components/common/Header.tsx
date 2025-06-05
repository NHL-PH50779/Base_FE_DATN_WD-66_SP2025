import {
  Badge,
  Box,
  Stack,
  Typography,
  styled,
  IconButton,
} from "@mui/material";
import { Link, NavLink } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const menus = [
  { label: "Trang chủ", link: "/" },
  { label: "Danh mục", link: "/shop" },
  { label: "Về chúng tôi", link: "/about" },
  { label: "Liên hệ", link: "/contact" },
  { label: "Tin tức", link: "/news" }, // Thêm mục Tin tức
];

const Header = () => {
  return (
    <Wrapper direction="row" justifyContent="space-between" alignItems="center">
      {/* Logo */}
      <Box>
        <img width={100} height={100} src="/logo.png" alt="logo" />
      </Box>

      {/* Menu */}
      <Stack
        direction="row"
        spacing={6}
        sx={{
          display: { xs: "none", md: "flex" }, // Ẩn menu trên mobile
        }}
      >
        {menus.map((menu, index) => (
          <NavLink
            key={index}
            to={menu.link}
            style={{ textDecoration: "none" }}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <MenuLink>{menu.label}</MenuLink>
          </NavLink>
        ))}
      </Stack>

      {/* Icons */}
      <Stack direction="row" spacing={3} alignItems="center">
        <Link to={"/login"}>
          <IconButton>
            <img src="/user.svg" alt="user" width={20} />
          </IconButton>
        </Link>
        <IconButton>
          <SearchIcon />
        </IconButton>
        <IconButton>
          <FavoriteBorderIcon />
        </IconButton>
        <Badge color="secondary" badgeContent={0}>
          <Link to="/cart">
            <IconButton>
              <img src="/cart.svg" alt="cart" width={20} />
            </IconButton>
          </Link>
        </Badge>
      </Stack>
    </Wrapper>
  );
};

export default Header;

// ===== Styled components =====
const Wrapper = styled(Stack)(({ theme }) => ({
  height: 100,
  padding: "0 20px",
  [theme.breakpoints.up("md")]: {
    padding: "0 50px",
  },
}));

const MenuLink = styled(Typography)(({ theme }) => ({
  position: "relative",
  transition: "all 0.3s ease",
  paddingBottom: 4,
  fontWeight: 500,
  color: "#000",
  "&:hover": {
    transform: "translateY(-2px)",
    fontWeight: 600,
  },
  "&.active": {
    borderBottom: `2px solid ${theme.palette.primary.main}`,
    color: theme.palette.primary.main,
  },
}));