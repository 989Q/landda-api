// routes/Auth.ts

import express from "express";
import controller from "../controllers/Auth";
// import { Schemas, ValidateJoi } from '../middleware/Joi';

const router = express.Router();

router.post("/google", controller.signIn);
router.post("/refreshToken", controller.refreshToken);

export default router;
