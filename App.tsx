import React, { useEffect } from "react";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Home from "./src/pages/Home";
import Products from "./src/pages/Products";
import Categories from "./src/pages/Categories";
import Cart from "./src/pages/Cart";
import Checkout from "./src/pages/Checkout";
import Orders from "./src/pages/Orders";
import Account from "./src/pages/Account";
import NotFound from "./src/pages/NotFound";
import { CartProvider, useCart } from "./src/context/cartcontext";
import AuthModal from "./src/components/AuthModal";
import Wishlist from "./src/pages/Wishlist";
import Profile from "./src/pages/Profile";
import Payment from "./src/pages/Payment";
import Login from "./src/pages/Login";
import { ThemeProvider } from "./src/context/ThemeContext";
import { AuthProvider } from "./src/context/AuthContext";

const routeTitles: Record<string, string> = {
  "/": "Home",
  "/products": "Products",
  "/categories": "Categories",
  "/cart": "Cart",
  "/checkout": "Checkout",
  "/payment": "Payment",
  "/orders": "Orders",
  "/wishlist": "Wishlist",
  "/profile": "Profile",
  "/account": "My Account",
  "/login": "Login",
};

const TitleUpdater = () => {
  const location = useLocation();

  useEffect(() => {
    const pageTitle = routeTitles[location.pathname];
    document.title = pageTitle ? `EcomStore | ${pageTitle}` : "EcomStore";
  }, [location.pathname]);

  return null;
};

const AuthModalRenderer = () => {
  const { showAuthModal, authModalMessage, closeAuthModal } = useCart();
  return (
    <AuthModal
      isOpen={showAuthModal}
      onClose={closeAuthModal}
      message={authModalMessage}
    />
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Theme appearance="inherit" radius="large" scaling="100%">
        <AuthProvider>
        <CartProvider>
        <Router>
          <TitleUpdater />
          <AuthModalRenderer />
          <main className="min-h-screen font-sans">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<Products />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/account" element={<Account />} />
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <ToastContainer
              position="top-right"
              autoClose={3000}
              newestOnTop
              closeOnClick
              pauseOnHover
            />
          </main>
        </Router>
      </CartProvider>
      </AuthProvider>
      </Theme>
    </ThemeProvider>
  );
};

export default App;
