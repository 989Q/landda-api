import { Request, Response } from "express";
import mongoose from "mongoose";
import Blog from "../../models/blog";
import { generateBlogId } from "../../utils/gen_id";

export const createBlog = async (req: Request, res: Response) => {
  const { body, user } = req.body;

  let checkBlogId: any;
  let isUniqueBlogId: boolean = false;

  if (!isUniqueBlogId) {
    checkBlogId = generateBlogId();

    const existingBlogId = await Blog.findOne({ "lead.blogId": checkBlogId });

    if (!existingBlogId) {
      isUniqueBlogId = true;
    }
  }

  const blog = new Blog({
    _id: new mongoose.Types.ObjectId(),
    lead: {
      blogId: checkBlogId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    body,
    user,
  });

  return blog
    .save()
    .then((blog) => res.status(201).json({ blog }))
    .catch((error) => res.status(500).json({ error }));
};
