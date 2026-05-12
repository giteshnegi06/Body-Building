import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(undefined);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  const { isAuthenticated } = useAuth();

  // Load wishlist from localStorage or backend
  useEffect(() => {
    const loadWishlist = async () => {
      if (isAuthenticated) {
        try {
          const response = await axiosClient.get('/users/wishlist');
          const backendWishlist = response.data.data.wishlist;
          const mappedWishlist = backendWishlist
            .filter(p => p) // Filter out null products
            .map(p => ({
              ...p,
              id: p._id
            }));
          setWishlist(mappedWishlist);
        } catch (error) {
          console.error('Failed to fetch wishlist from backend', error);
        }
      } else {
        const saved = localStorage.getItem('wishlist');
        if (saved) setWishlist(JSON.parse(saved));
        else setWishlist([]);
      }
    };
    loadWishlist();
  }, [isAuthenticated]);

  // Save wishlist to localStorage and backend
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    
    const saveWishlistToBackend = async () => {
      if (isAuthenticated) {
        try {
          const ids = wishlist.map(item => item.id || item._id);
          await axiosClient.patch('/users/wishlist', { wishlist: ids });
        } catch (error) {
          console.error('Failed to save wishlist to backend', error);
        }
      }
    };
    
    saveWishlistToBackend();
  }, [wishlist, isAuthenticated]);

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) return prev.filter((p) => p.id !== product.id);
      return [...prev, product];
    });
  };

  const isInWishlist = (id) => wishlist.some((p) => p.id === id);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};
