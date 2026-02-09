import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "../lib/supabase";

export interface FullProduct {
  id: string | number;
  title: string;
  price: number;
  image: string;
  category?: string;
  description?: string;
}

export interface CartItem extends FullProduct {
  quantity: number;
}

export interface WishlistItem extends FullProduct {}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  addToCart: (product: FullProduct, qty?: number) => void;
  updateQuantity: (id: string | number, quantity: number) => void;
  removeItem: (id: string | number) => void;

  wishlistItems: WishlistItem[];
  toggleWishlist: (product: FullProduct) => void;
  isInWishlist: (id: string | number) => boolean;
  removeFromWishlist: (id: string | number) => void;

  showAuthModal: boolean;
  authModalMessage: string;
  closeAuthModal: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMessage, setAuthModalMessage] = useState("");

  // Load cart & wishlist from Supabase
  const loadFromSupabase = useCallback(async (userId: string) => {
    try {
      const [cartRes, wishlistRes] = await Promise.all([
        supabase
          .from("cart_items")
          .select("product_id, quantity, title, price, image")
          .eq("user_id", userId),
        supabase
          .from("wishlist_items")
          .select("product_id, title, price, image")
          .eq("user_id", userId),
      ]);

      if (cartRes.error) console.error("Error loading cart:", cartRes.error);
      if (wishlistRes.error) console.error("Error loading wishlist:", wishlistRes.error);

      const cart: CartItem[] = (cartRes.data || []).map(row => ({
        id: row.product_id,
        quantity: row.quantity,
        title: row.title || "Unknown Product",
        price: row.price || 0,
        image: row.image || ""
      }));
      setCartItems(cart);

      const wishlist: WishlistItem[] = (wishlistRes.data || []).map(row => ({
        id: row.product_id,
        title: row.title || "Unknown Product",
        price: row.price || 0,
        image: row.image || ""
      }));
      setWishlistItems(wishlist);
    } catch (error) {
      console.error("Error loading from Supabase:", error);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadFromSupabase(user.id);
    } else {
      setCartItems([]);
      setWishlistItems([]);
    }
  }, [isAuthenticated, user?.id, loadFromSupabase]);

  // Helper for Supabase cart sync
  const syncCartItem = useCallback(async (product: FullProduct, quantity: number) => {
    if (!user) return;
    try {
      const productId = String(product.id);
      // 1. Try to update
      const { data, error: updateError } = await supabase
        .from("cart_items")
        .update({ 
          quantity,
          title: product.title,
          price: product.price,
          image: product.image
        })
        .eq("user_id", user.id)
        .eq("product_id", productId)
        .select();

      // 2. If nothing updated, insert
      if (!updateError && (!data || data.length === 0)) {
        await supabase
          .from("cart_items")
          .insert({
            user_id: user.id,
            product_id: productId,
            quantity: quantity,
            title: product.title,
            price: product.price,
            image: product.image
          });
      }
    } catch (err) {
      console.error("Failed to sync cart item:", err);
    }
  }, [user]);

  // Helper for Supabase wishlist sync
  const syncWishlistToggle = useCallback(async (product: FullProduct, isAdding: boolean) => {
    if (!user) return;
    try {
      const productId = String(product.id);
      if (isAdding) {
        await supabase
          .from("wishlist_items")
          .insert({ 
            user_id: user.id, 
            product_id: productId,
            title: product.title,
            price: product.price,
            image: product.image
          });
      } else {
        await supabase
          .from("wishlist_items")
          .delete()
          .eq("user_id", user.id)
          .eq("product_id", productId);
      }
    } catch (err) {
      console.error("Failed to sync wishlist:", err);
    }
  }, [user]);

  // ── Cart operations ──

  const addToCart = (product: FullProduct, qty: number = 1) => {
    if (!isAuthenticated || !user) {
      setAuthModalMessage("Login to buy");
      setShowAuthModal(true);
      return;
    }

    const productId = String(product.id);
    let finalQty = qty;
    
    setCartItems((prev) => {
      const exists = prev.find((p) => String(p.id) === productId);
      if (exists) {
        finalQty = exists.quantity + qty;
        return prev.map((p) => (String(p.id) === productId ? { ...p, quantity: finalQty } : p));
      }
      return [...prev, { ...product, id: productId, quantity: qty }];
    });

    // Synchronize after state update is queued
    syncCartItem(product, finalQty);
  };

  const updateQuantity = (id: string | number, quantity: number) => {
    const stringId = String(id);
    if (quantity < 1) {
      removeItem(id);
      return;
    }

    const item = cartItems.find((p) => String(p.id) === stringId);
    if (item) {
      syncCartItem(item, quantity);
    }

    setCartItems((prev) =>
      prev.map((p) => (String(p.id) === stringId ? { ...p, quantity } : p))
    );
  };

  const removeItem = (id: string | number) => {
    const stringId = String(id);
    setCartItems((prev) => prev.filter((p) => String(p.id) !== stringId));

    if (user) {
      supabase
        .from("cart_items")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", stringId)
        .then();
    }
  };

  // ── Wishlist operations ──

  const toggleWishlist = (product: FullProduct) => {
    if (!isAuthenticated || !user) {
      setAuthModalMessage("Login to add to wishlist");
      setShowAuthModal(true);
      return;
    }

    const productId = String(product.id);
    const exists = wishlistItems.some((w) => String(w.id) === productId);
    const isAdding = !exists;
    
    setWishlistItems((prev) => {
      if (exists) {
        return prev.filter((w) => String(w.id) !== productId);
      }
      return [...prev, { ...product, id: productId }];
    });

    syncWishlistToggle(product, isAdding);
  };

  const isInWishlist = (id: string | number) => {
    const stringId = String(id);
    return wishlistItems.some((item) => String(item.id) === stringId);
  };

  const removeFromWishlist = (id: string | number) => {
    const stringId = String(id);
    const item = wishlistItems.find(w => String(w.id) === stringId);
    setWishlistItems((prev) => prev.filter((w) => String(w.id) !== stringId));
    if (item) {
      syncWishlistToggle(item, false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount: cartItems.length,
        addToCart,
        updateQuantity,
        removeItem,

        wishlistItems,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,

        showAuthModal,
        authModalMessage,
        closeAuthModal: () => setShowAuthModal(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
};
