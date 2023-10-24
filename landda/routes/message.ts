import express from "express";
import controller from "../controllers/message";
import { validateToken } from "../middlewares/validate";

const router = express.Router();

// post
router.post("/send-message", controller.sendMessage);
// search, delete
router.get("/search", validateToken, controller.searchMessages);
router.delete("/delete-message/:messageObjectId", validateToken, controller.deleteMessages);

export default router;
