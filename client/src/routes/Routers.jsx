import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import Spinner from "../components/Spinner";

// ─────────────────────────────────────────────
// 🔹 EAGER — Core shopping pages (always bundled)
// ─────────────────────────────────────────────
import Home from "../pages/Home/Home";
import Products from "../pages/Products/Products";
import ProductPage from "../components/ProductListing/ProductPage.jsx";
import PageNotFound from "../pages/PageNotFound";

// ─────────────────────────────────────────────
// 🔹 LAZY — Auth pages
// ─────────────────────────────────────────────
const Login          = lazy(() => import("../pages/Auth/Login"));
const Register       = lazy(() => import("../pages/Auth/Register"));
const ForgotPassword = lazy(() => import("../pages/Auth/ForgotPassword"));

// ─────────────────────────────────────────────
// 🔹 LAZY — User pages
// ─────────────────────────────────────────────
const Dashboard    = lazy(() => import("../pages/user/Dashboard"));
const Orders       = lazy(() => import("../pages/user/Orders/Orders"));
const Wishlist     = lazy(() => import("../pages/user/Wishlist/Wishlist"));
const Cart         = lazy(() => import("../pages/user/Cart/Cart"));
const Shipping     = lazy(() => import("../pages/user/Cart/Shipping"));
const OrderSuccess = lazy(() => import("../pages/user/Cart/OrderSuccess"));
const OrderFailed  = lazy(() => import("../pages/user/Cart/OrderFailed"));
const OrderDetails = lazy(() => import("../pages/user/Orders/OrderDetails"));
const Checkout     = lazy(() => import("../pages/user/Checkout/Checkout"));

// ─────────────────────────────────────────────
// 🔹 LAZY — Admin pages
// ─────────────────────────────────────────────
const AdminDashboard   = lazy(() => import("../pages/Admin/AdminDashboard"));
const AdminOrders      = lazy(() => import("../pages/Admin/AdminOrders"));
const UpdateOrders     = lazy(() => import("../pages/Admin/UpdateOrders"));
const AdminOrderDetails= lazy(() => import("../pages/Admin/AdminOrderDetails.jsx"));
const AdminLogin       = lazy(() => import("../pages/Admin/AdminLogin.jsx"));
const DeleteAllOrder   = lazy(() => import("../pages/DeleteAllOrder.jsx"));

// ─────────────────────────────────────────────
// 🔹 LAZY — Extra / marketing pages
// ─────────────────────────────────────────────
const Ourheritage     = lazy(() => import("../pages/Ourheritage/OurHeritage.jsx"));
const WeaveCollection = lazy(() => import("../pages/WeaveCollection.jsx"));
const StyleCollection = lazy(() => import("../pages/StyleCollection.jsx"));
const Contact         = lazy(() => import("../pages/contact/contact.jsx"));
const Founder         = lazy(() => import("../pages/founder/founder.jsx"));
const AtelierSection  = lazy(() => import("../components/AtelierSection.jsx"));
const Collection      = lazy(() => import("../pages/collection/Collection"));

// ─────────────────────────────────────────────
// 🔹 LAZY — Policy pages
// ─────────────────────────────────────────────
const Terms           = lazy(() => import("../pages/Policy/Terms.jsx"));
const Privacy         = lazy(() => import("../pages/Policy/Privacy.jsx"));
const CustomerService = lazy(() => import("../pages/Policy/CustomerService.jsx"));
const ExchangeReturn  = lazy(() => import("../pages/Policy/ExchangeReturn.jsx"));

// ─────────────────────────────────────────────
// 🔹 Route Guards
// ─────────────────────────────────────────────
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";

const Routers = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        {/* Main */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/search" element={<Products />} />
        <Route path="/atelier" element={<AtelierSection />} />
        <Route path="/founder" element={<Founder />} />

        {/* 🔹 Product Details Page */}
        <Route path="/product/:productId" element={<ProductPage />} />

        {/* Cart & Checkout Flow */}
        <Route path="/cart" element={<Cart />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/checkout" element={<Checkout />} />

        {/* Shipping and Order Confirmation Pages (protected routes) */}
        <Route element={<PrivateRoute />}>
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/order-success/:id" element={<OrderSuccess />} />
          <Route path="/order-failed" element={<OrderFailed />} />
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

        {/* Admin Login Page (Public) */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Protected Routes */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route path="dashboard/*" element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="orders/order_details/:id" element={<UpdateOrders />} />
          <Route path="/admin/orders/:id" element={<AdminOrderDetails />} />
        </Route>

        {/* Extra Pages */}
        <Route path="/ourheritage" element={<Ourheritage />} />
        <Route path="/weavecollection" element={<WeaveCollection />} />
        <Route path="/stylecollection" element={<StyleCollection />} />
        <Route path="/contact" element={<Contact />} />

        {/* Others */}
        <Route path="/all-order/delete" element={<DeleteAllOrder />} />
        <Route path="*" element={<PageNotFound />} />

        {/* Policy */}
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/customer-service" element={<CustomerService />} />
        <Route path="/exchange-return" element={<ExchangeReturn />} />

      </Routes>
    </Suspense>
  );
};

export default Routers;
