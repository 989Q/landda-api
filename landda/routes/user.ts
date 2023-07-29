import express from "express";
import controller from "../controllers/User";
// import { Schemas, ValidateJoi } from '../middleware/Joi';

const router = express.Router();

router.get('/:userID', controller.getuserID)

export default router;
