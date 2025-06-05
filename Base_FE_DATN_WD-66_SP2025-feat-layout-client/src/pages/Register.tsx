import {
  Box,
  Button,
  Divider,
  Link as MuiLink,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import { useState } from "react";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    server: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: "", server: "" });
  };

  const validate = () => {
    const newErrors = {
      email: "",
      password: "",
      confirmPassword: "",
      server: "",
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((msg) => msg === "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors((prev) => ({
          ...prev,
          server: data.message || "Register failed",
        }));
        return;
      }

      // Nếu server trả token:
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // Redirect sau khi đăng ký thành công
      navigate("/login"); // hoặc navigate("/") nếu muốn về trang chủ
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        server: "Network error. Please try again.",
      }));
    }
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
          Tạo tài khoản mới
        </Typography>
        <Typography textAlign="center" mb={3}>
          Bạn đã có tài khoản?{" "}
          <MuiLink component={Link} to="/login" color="primary">
            Đăng nhập
          </MuiLink>
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              fullWidth
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              label="Mật khẩu"
              type="password"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              fullWidth
              error={!!errors.password}
              helperText={errors.password}
            />
            <TextField
              label="Nhập lại mật khẩu"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              fullWidth
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
            />

            {errors.server && (
              <Typography color="error" fontSize="0.875rem">
                {errors.server}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ bgcolor: "#1E1E4F", py: 1.5 }}
            >
              Tạo tài khoản
            </Button>
          </Stack>
        </form>

        {/* <Typography
          variant="body2"
          textAlign="center"
          color="text.secondary"
          mt={2}
        >
          By creating account, you agree to our{" "}
          <MuiLink href="#" color="primary">
            Terms of Service
          </MuiLink>
        </Typography> */}

        <Divider sx={{ my: 2 }}>Hoặc tạo tài khản cùng với:</Divider>

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
      </Box>
    </Box>
  );
};

export default Register;
