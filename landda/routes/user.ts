import express from "express";
import controller from "../controllers/user";
// import { Schemas, ValidateJoi } from '../middleware/Joi';
import { validateToken } from "../middlewares/validate";

const router = express.Router();

router.get('/get', controller.getAllUser);
router.get('/get/:userID', controller.getUserByID)
router.get('/limit-agents', controller.limitAgent);
router.get('/search-agents', controller.searchAgent);
// Manage
router.get('/manage/:userID', validateToken, controller.manageListing);
// Update
router.get('/user-details/:userID', validateToken, controller.getUserByID)
router.put('/update-name/:userID', validateToken,  controller.updateName)
router.put('/update-phone/:userID', validateToken, controller.updatePhone)
router.put('/update-speak/:userID', validateToken, controller.updateSpeak)
router.put('/update-company/:userID', validateToken, controller.updateCompany)
router.put('/update-address/:userID', validateToken, controller.updateAddress)
router.put('/update-description/:userID', validateToken, controller.updateDescription)
router.put('/update-contacts/:userID', validateToken, controller.updateContacts);

export default router;
