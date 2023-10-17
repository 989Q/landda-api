import express from "express";
import controller from "../controllers/message";
import { validateToken } from "../middlewares/validate";

const router = express.Router();

router.post('/send-message', controller.sendMessage);
router.get('/find-message/:userID', validateToken, controller.readMessages)

export default router;
