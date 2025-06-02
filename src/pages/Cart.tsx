import { CardMedia, Container, Stack, styled, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
// import { CartItem } from "src/types/Product";
import { Link } from "react-router-dom";
import type { CartItem } from "../types/product.type";

const labels = ["Image", "Product", "Price", "Quantity", "Subtotal", ""];
function Cart() {
  const [carts, setCarts] = useState<CartItem[]>([]);

  useEffect(() => {
    const cartStorage = localStorage.getItem("carts") || "[]";
    const carts = JSON.parse(cartStorage);
    setCarts(carts);
  }, []);

  const handleQuantityChange = (index: number, newQuantity: number) => {
    // Update the quantity of the cart item at the given index
    const updatedCarts = [...carts];
    updatedCarts[index].quantity = newQuantity;
    setCarts(updatedCarts);
  };

  const calculateSubtotal = (price: number, quantity: number) => {
    // Calculate the subtotal based on the price and quantity
    return price * quantity;
  };

  const handleDeleteItem = (index: number) => {
    // Remove the cart item at the given index
    const updatedCarts = carts.filter((_, i) => i !== index);
    setCarts(updatedCarts);
  };

  return (
    <>
      {/* <Banner /> */}
      {/* Tieu de */}
      {/* <Typography> <Link to={"/"}>Go to back home</Link></Typography> */}
      <Container>
        <Wrapper>
          <LabelWrapper
            direction="row"
            alignItems="center"
            justifyContent="space-around"
          >
            {labels.map((label, index) => (
              <Typography fontWeight={500} key={index}>
                {label}
              </Typography>
            ))}
          </LabelWrapper>
          {/* Cart Item */}
          {carts.map((item, index) => (
            <Stack
              key={index}
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Stack direction="row" alignItems="center" gap={4}>
                <CardMedia
                  component="img"
                  alt="Product Image"
                  height="50"
                  width="50"
                  image={item.product.image}
                  sx={{ objectFit: "contain" }}
                />
                <Typography fontWeight={500}>{item.product.title}</Typography>
              </Stack>
              <Typography fontWeight={500}>${item.product.price}</Typography>
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) =>
                  handleQuantityChange(index, parseInt(e.target.value))
                }
              />
              <Typography fontWeight={500}>
                ${calculateSubtotal(item.product.price, item.quantity)}
              </Typography>
              <DeleteIcon onClick={() => handleDeleteItem(index)} />
            </Stack>
          ))}
        </Wrapper>
      </Container>
    </>
  );
}

export default Cart;

const Wrapper = styled(Stack)({
  paddingTop: 72,
});

const LabelWrapper = styled(Stack)(({ theme }) => ({
  background: "#E3F2FD",
  height: 55,
}));
