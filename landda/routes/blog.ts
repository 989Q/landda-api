import express from 'express';
import * as blog from '../controllers/blog';
import { limitParams } from '../middlewares/validate_request';

const router = express.Router();

router
  .get('/search', blog.searchBlog)
  .get('/get/:blogId', limitParams('blogId', 20), blog.getBlogById);

export default router;
