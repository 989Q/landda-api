import express from "express";
import controller from "../controllers/message";
import { validateToken } from "../middlewares/validate";

const router = express.Router();

router.post("/send-message", controller.sendMessage);
router.get("/search", validateToken, controller.searchMessages);
router.delete("/delete-message/:messageObjectId", validateToken, controller.deleteMessages);

export default router;
