import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../utils/firebase";
import api from "../utils/axios";
import { FcGoogle } from "react-icons/fc";
import { Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { useDispatch } from "react-redux";
import { setUser } from "../slice/authSlice";

export const Login = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (token) => {
    try {
      const result = await api.post("/api/v1/auth/login", { token });
      if (result.data.success) {
        console.log("Login successful", result.data);
        dispatch(setUser(result.data.user));
      } else {
        console.error("Login failed", result.data.message);
        setError(result.data.message || "Authentication failed");
      }
    } catch (err) {
      console.log(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      await handleLogin(token);
    } catch (err) {
      console.log(err);
      setError("Google sign-in was cancelled or failed.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm space-y-6 rounded-2xl border border-border/60 bg-card p-6 shadow-xl sm:max-w-md sm:p-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
            <Sparkles className="size-6" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Welcome Back
          </h2>
          <p className="mt-1.5 text-xs text-muted-foreground sm:text-sm">
            Sign in to access your account
          </p>
        </div>

        {/* Dynamic Error Message */}
        {error && (
          <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-center text-xs font-medium text-destructive sm:text-sm">
            {error}
          </div>
        )}

        {/* Action Button */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="group relative flex w-full items-center justify-center gap-3 rounded-xl border border-border/80 bg-background px-4 py-3 text-xs font-semibold text-foreground shadow-sm transition-all duration-200 hover:bg-muted/50 hover:shadow-md active:scale-[0.99] sm:text-sm disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="size-5 animate-spin text-primary" />
            ) : (
              <>
                <FcGoogle className="size-5 shrink-0 transition-transform duration-200 group-hover:scale-110" />
                <span>Continue with Google</span>
              </>
            )}
          </button>
        </div>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-1.5 pt-2 text-center text-[11px] text-muted-foreground sm:text-xs">
          <ShieldCheck className="size-3.5 text-muted-foreground/80" />
          <span>Secure authentication</span>
        </div>
      </div>
    </div>
  );
};

export default Login;