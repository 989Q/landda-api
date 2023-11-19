import express from "express";
import * as favorite from "../../controllers/user/favorite";
import * as stripe from "../../controllers/user/stripe";
import * as message from "../../controllers/user/message";
// import { Schemas, ValidateJoi } from '../middleware/Joi';
import { validateToken } from "../../middlewares/validate";

const router = express.Router();

// favorite
router.get("/list-favorite", validateToken, favorite.listFavorites);
router.get("/check-favorite", validateToken, favorite.checkFavorites);
router.post("/save-favorite/:estateId", validateToken, favorite.saveFavorite);
router.delete("/remove-favorite/:estateId", validateToken, favorite.removeFavorite);

// stripe
router.get("/prices", stripe.getPrices);
router.post("/session", validateToken, stripe.createSession);
router.get("/subscribed", validateToken, stripe.getSubscribed);

// message
router.post("/send-message", message.sendMessage);
router.get("/search", validateToken, message.searchMessages);
router.delete("/delete-message/:messageObjectId", validateToken, message.deleteMessages);

export default router;
