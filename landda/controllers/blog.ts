import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Blog, { BlogDocument } from "../models/blog";

import { generateBlogID, } from "../utils/generateID";

const createBlog = async (req: Request, res: Response) => {
  const { body } = req.body;
  const { user } = req.body;

  let checkBlogID: any;
  let isUniqueBlogID: boolean = false;
  
  if (!isUniqueBlogID) {
    checkBlogID = generateBlogID();

    const existingBlogID = await Blog.findOne({ 'lead.blogID': checkBlogID });

    if (!existingBlogID) {
      isUniqueBlogID = true; 
    } 
  }

  const blog = new Blog({
    _id: new mongoose.Types.ObjectId(),
    lead: {
      blogID: checkBlogID,
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

// const createBlog = async (req: Request, res: Response) => {
//   try {
//     const {
//       lead,
//       body,
//       user
//     } = req.body;

//     const newBlog = new Blog({
//       lead,
//       body,
//       user
//     });

//     await newBlog.save();

//     return res.status(201).json({ message: 'Blog created successfully', blog: newBlog });
//   } catch (error) {
//     console.error('Error creating blog:', error);

//     return res.status(500).json({ message: 'Internal server error' });
//   }
// };

const getBlogByID = async (req: Request, res: Response) => {
  const blogID = req.params.blogID;

  try {
    // Find the blog by ID and populate the 'user' field
    const blog = await Blog.findOne({ "lead.blogID": blogID }).populate('user');

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Return the blog with user data populated
    return res.status(200).json({ blog });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const getAllBlog = async (req: Request, res: Response) => {
  try {
    const blogs: BlogDocument[] = await Blog.find({ 'lead.status': 'active' });
    return res.status(200).json({ blogs });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const limitBlog = async (req: Request, res: Response) => {
  try {
    const blogs: BlogDocument[] = await Blog.find({ 'lead.status': 'active' })
    .populate('user')
    .select('-__v')
    .limit(4); 
    res.status(200).json({ blogs });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// ________________________________________ searching

const searchBlog = async (req: Request, res: Response) => {
  const { 
    keyword,
    selecting,
    page = 1,
  } = req.query;

  const pageSize = 9; 

  const searchQuery: any = {
    'lead.status': 'active',
  };

  if (keyword && keyword.toString().length <= 60) {
    searchQuery["$or"] = [
      { "body.tag": { $regex: keyword, $options: "i" } },
      { "body.title": { $regex: keyword, $options: "i" } },
      { "body.about": { $regex: keyword, $options: "i" } },
    ];
  }

  try {
    // Calculate skip value for pagination
    const skip = (Number(page) - 1) * pageSize;

    // Calculate total number of records without pagination
    const totalRecords = await Blog.countDocuments(searchQuery);

    const blogs = await Blog.find(searchQuery)
      .populate('user')
      .select('-__v')
      .skip(skip)
      .limit(pageSize)
    
    return res.status(200).json({ blogs, totalRecords });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export default {
  createBlog, 
  getBlogByID, 
  getAllBlog, 
  limitBlog, 
  searchBlog,
};
