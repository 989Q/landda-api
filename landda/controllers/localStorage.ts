import { Request, Response } from "express";
import User, { IUser } from "../models/user";
import Estate, { IEstate } from "../models/estate";
import Blog, { BlogDocument } from "../models/blog";

const limitAgent = async (req: Request, res: Response) => {
  try {
    const users: IUser[] = await User.find({ "acc.status": "active" })
      .limit(6)
      .select({
        _id: 0,
        __v: 0, 
        // acc using userID, verified
        "acc.logins": 0,
        "acc.status": 0,
        "acc.role": 0,
        "acc.createdAt": 0,
        "acc.updatedAt": 0,
        // info using image, name, work
        "info.email": 0,
        "info.about": 0,
        "info.phone": 0,
        "info.speak": 0,
        "info.live": 0,
        "info.link1": 0,
        "info.link2": 0,
        "info.link3": 0,
        "info.link4": 0,
        subs: 0,
        messages: 0,
        saves: 0,
        estates: 0,
      });

    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const limitBlog = async (req: Request, res: Response) => {
  try {
    const blogs: BlogDocument[] = await Blog.find({ "lead.status": "active" })
      .populate({
        path: "user",
        // Include both info.name and info.image and exclude _id
        // select: "info.name info.image -_id", 
        select: "info.name -_id", 
      })
      .select({
        _id: 0,
        __v: 0, 
        "lead.status": 0,
        "lead.seen": 0,
        "lead.see": 0,
        "lead.shares": 0,
        "lead.saves": 0,
      })
      .limit(4);
    res.status(200).json({ blogs });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const limitEstate = async (req: Request, res: Response) => {
  try {
    const estates: IEstate[] = await Estate.aggregate([
      { $match: { "head.post": "active" } }, // Match only documents with 'head.post' set to 'active'
      { $sample: { size: 8 } }, // Randomly sample 8 documents
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      }, // Populate user
      { $unwind: "$user" }, // Unwind the user array
      {
        $project: {
          _id: 0,
          __v: 0, 
          "head.seen": 0,
          "head.see": 0,
          "head.shares": 0,
          "head.saves": 0,
          // user
          "user._id": 0,
          "user.__v": 0,
          "user.acc": 0,
          // user.info.name
          "user.info.email": 0,
          "user.info.image": 0,
          "user.info.work": 0,
          "user.info.about": 0,
          "user.info.phone": 0,
          "user.info.speak": 0,
          "user.info.live": 0,
          "user.info.link1": 0,
          "user.info.link2": 0,
          "user.info.link3": 0,
          "user.info.link4": 0,
          // user.subs.access
          "user.subs.stripeID": 0, // Exclude user.subs
          "user.subs.active": 0, // Exclude user.subs
          "user.subs.payment": 0, // Exclude user.subs
          "user.subs.startDate": 0, // Exclude user.subs
          "user.subs.endDate": 0, // Exclude user.subs
          // another
          "user.messages": 0, // Exclude user.messages
          "user.saves": 0, // Exclude user.saves
          "user.estates": 0, // Exclude user.estates
        },
      },
    ]);
    return res.status(200).json({ estates });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export default {
  // user
  limitAgent,
  // estate
  limitEstate,
  // blog
  limitBlog,
};
