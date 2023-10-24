import express from "express";
import controller from "../controllers/blog";
import localStorage from "../controllers/localStorage";
// import { Schemas, ValidateJoi } from '../middleware/Joi';

const router = express.Router();

// post
router.post("/create", controller.createBlog);
// get, search
router.get("/get", controller.getAllBlog);
router.get("/get/:blogID", controller.getBlogByID);
router.get("/limit-blogs", localStorage.limitBlog);
router.get("/search", controller.searchBlog);

export default router;
