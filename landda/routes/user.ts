import express from "express";
import controller from "../controllers/user";
// import { Schemas, ValidateJoi } from '../middleware/Joi';
import { validateToken } from "../middlewares/validate";

const router = express.Router();

router.get('/get', controller.getAllUser);
router.get('/get/:userID', controller.getUserByID)
router.get('/limit-agents', controller.limitAgent);
router.get('/search-agents', controller.searchAgent);
// Saves
router.get('/card-favorite/:userID', controller.cardFavorites);
router.get('/list-favorite/:userID', controller.listFavorites);
router.post('/save-favorite', validateToken, controller.saveFavorite);
router.delete('/remove-favorite', validateToken, controller.removeFavorite);
// Manage
router.get('/manage/:userID', validateToken, controller.manageListing);
// Update
router.get('/get-info/:userID', validateToken, controller.getUserByID)
router.put('/update-name/:userID', validateToken,  controller.updateName)
router.put('/update-work/:userID', validateToken, controller.updateWork)
router.put('/update-phone/:userID', validateToken, controller.updatePhone)
router.put('/update-speak/:userID', validateToken, controller.updateSpeak)
router.put('/update-live/:userID', validateToken, controller.updateLive)
router.put('/update-about/:userID', validateToken, controller.updateAbout)
router.put('/update-links/:userID', validateToken, controller.updateLinks);

export default router;
