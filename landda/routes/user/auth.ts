import express from "express";
import * as auth from "../../controllers/user/auth";

const router = express.Router();

// signIn, signUp
router.post("/google", auth.signIn);
// generate token
router.post("/refreshToken", auth.refreshToken);

export default router;
