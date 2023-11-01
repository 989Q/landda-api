import express from "express";
import { validateToken } from "../middlewares/validate";
import * as StripeController from "../controllers/stripe";

const router = express.Router();

router.get("/prices", StripeController.getPrices);
router.post("/session", validateToken, StripeController.createSession);
router.get("/subscribed", validateToken, StripeController.getSubscribed);

export default router;
