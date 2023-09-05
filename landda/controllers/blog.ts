import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Blog from "../models/blog";

import { generateBlogID, } from "../utils/generateID";

// const createBlog = async (req: Request, res: Response) => {
//   const { userID } = req.body.head;
//   const { desc } = req.body;
//   const { user } = req.body;

//   let checkBlogID: any;
//   let isUniqueBlogID: boolean = false;
  
//   if (!isUniqueBlogID) {
//     checkBlogID = generateBlogID();

//     const existingBlogID = await Blog.findOne({ 'head.blogID': checkBlogID });

//     if (!existingBlogID) {
//       isUniqueBlogID = true; 
//     } 
//   }

//   const blog = new Blog({
//     _id: new mongoose.Types.ObjectId(),
//     head: {
//       userID: userID,
//       blogID: checkBlogID,
//       blogType: "blog",
//       blogStatus: "active",
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     },
//     desc,
//     user,
//   });

//   return blog
//     .save()
//     .then((blog) => res.status(201).json({ blog }))
//     .catch((error) => res.status(500).json({ error }));
// };

const createBlog = async (req: Request, res: Response) => {
  try {
    const {
      head,
      desc,
      user
    } = req.body;

    const newBlog = new Blog({
      head,
      desc,
      user
    });

    await newBlog.save();

    return res.status(201).json({ message: 'Blog created successfully', blog: newBlog });
  } catch (error) {
    console.error('Error creating blog:', error);

    return res.status(500).json({ message: 'Internal server error' });
  }
};

// ________________________________________ Get blog

const getBlogByID = async (req: Request, res: Response) => {
  const blogID = req.params.blogID;

  try {
    // Find the blog by ID and populate the 'user' field
    const blog = await Blog.findOne({ "head.blogID": blogID }).populate('user');

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Return the blog with user data populated
    return res.status(200).json({ blog });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const getAllBlog = (req: Request, res: Response) => {
  return Blog.find()
    // .populate('user')
    // .select('-__v')
    .then((blogs) => res.status(200).json({ blogs }))
    .catch((error) => res.status(500).json({ error }));
};

const limitBlog = async (req: Request, res: Response) => {
  try {
    const blogs = await Blog.find()
    .populate('user')
    .select('-__v')
    .limit(4); 
    res.status(200).json({ blogs });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// ________________________________________ Search blog

const searchBlog = (req: Request, res: Response) => {
  const {searchBlog} = req.query;

  const searchQuery: any = {};

  if (searchBlog) {
    searchQuery["$or"] = [
      { "head.supporterName": { $regex: searchBlog, $options: "i" } },
      { "desc.title": { $regex: searchBlog, $options: "i" } },
      { "desc.description": { $regex: searchBlog, $options: "i" } },
    ];
  }

  Blog.find(searchQuery)
    .populate('user')
    .select('-__v')
    .then((blogs) => {
      return res.status(200).json({ blogs });
    })
    .catch((error) => {
      return res.status(500).json({ error });
    });
};

export default {
  createBlog, 
  getBlogByID, 
  getAllBlog, 
  limitBlog, 
  searchBlog,
};
