import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
    X,
    Check,
    Zap,
    Coins,
    ShieldCheck,
    Sparkles,
    Loader2,
    ArrowRight,
    CheckCircle2,
    Crown,
    Gift,
    Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { createOrder } from "@/features/createOrder";

const PLANS = [
    {
        id: "free",
        key: "Free",
        name: "Free Plan",
        price: "$0",
        period: "forever",
        credits: 100,
        creditsFormatted: "100 Credits",
        description: "Ideal for basic AI exploration and light daily tasks.",
        features: [
            "100 initial credits",
            "Standard response speed",
            "Basic conversation history",
            "Access to core models",
        ],
        popular: false,
        icon: Gift,
        gradient: "from-[#EB4C4C]/10 to-[#EB4C4C]/5",
        borderColor: "border-[#EB4C4C]/20",
    },
    {
        id: "starter",
        key: "Starter",
        name: "Starter Plan",
        price: "$9.99",
        period: "/month",
        credits: 1000,
        creditsFormatted: "1,000 Credits",
        description: "Perfect for regular users needing a daily generation boost.",
        features: [
            "1,000 monthly credits",
            "Faster response times",
            "Access to advanced chat models",
            "Priority query processing",
            "Full conversation history",
        ],
        popular: true,
        icon: Star,
        gradient: "from-[#EB4C4C]/15 to-[#EB4C4C]/5",
        borderColor: "border-[#EB4C4C]/40",
    },
    {
        id: "pro",
        key: "Pro",
        name: "Pro Plan",
        price: "$24.99",
        period: "/month",
        credits: 3000,
        creditsFormatted: "3,000 Credits",
        description: "Designed for power users, developers, and heavy workloads.",
        features: [
            "3,000 monthly credits",
            "Ultra-fast processing speed",
            "Unrestricted model access",
            "Priority 24/7 support",
            "Artifacts & canvas export options",
        ],
        popular: false,
        icon: Crown,
        gradient: "from-[#EB4C4C]/15 to-[#EB4C4C]/5",
        borderColor: "border-[#EB4C4C]/30",
    },
];

export const BillingPanel = ({ isOpen, onClose, onSelectPlan }) => {
    const [loadingPlan, setLoadingPlan] = useState(null);
    const [isRendered, setIsRendered] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [hoveredPlan, setHoveredPlan] = useState(null);

    const { user } = useSelector((state) => state.auth || {});
    const currentPlanName = user?.plan || "Free";

    useEffect(() => {
        if (isOpen) {
            setIsRendered(true);
            const timer = setTimeout(() => setIsVisible(true), 50);
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
            const timer = setTimeout(() => setIsRendered(false), 400);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isRendered) return null;

    const handleCheckout = async (plan) => {
        try {
            console.log(plan.id);

            const response = await createOrder(plan.id);
            console.log(response);

            // Extract checkoutUrl (handles both Axios response.data or direct object)
            const checkoutUrl = response?.data?.checkoutUrl || response?.checkoutUrl;

            if (checkoutUrl) {
                // Opens Stripe Checkout in a new tab/window
                window.open(checkoutUrl, "_self");
            } else {
                console.error("Checkout URL missing from response", response);
            }
        } catch (error) {
            console.error("Failed to initiate checkout:", error);
        }
    };

    return (
        <div
            className={`
        fixed inset-0 z-50 flex justify-end
        transition-all duration-400 ease-in-out py-2
        ${isVisible ? "opacity-100" : "pointer-events-none opacity-0"}
      `}
        >
            {/* Backdrop with blur and fade */}
            <div
                className={`
          absolute inset-0 bg-black/20 backdrop-blur-md
          transition-all duration-400 ease-in-out
          ${isVisible ? "opacity-100" : "opacity-0"}
        `}
                onClick={onClose}
            />

            {/* Sliding Drawer Panel */}
            <div
                className={`
          relative flex h-full w-full max-w-md flex-col
          bg-white/95 dark:bg-gray-950/95
          shadow-2xl
          transition-all duration-400 cubic-bezier(0.34, 1.56, 0.64, 1)
          ${isVisible ? "translate-x-0" : "translate-x-full"}
          rounded-l-3xl
          border-l border-[#EB4C4C]/10
          backdrop-blur-xl
        `}
            >
                {/* Panel Header */}
                <div className="flex h-20 shrink-0 items-center justify-between border-b border-[#EB4C4C]/10 px-6 bg-gradient-to-r from-[#EB4C4C]/[0.03] via-transparent to-[#EB4C4C]/[0.03]">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="absolute inset-0 rounded-2xl bg-[#EB4C4C] opacity-20 blur-xl" />
                            <div className="relative flex size-11 items-center justify-center rounded-2xl bg-[#EB4C4C] text-white shadow-lg shadow-[#EB4C4C]/25 transition-all duration-300 hover:scale-110 hover:rotate-6">
                                <Coins size={20} className="drop-shadow-sm" />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-base font-bold tracking-tight text-gray-900 dark:text-white">
                                    Subscription Plans
                                </h2>

                                <Badge
                                    variant="outline"
                                    className="h-5 border-[#EB4C4C]/25 bg-[#EB4C4C]/8 px-2 text-[10px] font-semibold text-[#EB4C4C] transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#EB4C4C]/10"
                                >
                                    UPGRADE
                                </Badge>
                            </div>

                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Choose a plan to top up your AI credits
                            </p>
                        </div>
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="size-10 rounded-2xl text-gray-500 transition-all duration-300 hover:scale-110 hover:rotate-90 hover:bg-[#EB4C4C]/8 hover:text-[#EB4C4C] active:scale-95 dark:text-gray-400 dark:hover:bg-[#EB4C4C]/10 dark:hover:text-[#EB4C4C]"
                    >
                        <X size={18} />
                    </Button>
                </div>

                {/* User Current Status Section */}
                <div className="shrink-0 border-b border-[#EB4C4C]/10 bg-gradient-to-r from-[#EB4C4C]/[0.03] via-transparent to-[#EB4C4C]/[0.03] px-6 py-4 backdrop-blur-sm">
                    <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                            <span className="text-gray-500 dark:text-gray-400">
                                Current Plan:
                            </span>

                            <span className="rounded-full bg-[#EB4C4C]/8 px-3 py-1 font-bold capitalize text-[#EB4C4C]">
                                {currentPlanName}
                            </span>
                        </div>

                        <div className="flex items-center gap-2 rounded-2xl border border-[#EB4C4C]/20 bg-[#EB4C4C]/7 px-4 py-1.5 text-xs font-medium text-[#EB4C4C] transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#EB4C4C]/10">
                            <Zap
                                size={14}
                                className="fill-[#EB4C4C]/20 animate-pulse"
                            />
                            <span className="font-semibold">
                                {user?.credits ?? 0} Credits Available
                            </span>
                        </div>
                    </div>
                </div>

                {/* Scrollable Plans List */}
                <ScrollArea className="min-h-0  flex-1 px-6 py-5">
                    <div className="space-y-6 py-1">
                        {PLANS.map((plan) => {
                            const isCurrent =
                                plan.key.toLowerCase() ===
                                currentPlanName.toLowerCase();

                            const isLoading = loadingPlan === plan.id;
                            const isHovered = hoveredPlan === plan.id;
                            const IconComponent = plan.icon;

                            return (
                                <div
                                    key={plan.id}
                                    onMouseEnter={() => setHoveredPlan(plan.id)}
                                    onMouseLeave={() => setHoveredPlan(null)}
                                    className={`
                    group relative flex flex-col justify-between
                    rounded-2xl border-2 p-5
                    transition-all duration-400 ease-out
                    ${
                        isHovered && !isCurrent
                            ? "-translate-y-1 shadow-2xl shadow-[#EB4C4C]/8"
                            : "shadow-sm"
                    }
                    ${
                        plan.popular && !isCurrent
                            ? `border-[#EB4C4C]/45 bg-gradient-to-br ${plan.gradient} shadow-[#EB4C4C]/10`
                            : isCurrent
                                ? "border-[#EB4C4C]/55 bg-gradient-to-br from-[#EB4C4C]/12 to-[#EB4C4C]/5 shadow-[#EB4C4C]/10"
                                : "border-gray-200/70 bg-white/70 hover:border-[#EB4C4C]/30 dark:border-gray-800 dark:bg-gray-900/60 dark:hover:border-[#EB4C4C]/30"
                    }
                  `}
                                >
                                    {/* Popular Badge */}
                                    {plan.popular && !isCurrent && (
                                        <div className="absolute -top-3 -right-3 flex items-center gap-1.5 rounded-full bg-[#EB4C4C] px-3.5 py-1 text-[11px] font-bold text-white shadow-lg shadow-[#EB4C4C]/25 transition-all duration-300 group-hover:scale-110 group-hover:rotate-2">
                                            <Sparkles
                                                size={12}
                                                className="animate-pulse"
                                            />
                                            <span>Most Popular</span>
                                        </div>
                                    )}

                                    <div>
                                        {/* Header */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`
                          flex size-10 items-center justify-center rounded-2xl
                          ${
                              isCurrent
                                  ? "bg-[#EB4C4C] text-white shadow-lg shadow-[#EB4C4C]/20"
                                  : plan.popular
                                      ? "bg-[#EB4C4C]/10 text-[#EB4C4C] shadow-lg shadow-[#EB4C4C]/10"
                                      : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                          }
                          transition-all duration-300 group-hover:scale-110 group-hover:rotate-6
                        `}
                                                >
                                                    <IconComponent size={18} />
                                                </div>

                                                <span className="text-base font-bold text-gray-900 dark:text-white">
                                                    {plan.name}
                                                </span>
                                            </div>

                                            {isCurrent && (
                                                <Badge
                                                    variant="secondary"
                                                    className="flex items-center gap-1.5 border border-[#EB4C4C]/20 bg-[#EB4C4C]/8 px-3 py-1 text-xs font-semibold text-[#EB4C4C] transition-all duration-300 hover:scale-105"
                                                >
                                                    <CheckCircle2
                                                        size={13}
                                                        className="animate-pulse"
                                                    />
                                                    Active
                                                </Badge>
                                            )}
                                        </div>

                                        {/* Pricing */}
                                        <div className="mt-3 flex items-baseline gap-1.5">
                                            <span className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                                                {plan.price}
                                            </span>

                                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                                {plan.period}
                                            </span>
                                        </div>

                                        {/* Credits Badge */}
                                        <div className="mt-3 inline-flex items-center gap-2 rounded-2xl border border-[#EB4C4C]/20 bg-[#EB4C4C]/7 px-3.5 py-1.5 text-xs font-semibold text-[#EB4C4C] transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-[#EB4C4C]/10">
                                            <Zap
                                                size={14}
                                                className="fill-[#EB4C4C]/15 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12"
                                            />
                                            <span>{plan.creditsFormatted}</span>
                                        </div>

                                        {/* Description */}
                                        <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                                            {plan.description}
                                        </p>

                                        <Separator className="my-4 bg-gradient-to-r from-transparent via-[#EB4C4C]/15 to-transparent" />

                                        {/* Features */}
                                        <div className="space-y-2.5">
                                            {plan.features.map((feature, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-center gap-3 text-sm text-gray-700 transition-all duration-300 group-hover:translate-x-1 dark:text-gray-300"
                                                    style={{
                                                        transitionDelay: `${idx * 50}ms`,
                                                    }}
                                                >
                                                    <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#EB4C4C]/10 text-[#EB4C4C] transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-[#EB4C4C]/10">
                                                        <Check size={12} />
                                                    </div>

                                                    <span>{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <Button
                                        disabled={isCurrent || isLoading}
                                        onClick={() => handleCheckout(plan)}
                                        className={`
                      group/btn relative mt-5 h-11 w-full overflow-hidden rounded-2xl text-sm font-semibold
                      transition-all duration-300 active:scale-[0.97]
                      ${
                          isCurrent
                              ? "cursor-default bg-gray-100 text-gray-400 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-500 dark:hover:bg-gray-800"
                              : plan.popular
                                  ? "bg-[#EB4C4C] text-white shadow-md shadow-[#EB4C4C]/15 hover:bg-[#d94343] hover:scale-[1.02] hover:shadow-xl hover:shadow-[#EB4C4C]/20"
                                  : "border-2 border-gray-200 bg-white text-gray-900 hover:border-[#EB4C4C]/40 hover:bg-[#EB4C4C]/5 hover:text-[#EB4C4C] hover:shadow-xl dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:hover:border-[#EB4C4C]/40 dark:hover:bg-[#EB4C4C]/10"
                      }
                    `}
                                        variant={
                                            isCurrent
                                                ? "ghost"
                                                : plan.popular
                                                    ? "default"
                                                    : "outline"
                                        }
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center gap-2">
                                                <Loader2
                                                    size={16}
                                                    className="animate-spin"
                                                />
                                                <span>Redirecting...</span>
                                            </div>
                                        ) : isCurrent ? (
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 size={16} />
                                                <span>Current Active Plan</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center gap-2">
                                                <span>
                                                    Upgrade to {plan.key}
                                                </span>

                                                <ArrowRight
                                                    size={15}
                                                    className="transition-all duration-300 group-hover/btn:translate-x-2 group-hover/btn:scale-110"
                                                />
                                            </div>
                                        )}
                                    </Button>
                                </div>
                            );
                        })}
                    </div>
                </ScrollArea>

                {/* Footer Note */}
                <div className="shrink-0 border-t border-[#EB4C4C]/10 bg-gradient-to-r from-transparent via-[#EB4C4C]/[0.03] to-transparent p-4">
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-500 transition-all duration-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                        <ShieldCheck
                            size={16}
                            className="text-[#EB4C4C] transition-all duration-300 hover:scale-110 hover:rotate-12"
                        />
                        <span className="font-medium">
                            Encrypted payment processing powered by Stripe
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
