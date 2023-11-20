import express from "express";
import * as favorite from "../../controllers/user/favorite";
import * as stripe from "../../controllers/user/stripe";
import * as message from "../../controllers/user/message";
import { validateToken } from "../../middlewares/accessToken";
// import { Schemas, ValidateJoi } from '../middleware/Joi';

const router = express.Router();

// favorite
router.get("/user/list-favorite", validateToken, favorite.listFavorites);
router.get("/user/check-favorite", validateToken, favorite.checkFavorites);
router.post("/user/save-favorite/:estateId", validateToken, favorite.saveFavorite);
router.delete("/user/remove-favorite/:estateId", validateToken, favorite.removeFavorite);

// stripe
router.get("/stripe/prices", stripe.getPrices);
router.post("/stripe/session", validateToken, stripe.createSession);
router.get("/stripe/subscribed", validateToken, stripe.getSubscribed);

// message
router.post("/message/send-message", message.sendMessage);
router.get("/message/search", validateToken, message.searchMessages);
router.delete("/message/delete-message/:messageObjectId", validateToken, message.deleteMessages);

export default router;
