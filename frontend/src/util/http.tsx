// Http handler for the frontend
import { Product } from "../store/redux/products-slice";

type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

type ProdData = {
  title: string;
  image: string;
  price: number;
  description: string;
};

interface Handlers {
  errorHandler?: (error: string) => void;
  successHandler?: () => void;
  errorDeleteHandler?: (error: string) => void;
  successDeleteHandler?: () => void;
  errorSavingHandler?: (error: string) => void;
  successSavingHandler?: () => void;
}

const fetchBackend = async (
  url: string,
  method: Method,
  token?: string,
  bodydata?: ProdData
) => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return fetch(url, {
    method: method,
    headers: headers,
    body: JSON.stringify(bodydata),
  });
};

const backendUrl = "http://localhost:8080/api/v2";

// fetch products
const fetchProducts = async ({
  errorHandler,
  successHandler,
}: Handlers): Promise<Product[] | null> => {
  try {
    const res = await fetchBackend(`${backendUrl}/products`, "GET");
    const data = (await res.json()) as { products: Product[] };
    if (!res.ok) {
      throw new Error("Could not fetch products");
    }
    successHandler && successHandler();
    return data.products;
  } catch (error: any) {
    // TODO: Handle Error (Toasts)
    errorHandler &&
      errorHandler(error.message || "Error while fetching products");
  }
  return null;
};

// logout
const fetchLogout = async (
  token: string,
  { errorHandler, successHandler }: Handlers
): Promise<void> => {
  // assumption: token is valid
  try {
    const res = await fetchBackend(`${backendUrl}/auth/logout`, "POST", token);
    const data = await res.json();
    if (!res.ok || data.success !== true) {
      throw new Error("Could not logout");
    }
    successHandler && successHandler();
  } catch (error: any) {
    errorHandler && errorHandler(error.message || "Error while logging out");
  }
};

// add new product
const fetchAddProduct = async (
  token: string,
  bodyData: ProdData,
  { errorHandler, successHandler }: Handlers
): Promise<void> => {
  // assumption: token is valid
  try {
    const res = await fetchBackend(
      `${backendUrl}/products`,
      "PUT",
      token,
      bodyData
    );
    const data = await res.json();

    if (!res.ok || data.success !== true) {
      throw new Error("Could not add product");
    } else {
      successHandler && successHandler();
    }
  } catch (error: any) {
    errorHandler && errorHandler(error.message || "Error while adding product");
  }
};

//delete product

const fetchDeleteProduct = async (
  token: string,
  productId: string,
  { errorDeleteHandler, successDeleteHandler }: Handlers
): Promise<void> => {
  // assumption: token is valid
  try {
    const res = await fetchBackend(
      `${backendUrl}/products/${productId}`,
      "DELETE",
      token
    );
    const data = await res.json();

    if (!res.ok || data.success !== true) {
      throw new Error("Could not delete product");
    } else {
      successDeleteHandler;
    }
  } catch (error: any) {
    errorDeleteHandler;
  }
};

// patch product
const fetchUpdateProduct = async (
  token: string,
  productId: string,
  bodyData: ProdData,
  { errorSavingHandler, successSavingHandler }: Handlers
): Promise<void> => {
  // assumption: token is valid
  try {
    const res = await fetchBackend(
      `${backendUrl}/products/${productId}`,
      "PATCH",
      token,
      bodyData
    );
    const data = await res.json();
    if (!res.ok || data.success !== true) {
      throw new Error("Could not update product");
    } else {
      successSavingHandler && successSavingHandler();
    }
  } catch (error: any) {
    errorSavingHandler &&
      errorSavingHandler(error.message || "Error while updating product");
  }
};

export {
  fetchAddProduct,
  fetchLogout,
  fetchProducts,
  fetchDeleteProduct,
  fetchUpdateProduct,
};
