import express from "express";
import User from "../models/User";
import Subscription from '../models/Subscription';
import { stripe } from "../middlewares/stripe";
import { checkAuth } from "../middlewares/checkcheck";
// import User from "../models/user";
// import Article from "../models/article";
;

const router = express.Router();

router.get("/", checkAuth, async (req: any, res: any) => {
  const user = await User.findOne({ "profile.email": req.user });
  
  console.log('user: ', user)

  const subscriptions = await stripe.subscriptions.list(
    {
      customer: user?.membership.stripeCustomerID,
      // customer: "cus_OMD2y3H2HKlxYl", // unknow user
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