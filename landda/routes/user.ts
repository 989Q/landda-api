import express from "express";
import controller from "../controllers/user";
// import { Schemas, ValidateJoi } from '../middleware/Joi';

const router = express.Router();

router.get('/get', controller.getAllUser);
router.get('/get/:userID', controller.getUserByID)

router.get('/recommend', controller.recommend);

export default router;
