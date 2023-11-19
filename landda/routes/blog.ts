import express from "express";
import * as blog from "../controllers/blog";

const router = express.Router();

router.get("/get", blog.getAllBlog);
router.get("/get/:blogId", blog.getBlogById);
router.get("/search", blog.searchBlog);

export default router;
