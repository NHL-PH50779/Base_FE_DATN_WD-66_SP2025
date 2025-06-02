import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";

const images = ["./banner1.png", "./banner2.png"]; // Thêm nhiều ảnh nếu muốn

const Banner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "1200px",
        height: "500px",
        margin: "0 auto",
        overflow: "hidden",
        position: "relative",
        borderRadius: "10px",
      }}
    >
      <img
        src={images[currentIndex]}
        alt={`Banner ${currentIndex}`}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transition: "opacity 1s ease-in-out",
        }}
      />
    </Box>
  );
};

export default Banner;
