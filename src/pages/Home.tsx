import React, { useEffect, useState } from "react";
import { Container, Stack } from "@mui/material";
import type { Product } from "../types/product.type";
import instance from "../apis";
import ProductList from "../components/ProductList";

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    setLoading(true);
    const getProducts = async () => {
      try {
        const { data } = await instance.get("/products");
        console.log(data);
        setProducts(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, []);
  return (
    <>
      <Container className="home">
        {/* <Loading isShow={loading} /> */}
        <Stack
          direction={"row"}
          flexWrap={"wrap"}
          gap={2}
          alignItems={"center"}
          justifyContent={"center"}
        >
          {products.map((product, index) => (
            <ProductList key={index} product={product} />
          ))}
        </Stack>
      </Container>
    </>
  );
};

export default Home;
