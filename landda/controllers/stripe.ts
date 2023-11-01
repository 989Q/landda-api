import User from "../models/user";
import { Request, Response } from "express";
import { stripe } from "../middlewares/stripe";

export const getPrices = async (req: Request, res: Response) => {
  const prices = await stripe.prices.list({
    apiKey: process.env.STRIPE_SECRET_KEY,
  });

  return res.json(prices);
};

export const createSession = async (req: any, res: Response) => {
  const email = req.user.email;
  const user = await User.findOne({ "info.email": email });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const stripeCustomer = await stripe.customers.create(
    { email },
    { apiKey: process.env.STRIPE_SECRET_KEY }
  );
  const stripeID = stripeCustomer.id;

  // Update the user's subs object with the stripeID
  user.subs.stripeID = stripeID;

  // Save the updated user document to the database
  await user.save();

  const session = await stripe.checkout.sessions.create(
    {
      mode: "subscription",
      line_items: [
        {
          price: req.body.priceID,
          quantity: 1,
        },
      ],
      success_url: "http://localhost:3000",
      cancel_url: "http://localhost:3000",
      customer: user.subs.stripeID,
    },
    {
      apiKey: process.env.STRIPE_SECRET_KEY,
    }
  );

  return res.json(session);
};

export const getSubscribed = async (req: any, res: Response) => {
  const email = req.user.email;
  const user = await User.findOne({ "info.email": email });

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

  if (!subscriptions.data.length) return res.json([]);

  //@ts-ignore
  const plan = subscriptions.data[0].plan.nickname;

  res.json(plan);
};
