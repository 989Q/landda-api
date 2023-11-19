import express from "express";
import controller from "../controllers/auth";
// import { Schemas, ValidateJoi } from '../middleware/Joi';

const router = express.Router();

// signIn, signUp
router.post("/google", controller.signIn);
// generate token
router.post("/refreshToken", controller.refreshToken);

export default router;
