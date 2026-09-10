import { stripe } from "../config/stripe.js";

export const createStripeSessionUrl= async (userId,planName)=>{
    const selectedPlan = plans[planName];

    if (!selectedPlan) {
      return res.status(404).json({ error: "Plan not found" });
    }

     const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${selectedPlan.name} Plan`,
              description: `${selectedPlan.credits} Credits (${selectedPlan.validity})`,
            },
            unit_amount: Math.round(selectedPlan.amount * 100), // Convert to smallest currency unit (cents/paisa)
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-failed`,
      metadata: {
        userId,
        planName: selectedPlan.name,
        credits: String(selectedPlan.credits),
      },
    });

    return session
}

export const createBillingInDb = async (userId,selectedPlan)=>{
     const newBilling = await Billing.create({
      userId,
      orderId: session.id,
      paymentId: session.id, // Updated to PaymentIntent ID after successful payment via webhook
      amount: selectedPlan.amount,
      currency: "PKR",
      credits: selectedPlan.credits,
      plan: selectedPlan.name,
      status: "pending",
    });
    return newBilling
}