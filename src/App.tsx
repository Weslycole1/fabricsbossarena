import { Routes, Route, useLocation, Navigate, Outlet } from "react-router-dom";
import { useEffect, useRef, useState, Suspense, lazy } from "react";
import type { Product } from "./types/product";

import Home from "./pages/Home";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import Products from "./pages/Products";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Account from "./pages/Account";
import ProductDetails from "./pages/ProductDetails";
import { supabase } from "./lib/supabase";

// Admin dashboard is code-split: storefront visitors never download it.
const AdminAuthProvider = lazy(() =>
  import("./admin/context/AdminAuthContext").then((m) => ({ default: m.AdminAuthProvider }))
);
const AdminRoute = lazy(() => import("./admin/components/AdminRoute"));
const AdminLayout = lazy(() => import("./admin/components/AdminLayout"));
const AdminLogin = lazy(() => import("./admin/pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./admin/pages/AdminDashboard"));
const AdminProductsList = lazy(() => import("./admin/pages/AdminProductsList"));
const AdminProductForm = lazy(() => import("./admin/pages/AdminProductForm"));
const AdminOrdersList = lazy(() => import("./admin/pages/AdminOrdersList"));
const AdminOrderDetails = lazy(() => import("./admin/pages/AdminOrderDetails"));

const AdminFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
    <div className="h-10 w-10 rounded-full border-4 border-[#E8E0D5] border-t-[#C9974A] animate-spin" />
  </div>
);

const WISHLIST_KEY_PREFIX = "fabricsbossarena-wishlist";
// Legacy key from before wishlists were namespaced per user — no longer read
// or written to, since it was shared across every account on the browser.
const LEGACY_SHARED_WISHLIST_KEY = "fabricsbossarena-wishlist";

const wishlistKeyFor = (userId: string | null) =>
  userId ? `${WISHLIST_KEY_PREFIX}-${userId}` : `${WISHLIST_KEY_PREFIX}-guest`;

function App() {
  const location = useLocation();
  const [cart, setCart] = useState<any[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const prevUserIdRef = useRef<string | null>(null);
  const [wishlist, setWishlist] = useState<number[]>([]);

  // One-time cleanup: remove the old shared key so it can't be mistaken for
  // any account's data going forward (it was never user-specific).
  useEffect(() => {
    try {
      localStorage.removeItem(LEGACY_SHARED_WISHLIST_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  // Load the wishlist for whichever user is currently signed in (or the
  // guest bucket when signed out). Runs again every time the user changes,
  // so a brand new account — or switching accounts on the same browser —
  // always starts from that user's own (initially empty) data.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(wishlistKeyFor(userId));
      setWishlist(saved ? JSON.parse(saved) : []);
    } catch {
      setWishlist([]);
    }
  }, [userId]);

  // Persist the wishlist under the current user's own namespaced key only.
  useEffect(() => {
    try {
      localStorage.setItem(wishlistKeyFor(userId), JSON.stringify(wishlist));
    } catch {
      /* ignore */
    }
  }, [wishlist, userId]);

  // Cart isn't persisted to storage, but it lives in this top-level component
  // for the whole SPA session, so it must be cleared on logout or when a
  // different account signs in — otherwise one user's cart stays visible to
  // the next. A guest's cart is intentionally kept when they log in, so a
  // "please log in to checkout" flow doesn't lose their items.
  useEffect(() => {
    const prevUserId = prevUserIdRef.current;
    if (prevUserId !== null && prevUserId !== userId) {
      setCart([]);
    }
    prevUserIdRef.current = userId;
  }, [userId]);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(Boolean(data.session));
      setUserId(data.session?.user.id ?? null);
    };

    void checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(Boolean(session));
      setUserId(session?.user.id ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);

      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, qty: item.qty + quantity }
            : item
        );
      }

      return [...prevCart, { ...product, qty: quantity }];
    });
  };

  const toggleWishlist = (id: number) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const clearWishlist = () => setWishlist([]);

  const sharedNav = {
    wishlistLength: wishlist.length,
    cartLength: cart.length,
  };

  const requireAuth = (element: React.ReactNode) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace state={{ from: location }} />;
    }
    return element;
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Home
            cart={cart}
            setCart={setCart}
            addToCart={addToCart}
            wishlist={wishlist}
            toggleWishlist={toggleWishlist}
          />
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Login />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route
        path="/home"
        element={
          <Home
            cart={cart}
            setCart={setCart}
            addToCart={addToCart}
            wishlist={wishlist}
            toggleWishlist={toggleWishlist}
          />
        }
      />
      <Route
        path="/cart"
        element={<Cart cart={cart} setCart={setCart} {...sharedNav} />}
      />
      <Route
        path="/wishlist"
        element={requireAuth(
          <Wishlist
            wishlist={wishlist}
            toggleWishlist={toggleWishlist}
            addToCart={addToCart}
            cartLength={cart.length}
          />
        )}
      />
      <Route
        path="/account"
        element={requireAuth(
          <Account clearWishlist={clearWishlist} {...sharedNav} />
        )}
      />
      <Route
        path="/products"
        element={
          <Products
            wishlist={wishlist}
            toggleWishlist={toggleWishlist}
            addToCart={addToCart}
            cartLength={cart.length}
          />
        }
      />
      <Route
        path="/products/:id"
        element={
          <ProductDetails addToCart={addToCart} {...sharedNav} />
        }
      />
      <Route path="/about" element={<About {...sharedNav} />} />
      <Route path="/contact" element={<Contact {...sharedNav} />} />

      {/* Admin dashboard — code-split, single AdminAuthProvider shared by login + guarded routes */}
      <Route
        element={
          <Suspense fallback={<AdminFallback />}>
            <AdminAuthProvider>
              <Outlet />
            </AdminAuthProvider>
          </Suspense>
        }
      >
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProductsList />} />
          <Route path="products/new" element={<AdminProductForm />} />
          <Route path="products/edit/:id" element={<AdminProductForm />} />
          <Route path="orders" element={<AdminOrdersList />} />
          <Route path="orders/:id" element={<AdminOrderDetails />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
