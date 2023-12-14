import express from "express";
import * as user from "../../controllers/user/user";
import { validateToken } from "../../middlewares/accessToken";
import { limitParams } from "../../middlewares/checkRequest";
// import { Schemas, ValidateJoi } from '../middleware/Joi';

const router = express.Router();

// search user
router.get("/get/:userId", limitParams("userId", 20), user.getUserById);
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

export default router;
