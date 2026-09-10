import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { XCircle, RefreshCw, ArrowLeft, ShieldAlert } from "lucide-react";

export const PaymentFailed = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md rounded-2xl border border-border/60 bg-card/95 p-6 shadow-2xl backdrop-blur-xl text-center space-y-5">
        {/* Failure Icon */}
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-destructive/10 text-destructive ring-1 ring-destructive/20">
          <XCircle size={32} />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-xl font-extrabold tracking-tight text-foreground">
            Payment Cancelled
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your transaction was not completed. No charges were made to your account.
          </p>
        </div>

        {/* Security Info Card */}
        <div className="flex items-center gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-left text-xs text-muted-foreground">
          <ShieldAlert size={18} className="shrink-0 text-amber-500" />
          <span>
            If your payment failed unexpectedly, please verify your card details or try a different payment method.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-2">
          <button
            onClick={() => navigate(-1)}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground shadow-xs transition-all hover:bg-primary/90 active:scale-[0.98]"
          >
            <RefreshCw size={13} className="transition-transform duration-300 group-hover:rotate-180" />
            <span>Try Again</span>
          </button>

          <Link
            to="/"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-border/70 bg-background/80 py-2.5 text-xs font-semibold text-foreground transition-all hover:bg-accent hover:text-accent-foreground active:scale-[0.98]"
          >
            <ArrowLeft size={13} />
            <span>Return to App</span>
          </Link>
        </div>
      </div>
    </div>
  );
};