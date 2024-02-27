import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/Home";
import LogInPage from "./pages/LogIn";

const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: '/login', element: <LogInPage />}
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
