import React from "react";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./src/pages/Home";
import Products from "./src/pages/Products";
import Categories from "./src/pages/Categories";
import Cart from "./src/pages/Cart";
import Checkout from "./src/pages/Checkout";
import Orders from "./src/pages/Orders";
import Account from "./src/pages/Account";
import NotFound from "./src/pages/NotFound";
import { CartProvider } from "./src/context/cartcontext";
import Wishlist from "./src/pages/Wishlist";
import Profile from "./src/pages/Profile";
import { ThemeProvider } from "./src/context/ThemeContext";

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Theme appearance="inherit" radius="large" scaling="100%">
        <CartProvider>
        <Router>
          <main className="min-h-screen font-sans">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/account" element={<Account />} />
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
      </Theme>
    </ThemeProvider>
  );
};

export default App;
