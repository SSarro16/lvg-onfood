import { createSlice } from "@reduxjs/toolkit";

type Product = {
  id: string;
  title: string;
  image: string;
  price: number;
  description?: string;
  quantity: number;
  estimatedCompletedTime: number;
  lastUpdatedTime: number;
};

type ProductsState = {
  products: Product[];
};

type DeleteProductAction = {
  payload: { id: string };
  type: string;
};

type AddNewProductAction = {
  payload: { product: Product };
  type: string;
};

type EditProductAction = {
  payload: { product: Product };
  type: string;
};

type SetProductsAction = {
  payload: { products: Product[] };
  type: string;
};

const initialCounterState: ProductsState = { products: [] };

const productsSlice = createSlice({
  name: "products",
  initialState: initialCounterState,
  reducers: {
    // add new product
    addNewProduct: (state, action: AddNewProductAction) => {
      const { product } = action.payload
      state.products.push(product)
    },
    // delete product
    deleteProduct: (state, action: DeleteProductAction) => {
      const {id} = action.payload
      state.products = state.products.filter((product) => product.id != id )
    },
    // edit product
    editProduct: (state, action: EditProductAction) => {
      const { product } = action.payload
      state.products = state.products.map((prod) => {
        if (prod.id != product.id) {
          return prod
        }
        return product
      })
    },
    // set products
    setProducts: (state, action: SetProductsAction) => {
      const { products } = action.payload
      state.products = products
    },
  },
});

export const productsActions = productsSlice.actions;  
export default productsSlice.reducer;
export type { Product };
