import express from "express";
import controller from "../controllers/user";
import localStorage from "../controllers/localStorage";
// import { Schemas, ValidateJoi } from '../middleware/Joi';
import { validateToken } from "../middlewares/validate";

const router = express.Router();

// get, search
router.get("/get/:userID", controller.getUserByID);
router.get("/limit-agents", localStorage.limitAgent);
router.get("/search-agents", controller.searchAgent);
// Saves
router.get("/list-favorite/:userID", controller.listFavorites);
router.get("/check-favorite/:userID", controller.checkFavorites);
router.post("/save-favorite", validateToken, controller.saveFavorite);
router.delete("/remove-favorite", validateToken, controller.removeFavorite);
// Manage
router.get("/manage/:userID", validateToken, controller.manageListing);
// Update
router.get("/get-info", validateToken, controller.getUserInfo);
router.put("/update-name", validateToken, controller.updateName);
router.put("/update-work", validateToken, controller.updateWork);
router.put("/update-phone", validateToken, controller.updatePhone);
router.put("/update-speak", validateToken, controller.updateSpeak);
router.put("/update-live", validateToken, controller.updateLive);
router.put("/update-about", validateToken, controller.updateAbout);
router.put("/update-links", validateToken, controller.updateLinks);

export default router;
