import express from "express";
import * as user from "../controllers/user/user";
import * as favorite from "../controllers/user/favorite";
import * as stripe from "../controllers/user/stripe";
import * as message from "../controllers/user/message";
// import { Schemas, ValidateJoi } from '../middleware/Joi';
import { validateToken } from "../middlewares/validate";

const router = express.Router();

// search user
router.get("/get/:userId", user.getUserById);
router.get("/search-agents", user.searchAgent);

// update user
router.get("/get-info", validateToken, user.getUserInfo);
router.put("/update-name", validateToken, user.updateName);
router.put("/update-work", validateToken, user.updateWork);
router.put("/update-phone", validateToken, user.updatePhone);
router.put("/update-speak", validateToken, user.updateSpeak);
router.put("/update-live", validateToken, user.updateLive);
router.put("/update-about", validateToken, user.updateAbout);
router.put("/update-links", validateToken, user.updateLinks);

// estate listing
router.get("/search-listing", validateToken, user.searchListing);

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
