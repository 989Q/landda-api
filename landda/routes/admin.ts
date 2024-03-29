import express from "express";
import * as localStorage from "../controllers/admin/localStorage";
import * as createrController from "../controllers/admin/creater";
import { validateToken } from "../middlewares/accessToken";

const router = express.Router();

// localStorage
router.get("/limit-blogs", localStorage.limitBlog);
router.get("/limit-estates", localStorage.limitEstate);
router.get("/limit-agents", localStorage.limitAgent);

// blog
router.post("/create-blog", validateToken, createrController.createBlog);

export default router;
