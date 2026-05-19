import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { useAuth } from './AuthContext';

const CartContext = createContext(undefined);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const { isAuthenticated } = useAuth();

  // Load cart from localStorage or backend
  useEffect(() => {
    const loadCart = async () => {
      if (isAuthenticated) {
        try {
          const response = await axiosClient.get('/users/cart');
          const backendCart = response.data.data.cart;
          // Map backend cart to frontend structure
          const resolvePrice = (prod, sz) => {
            if (!prod) return 0;
            const variant = prod.variants?.find(v => v.weight === sz);
            return variant ? (variant.discountPrice || variant.price) : (prod.discountPrice || prod.price || 0);
          };

          const flatCart = backendCart
            .filter(item => item.product) // Filter out null products
            .map(item => ({
              ...item.product,
              id: item.product._id,
              selectedFlavor: item.flavor,
              selectedSize: item.size,
              quantity: item.quantity,
              price: resolvePrice(item.product, item.size)
            }));
          setCart(flatCart);
        } catch (error) {
          console.error('Failed to fetch cart from backend', error);
        }
      } else {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          setCart(JSON.parse(savedCart));
        } else {
          setCart([]);
        }
      }
    };
    loadCart();
  }, [isAuthenticated]);

  // Save cart to localStorage and backend
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    
    const saveCartToBackend = async () => {
      if (isAuthenticated) {
        try {
          const backendCart = cart.map(item => ({
            product: item.id || item._id,
            quantity: item.quantity,
            flavor: item.selectedFlavor,
            size: item.selectedSize
          }));
          await axiosClient.patch('/users/cart', { cart: backendCart });
        } catch (error) {
          console.error('Failed to save cart to backend', error);
        }
      }
    };
    
    saveCartToBackend();
  }, [cart, isAuthenticated]);

  const addToCart = (product, flavor, size, quantity) => {
    setCart((prev) => {
      const existingItemIndex = prev.findIndex(
        (item) => item.id === product.id && item.selectedFlavor === flavor && item.selectedSize === size
      );

      if (existingItemIndex > -1) {
        const newCart = [...prev];
        newCart[existingItemIndex].quantity += quantity;
        return newCart;
      }

      const resolvePrice = (prod, sz) => {
        if (!prod) return 0;
        const variant = prod.variants?.find(v => v.weight === sz);
        return variant ? (variant.discountPrice || variant.price) : (prod.discountPrice || prod.price || 0);
      };

      const resolvedPrice = resolvePrice(product, size);
      return [...prev, { ...product, selectedFlavor: flavor, selectedSize: size, quantity, price: resolvedPrice }];
    });
  };

  const removeFromCart = (id, flavor, size) => {
    setCart((prev) => prev.filter(
      (item) => !(item.id === id && item.selectedFlavor === flavor && item.selectedSize === size)
    ));
  };

  const updateQuantity = (id, flavor, size, quantity) => {
    if (quantity < 1) return;
    setCart((prev) =>
      prev.map((item) =>
        item.id === id && item.selectedFlavor === flavor && item.selectedSize === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
