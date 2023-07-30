import express from "express";
import { stripe } from "../middlewares/stripe";
import User from "../models/User";
import Subscription from "../models/Subscription";
import { checkAuth } from "../middlewares/checkcheck";
import { generateSubscriptionID } from "../utils/gen-id";

const router = express.Router();

router.post("/craeteSubscriptionPlan", async(req: any, res: any) => {
  // "Basic", "Standard", "Premium"
  const response = await Subscription.create(
    { subscriptionID: generateSubscriptionID(), access: "Basic" },
    { subscriptionID: generateSubscriptionID(), access: "Standard" },
    { subscriptionID: generateSubscriptionID(), access: "Premium" }
  );
  console.log('craeteSubscriptionPlan: ', response)

  return res.json(response)
})

router.get("/prices", async (req: any, res: any) => {
  const prices = await stripe.prices.list({
    apiKey: process.env.STRIPE_SECRET_KEY,
  });

  return res.json(prices);
});

router.post("/session", checkAuth, async (req: any, res: any) => {
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
      customer: user?.membership.stripeCustomerID,
    },
    {
      apiKey: process.env.STRIPE_SECRET_KEY,
    }
  );
  console.log("user?.membership.stripeCustomerID: ", user?.membership.stripeCustomerID)

  return res.json(session);
});

export default router;
