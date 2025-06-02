import { useState, type FC } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import type { Product } from "../types/product.type";

type ProductListProps = {
  product: Product;
};

const ProductList: FC<ProductListProps> = ({ product }) => {
  const nav = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  const handleAddToCart = () => {
    nav("/cart");
  };
  return (
    <Card
      sx={{
        maxWidth: 345,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <CardMedia
        component="img"
        alt="green iguana"
        height="140"
        image={product.image}
        sx={{
          objectFit: "contain",
          filter: isHovered ? "brightness(70%)" : "none",
          transition: "filter 0.5s",
        }}
      />
      <CardContent
        sx={{
          flex: "1 0 auto",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.5s",
        }}
      >
        <Button size="small" variant="contained" onClick={handleAddToCart}>
          Add to Cart
        </Button>
      </CardContent>
      <CardContent sx={{ flex: "1 0 auto" }}>
        <Typography gutterBottom variant="h5" component="div">
          <Link to={`/product/${product.id}`}>{product.title}</Link>
        </Typography>
        <Typography gutterBottom variant="h6" component="div">
          Price: ${product.price}
        </Typography>
      </CardContent>
      <CardActions sx={{ alignSelf: "flex-end" }}>
        <Button size="small">
          <Link to={`/product/${product.id}`}>Learn More</Link>
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductList;
