import express from "express";
import * as blog from "../controllers/blog";
import { limitParams } from "../middlewares/checkRequest";

const router = express.Router();

router.get("/search", blog.searchBlog);
router.get("/get/:blogId", limitParams("blogId", 20), blog.getBlogById);

export default router;
