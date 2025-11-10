import { Routes, Route } from "react-router-dom";

// 🔹 Core pages
import Home from "../pages/Home/Home";
import PageNotFound from "../pages/PageNotFound";

// 🔹 Auth pages
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ForgotPassword from "../pages/Auth/ForgotPassword";

// 🔹 User pages
import Dashboard from "../pages/user/Dashboard";
import Orders from "../pages/user/Orders/Orders";
import Wishlist from "../pages/user/Wishlist/Wishlist";
import Cart from "../pages/user/Cart/Cart";
import Shipping from "../pages/user/Cart/Shipping";
import OrderSuccess from "../pages/user/Cart/OrderSuccess";
import OrderFailed from "../pages/user/Cart/OrderFailed";
import OrderDetails from "../pages/user/Orders/OrderDetails";
import Checkout from "../pages/user/Checkout/Checkout";

// 🔹 Admin pages
import AdminDashboard from "../pages/Admin/AdminDashboard";
import AdminOrders from "../pages/Admin/AdminOrders";
import UpdateOrders from "../pages/Admin/UpdateOrders";
import DeleteAllOrder from "../pages/DeleteAllOrder.jsx";

// 🔹 Products
import Products from "../pages/Products/Products";
import ProductPage from "../components/ProductListing/ProductPage.jsx";

// 🔹 Extra pages
import Ourheritage from "../pages/Ourheritage/Ourheritage.jsx";
import WeaveCollection from "../pages/WeaveCollection.jsx";
import Contact from "../pages/contact/contact.jsx";
import StyleCollection from "../pages/StyleCollection.jsx";

// 🔹 Route Guards
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";

const Routers = () => {
  return (
    <Routes>
      {/* Main */}

      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/search" element={<Products />} />

      {/* 🔹 Product Details Page */}
      <Route path="/product/:productId" element={<ProductPage />} />

      {/* Cart & Checkout Flow */}
<Route path="/cart" element={<Cart />} />

{/* Checkout - address, payment, and review in one flow */}
<Route path="/checkout" element={<Checkout />} />

{/* Shipping and Order Confirmation Pages (protected routes) */}
<Route element={<PrivateRoute />}>
  <Route path="/shipping" element={<Shipping />} />
  <Route path="/order/confirm" element={<OrderSuccess />} />
  <Route path="/order/failed" element={<OrderFailed />} />
</Route>


      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* User Protected */}
      <Route path="/user" element={<PrivateRoute />}>
        <Route path="dashboard/*" element={<Dashboard />} />
        <Route path="orders" element={<Orders />} />
        <Route path="orders/order_details/:id" element={<OrderDetails />} />
        <Route path="wishlist" element={<Wishlist />} />
      </Route>

      {/* Admin Protected */}
      <Route path="/admin" element={<AdminRoute />}>
        <Route path="dashboard/*" element={<AdminDashboard />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="orders/order_details/:id" element={<UpdateOrders />} />
      </Route>

      {/* Extra Pages */}
      <Route path="/ourheritage" element={<Ourheritage />} />
      <Route path="/weavecollection" element={<WeaveCollection />} />
      <Route path="/stylecollection" element={<StyleCollection />} />
      <Route path="/contact" element={<Contact />} />

      {/* Others */}
      <Route path="/all-order/delete" element={<DeleteAllOrder />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default Routers;


