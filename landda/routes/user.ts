import express from "express";
import controller from "../controllers/user";
// import { Schemas, ValidateJoi } from '../middleware/Joi';

const router = express.Router();

router.get('/get', controller.getAllUser);
router.get('/get/:userID', controller.getUserByID)
router.get('/limit-agents', controller.limitAgent);
router.get('/search-agents', controller.searchAgent);
// Update
router.put('/update-name/:userID', controller.updateName)
router.put('/update-phone/:userID', controller.updatePhone)
router.put('/update-speak/:userID', controller.updateSpeak)
router.put('/update-company/:userID', controller.updateCompany)
router.put('/update-address/:userID', controller.updateAddress)
router.put('/update-description/:userID', controller.updateDescription)
router.put('/update-contacts/:userID', controller.updateContacts);

export default router;
