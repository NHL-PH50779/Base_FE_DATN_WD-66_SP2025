import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Stack,
  TextField,
  Typography,
  Link as MuiLink,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError(null);

    try {
      const response = await fetch("https://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Đăng nhập thất bại!");
        return;
      }

      const data = await response.json();
      // Lưu token
      localStorage.setItem("token", data.token);

      // Redirect ví dụ về trang dashboard
      navigate("/");
    } catch (err) {}
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor="#f9f9f9"
    >
      <Box width="100%" maxWidth={400} px={3}>
        <Typography variant="h4" fontWeight="bold" textAlign="center" mb={1}>
          Đăng nhập
        </Typography>
        <Typography textAlign="center" mb={3}>
          Bạn là người mới?{" "}
          <MuiLink component={Link} to="/register" color="primary">
            Tạo tài khoản
          </MuiLink>
        </Typography>

        <Stack spacing={2}>
          <TextField
            label="Email"
            placeholder="Nhập địa chỉ Email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Mật khẩu"
            placeholder="Nhập mật khẩu"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Stack direction="row" alignItems="center">
            <Checkbox
              checked={keepSignedIn}
              onChange={(e) => setKeepSignedIn(e.target.checked)}
            />
            <Typography>Lưu đăng nhập</Typography>
          </Stack>

          {error && (
            <Typography color="error" variant="body2" textAlign="center">
              {error}
            </Typography>
          )}

          <Button
            variant="contained"
            fullWidth
            sx={{ bgcolor: "#1E1E4F", py: 1.5 }}
            onClick={handleSubmit}
          >
            Sign In
          </Button>

          <MuiLink
            component={Link}
            to="/forgot-password"
            color="primary"
            underline="hover"
            textAlign="center"
          >
            Quên mật khẩu?
          </MuiLink>

          <Divider sx={{ my: 2 }}>Hoặc đăng nhập bằng:</Divider>

          <Button
            variant="outlined"
            fullWidth
            startIcon={<GoogleIcon />}
            sx={{ textTransform: "none" }}
          >
            Tiếp tục với Google
          </Button>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<FacebookIcon />}
            sx={{ textTransform: "none" }}
          >
            Tiếp tục với Facebook
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default Login;
