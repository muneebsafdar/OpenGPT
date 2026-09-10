import Home from './pages/Home';
import Login from './pages/Login';
import { useEffect, useState } from 'react'; // 1. Import useState
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from './slice/authSlice';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import ProtectedRoutes from './ProtectedRoute/ProtectedRoutes';
import getCurrentUser from './features/GetCurrentUser';
import { PaymentSuccess } from './pages/PaymentSuccess';
import { PaymentFailed } from './pages/PaymentFailed';
import { Loader2 } from 'lucide-react'; // Optional spinner

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  
  // 2. Track authentication loading state
  const [authLoading, setAuthLoading] = useState(true);

  const handleGetCurrentUser = async () => {
    try {
      const data = await getCurrentUser();
      dispatch(setUser(data.user));
    } catch (error) {
      console.error("Error fetching current user:", error);
    } finally {
      // 3. Mark auth check as finished regardless of success/error
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    handleGetCurrentUser();
  }, []);

  // 4. Don't render routes until auth check finishes
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <Login />}
        />

        {/* Protected routes */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<Home />} />
          <Route path="/payment-success/:sessionId" element={<PaymentSuccess />} />
          <Route path="/payment-failed" element={<PaymentFailed />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;