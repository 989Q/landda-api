import express from "express";
import controller from "../controllers/blog";
// import { Schemas, ValidateJoi } from '../middleware/Joi';

const router = express.Router();

router.post('/create', controller.createBlog);
router.get('/get', controller.getAllBlog);
router.get('/get/:blogID', controller.getBlogByID);
router.get('/limit-blogs', controller.limitBlog);
router.get('/search', controller.searchBlog);

export default router;
