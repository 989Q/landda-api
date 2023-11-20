import express from "express";
import * as blog from "../controllers/blog";

const router = express.Router();

router.get("/search", blog.searchBlog);
router.get("/get/:blogId", blog.getBlogById);

export default router;
