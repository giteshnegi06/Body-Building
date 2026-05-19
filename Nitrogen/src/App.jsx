/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Cart = lazy(() => import('./pages/Cart'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Admin = lazy(() => import('./pages/Admin'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ContactUs = lazy(() => import('./pages/ContactUs'));
const ShippingPolicy = lazy(() => import('./pages/ShippingPolicy'));
const ReturnsRefunds = lazy(() => import('./pages/ReturnsRefunds'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Loading = () => (
  <div className="min-h-screen bg-matte-black flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-neon-lime border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <div className="min-h-screen bg-matte-black text-soft-white selection:bg-neon-lime selection:text-matte-black">
              <ScrollToTop />
              <Suspense fallback={<Loading />}>
                <Routes>
                  {/* Admin route without standard header/footer */}
                  <Route 
                    path="/admin" 
                    element={
                      <ProtectedRoute requireAdmin={true}>
                        <Admin />
                      </ProtectedRoute>
                    } 
                  />
                
                {/* Main routes wrap */}
                <Route 
                  path="*" 
                  element={
                    <>
                      <Header />
                      <main>
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/shop" element={<Shop />} />
                          <Route path="/product/:id" element={<ProductDetails />} />
                          <Route path="/cart" element={<Cart />} />
                          <Route path="/wishlist" element={<Wishlist />} />
                          <Route path="/checkout" element={<Checkout />} />
                          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                          <Route path="/login" element={<Login />} />
                          <Route path="/register" element={<Register />} />
                          <Route path="/contact" element={<ContactUs />} />
                          <Route path="/shipping-policy" element={<ShippingPolicy />} />
                          <Route path="/returns-refunds" element={<ReturnsRefunds />} />
                          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                          <Route path="/terms-of-service" element={<TermsOfService />} />
                          <Route path="/faq" element={<FAQ />} />
                          {/* Fallback */}
                          <Route path="*" element={<Home />} />
                        </Routes>
                      </main>
                      <Footer />
                    </>
                  } 
                />
              </Routes>
            </Suspense>
          </div>
        </WishlistProvider>
      </CartProvider>
      </AuthProvider>
    </Router>
  );
}

