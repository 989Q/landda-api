import express from "express";
import * as auth from "../../controllers/user/auth";

const router = express.Router();

// signIn, signUp
router.post("/user/google", auth.signIn);
// generate token
router.post("/user/refreshToken", auth.refreshToken);

export default router;
