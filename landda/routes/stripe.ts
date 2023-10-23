import express from "express";
import User from "../models/user";
import { stripe } from "../middlewares/stripe";
import { validateToken } from "../middlewares/validate";

const router = express.Router();

// ____________________________________________________________ Stripe

router.get("/prices", async (req: any, res: any) => {
  const prices = await stripe.prices.list({
    apiKey: process.env.STRIPE_SECRET_KEY,
  });

  return res.json(prices);
});

router.post("/session", validateToken, async (req: any, res: any) => {
  const user = await User.findOne({ "profile.email": req.user });

  const session = await stripe.checkout.sessions.create(
    {
      mode: "subscription",
      // payment_method_type: ["card"],
      line_items: [
        {
          price: req.body.priceID,
          quantity: 1,
        },
      ],
      success_url: "http://localhost:3000",
      cancel_url: "http://localhost:3000",
      customer: user?.subs.access,
    },
    {
      apiKey: process.env.STRIPE_SECRET_KEY,
    }
  );
  // console.log("user?.subs.access: ", user?.subs.access)
  console.log('subscription success')

  return res.json(session);
});

// ____________________________________________________________ Stripe Subscribed

router.get("/subscribed", validateToken, async (req: any, res: any) => {
  const user = await User.findOne({ "profile.email": req.user });
  
  console.log('user: ', user)

  const subscriptions = await stripe.subscriptions.list(
    {
      customer: user?.subs.access,
      status: "all",
      expand: ["data.default_payment_method"],
    },
    {
      apiKey: process.env.STRIPE_SECRET_KEY,
    }
  );

  // res.json(subscriptions);
  if (!subscriptions.data.length) return res.json([]);

  //@ts-ignore
  const plan = subscriptions.data[0].plan.nickname;

  res.json(plan)  
});

export default router;
