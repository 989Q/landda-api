import express from "express";
import * as user from "../../controllers/user/user";
import { validateToken } from "../../middlewares/accessToken";
import { limitParams } from "../../middlewares/checkRequest";
// import { Schemas, ValidateJoi } from '../middleware/Joi';

const router = express.Router();

router
    // search user
    .get("/get/:userId", limitParams("userId", 20), user.getUserById)
    .get("/search-agents", user.searchAgent)
    // update user
    .get("/get-info", validateToken, user.getUserInfo)
    .put("/update-name", validateToken, user.updateName)
    .put("/update-work", validateToken, user.updateWork)
    .put("/update-phone", validateToken, user.updatePhone)
    .put("/update-speak", validateToken, user.updateSpeak)
    .put("/update-live", validateToken, user.updateLive)
    .put("/update-about", validateToken, user.updateAbout)
    .put("/update-links", validateToken, user.updateLinks)
    // estate listing
    .get("/search-listing", validateToken, user.searchListing)

export default router;
