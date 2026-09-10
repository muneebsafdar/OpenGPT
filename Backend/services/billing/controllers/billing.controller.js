import { stripe } from "../config/stripe.js";
import { plans } from "../utils/plans.js";
import Billing from "../model/billing.model.js";
import axios from "axios";

// Helper 1: Create Stripe Checkout Session
// Helper 1: Create Stripe Checkout Session
const createStripeSessionUrl = async (userId, selectedPlan) => {
  const rawBaseUrl = process.env.CLIENT_URL || "http://localhost:5173";
  const baseUrl = rawBaseUrl.startsWith("http")
    ? rawBaseUrl
    : `http://${rawBaseUrl}`;

  return await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${selectedPlan.name} Plan`,
            description: `${selectedPlan.credits} Credits (${selectedPlan.validity})`,
          },
          unit_amount: Math.round(selectedPlan.amount * 100),
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    // Changed from ?session_id={CHECKOUT_SESSION_ID} to path parameter format
    success_url: `${baseUrl}/payment-success/{CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/payment-failed`,
    metadata: {
      userId,
      planName: selectedPlan.name,
      credits: String(selectedPlan.credits),
    },
  });
};
// Helper 2: Create Pending Billing Record
const createBillingInDb = async (userId, selectedPlan, sessionId) => {
  return await Billing.create({
    userId,
    orderId: sessionId,
    paymentId: sessionId,
    amount: selectedPlan.amount,
    currency: "PKR",
    credits: selectedPlan.credits,
    plan: selectedPlan.name,
    status: "pending",
  });
};

export const createOrder = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    const { planName } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "x-user-id header is required" });
    }

    if (!planName) {
      return res.status(400).json({ error: "planName is required in body" });
    }

    const selectedPlan = plans[planName];

    if (!selectedPlan) {
      return res.status(404).json({ error: "Plan not found" });
    }

    const session = await createStripeSessionUrl(userId, selectedPlan);
    const newBilling = await createBillingInDb(userId, selectedPlan, session.id);

    return res.status(201).json({
      success: true,
      checkoutUrl: session.url,
      billing: newBilling,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to create checkout order",
    });
  }
};

export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`Webhook Signature Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    try {
      const orderId = session.id;
      const paymentId = session.payment_intent;
      const userId = session.metadata?.userId;
      const creditsToAdd = Number(session.metadata?.credits || 0);
      const planName = session.metadata?.planName; // Extract planName directly from metadata

      // 1. Update Billing record
      const updatedBilling = await Billing.findOneAndUpdate(
        { orderId },
        { status: "paid", paymentId },
        { new: true }
      );

      // 2. Increment User credits via Auth service
      if (updatedBilling) {
        const response =await axios.post(`${process.env.AUTH_SERVICE_URL}/update-user`, {
          userId,
          credits: creditsToAdd,
          plan: planName, // Replaced undefined selectedPlan.name with planName
        });
        console.log(response.data)
      }

      console.log(`Payment succeeded for Order: ${orderId}`);
    } catch (error) {
      console.error("Error processing successful webhook:", error);
      return res.status(500).json({ error: "Database or service update failed" });
    }
  }

  return res.status(200).json({ received: true });
};

export const verifySession = async (req, res) => {
  try {
    const { sessionId } = req.query;

    if (!sessionId) {
      return res.status(400).json({ error: "Session ID is required" });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const billing = await Billing.findOne({ orderId: sessionId });

    if (!billing) {
      return res.status(404).json({ error: "Order record not found" });
    }

    return res.status(200).json({
      success: true,
      paymentStatus: session.payment_status,
      billing,
    });
  } catch (error) {
    console.error("Error verifying session:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to verify session status",
    });
  }
};