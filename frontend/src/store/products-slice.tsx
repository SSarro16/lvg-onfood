import { createSlice } from "@reduxjs/toolkit";

type Product = {
  id: string,
  title: string,
  image: string,
  price: number,
  description?: string,
  quantity: number,
  estimatedCompletedTime: number,
  lastUpdatedTime: number,
}

type ProductsState = {
  products: Product[]
}

const initialCounterState: ProductsState = { products: [] };

const productsSlice = createSlice({
  name: "products",
  initialState: initialCounterState,
  reducers: {
    // add new product
    // set products
    // 
  },
});

export const productsActions = productsSlice.actions;

export default productsSlice.reducer;
export type {Product}