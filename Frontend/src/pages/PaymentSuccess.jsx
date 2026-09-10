import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  CheckCircle2,
  Loader2,
  Zap,
  ArrowRight,
  AlertCircle,
  Receipt,
  Sparkles,
} from "lucide-react";
import { verifyPayment } from "@/features/verifyPayment";

export const PaymentSuccess = () => {
  // Extract sessionId using useParams instead of useSearchParams
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    if (!sessionId) {
      setError("No checkout session found.");
      setLoading(false);
      return;
    }

    const verifyCheckout = async () => {
      try {
        setLoading(true);
        const response = await verifyPayment(sessionId)

        console.log(response)
        if (response.success) {
          setOrderDetails(response);
        } else {
          setError("Failed to verify payment status.");
        }
      } catch (err) {
        console.error("Verification error:", err);
        setError(
          err.response?.data?.error || "Unable to verify transaction."
        );
      } finally {
        setLoading(false);
      }
    };

    verifyCheckout();
  }, [sessionId]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md rounded-2xl border border-border/60 bg-card/95 p-6 shadow-2xl backdrop-blur-xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-4 text-center">
            <Loader2 className="size-10 animate-spin text-amber-500" />
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-foreground">
                Verifying Payment...
              </h3>
              <p className="text-xs text-muted-foreground">
                Confirming your transaction with Stripe
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center text-center py-6 space-y-4">
            <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive ring-1 ring-destructive/20">
              <AlertCircle size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-foreground">
                Verification Failed
              </h3>
              <p className="text-xs text-muted-foreground">{error}</p>
            </div>
            <button
              onClick={() => navigate("/")}
              className="mt-2 w-full rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98]"
            >
              Return to Dashboard
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center space-y-5">
            {/* Success Icon */}
            <div className="relative flex size-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/30">
              <CheckCircle2 size={32} className="animate-in zoom-in-50 duration-300" />
              <Sparkles className="absolute -top-1 -right-1 size-5 text-amber-500 animate-pulse" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-extrabold tracking-tight text-foreground">
                Payment Successful!
              </h2>
              <p className="text-xs text-muted-foreground">
                Your credits have been added to your account.
              </p>
            </div>

            {/* Receipt Summary Box */}
            <div className="w-full rounded-xl border border-border/50 bg-muted/30 p-4 space-y-3 text-left">
              <div className="flex items-center gap-2 border-b border-border/40 pb-2 text-xs font-bold text-foreground">
                <Receipt size={14} className="text-amber-500" />
                <span>Order Summary</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plan</span>
                  <span className="font-semibold text-foreground capitalize">
                    {orderDetails?.billing?.plan}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Credits Added</span>
                  <span className="font-semibold text-amber-500 flex items-center gap-1">
                    <Zap size={12} className="fill-amber-500" />
                    +{orderDetails?.billing?.credits}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount Paid</span>
                  <span className="font-semibold text-foreground">
                    ${orderDetails?.billing?.amount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Status</span>
                  <span className="font-semibold text-emerald-500 capitalize">
                    {orderDetails?.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <Link
              to="/"
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90 active:scale-[0.98]"
            >
              <span>Back to Application</span>
              <ArrowRight
                size={14}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};