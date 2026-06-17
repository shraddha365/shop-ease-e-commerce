import Stripe from "stripe";

export async function createPaymentIntent(req, res, next) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      res.status(503);
      throw new Error("Stripe is not configured");
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const amount = Math.round(Number(req.body.amount) * 100);
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: req.body.currency || "usd",
      automatic_payment_methods: { enabled: true },
      metadata: { userId: req.user._id.toString() }
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    next(error);
  }
}