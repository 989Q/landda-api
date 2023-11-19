import express from "express";
import controller from "../controllers/user";
import localStorage from "../controllers/localStorage";
// import { Schemas, ValidateJoi } from '../middleware/Joi';
import { validateToken } from "../middlewares/validate";

const router = express.Router();

// get, search
router.get("/get/:userId", controller.getUserById);
router.get("/limit-agents", localStorage.limitAgent);
router.get("/search-agents", controller.searchAgent);
// saves
router.get("/list-favorite", validateToken, controller.listFavorites);
router.get("/check-favorite", validateToken, controller.checkFavorites);
router.post("/save-favorite/:estateId", validateToken, controller.saveFavorite);
router.delete("/remove-favorite/:estateId", validateToken, controller.removeFavorite);
// manage, search listing
router.get("/search-listing", validateToken, controller.searchListing);
// update
router.get("/get-info", validateToken, controller.getUserInfo);
router.put("/update-name", validateToken, controller.updateName);
router.put("/update-work", validateToken, controller.updateWork);
router.put("/update-phone", validateToken, controller.updatePhone);
router.put("/update-speak", validateToken, controller.updateSpeak);
router.put("/update-live", validateToken, controller.updateLive);
router.put("/update-about", validateToken, controller.updateAbout);
router.put("/update-links", validateToken, controller.updateLinks);

export default router;
