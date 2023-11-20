import { Request, Response } from "express";
import Blog, { BlogDocument } from "../models/blog";
import { BlogStatus, BlogTag } from "../utils/types";

// ________________________________________ lib

const updateBlogViews = (blog: BlogDocument) => {
  // update seen
  blog.lead.seen = (blog.lead.seen || 0) + 1;

  // update see for current date
  const today = new Date().toISOString().split("T")[0];
  const seeEntry = blog.lead.see;

  if (seeEntry) {
    // if date is different, update it
    if (seeEntry.date !== today) {
      seeEntry.date = today;
      seeEntry.count = 1;
    } else {
      seeEntry.count++;
    }
  } else {
    // if no entry exists, create a new one
    blog.lead.see = { date: today, count: 1 };
  }
};

// ________________________________________ main

export const getAllBlog = async (req: Request, res: Response) => {
  try {
    const blogs = await Blog.find({ "lead.status": BlogStatus.Active });
    return res.status(200).json({ blogs });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const getBlogById = async (req: Request, res: Response) => {
  const blogId = req.params.blogId;

  try {
    const blog = await Blog.findOne({ "lead.blogId": blogId })
      .populate("user");

    if (blog) {
      updateBlogViews(blog);

      await blog.save();

      return res.status(200).json({ blog });
    } else {
      return res.status(404).json({ message: "not found blog" });
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
};

// ________________________________________ searching

export const searchBlog = async (req: Request, res: Response) => {
  const { 
    keyword,
    select,
    page = 1,
  } = req.query;

  const pageSize = 9;

  const searchQuery: any = {
    "lead.status": BlogStatus.Active
  };

  // set initial value of body.tag
  searchQuery["body.tag"] = BlogTag.Supported;

  if (keyword && keyword.toString().length <= 60) {
    searchQuery["$or"] = [
      { "body.tag": { $regex: keyword, $options: "i" } },
      { "body.title": { $regex: keyword, $options: "i" } },
      { "body.about": { $regex: keyword, $options: "i" } },
    ];
  }

  // if select parameter is present, update the searchQuery
  if (select) {
    if (Object.values(BlogTag).includes(select as any)) {
      searchQuery["body.tag"] = select as BlogTag;
    }
  }

  try {
    // calculate skip value for pagination
    const skip = (Number(page) - 1) * pageSize;

    // calculate total number of records without pagination
    const totalRecords = await Blog.countDocuments(searchQuery);

    const blogs = await Blog.find(searchQuery)
      .populate("user")
      .select("-__v")
      .skip(skip)
      .limit(pageSize);

    return res.status(200).json({ blogs, totalRecords });
  } catch (error) {
    res.status(500).json({ error });
  }
};
