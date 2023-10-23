import { Request, Response } from "express";
import User from "../models/user";
import Message from "../models/message";

const sendMessage = async (req: Request, res: Response) => {
  try {
    console.log("req.body: ", req.body);
    const { sender, text, user, estate } = req.body;
    const sentAt = new Date();

    // Create a new message
    const newMessage = new Message({
      sender,
      text,
      sentAt,
      user,
      estate,
    });

    // Save the message to the database
    await newMessage.save();

    // Find the user by ID
    const currentUser = await User.findById(user);

    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Add the new message to the user's messages array
    currentUser.messages.push(newMessage._id);

    // Save the updated user document
    await currentUser.save();

    return res.status(201).json({ message: "Message sent successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const searchMessages = async (req: Request, res: Response) => {
  try {
    const { user, keyword, sorting } = req.query;

    if (!user) {
      return res.status(400).json({ error: "User parameter is required" });
    }

    // Construct the query based on whether the keyword is provided
    const query: any = { user: user as string }; // Assuming 'user' is a string, adjust accordingly

    if (keyword) {
      // Use $or operator to search for text, sender.email, and sender.phone
      query.$or = [
        { text: { $regex: keyword as string, $options: "i" } },
        { "sender.email": { $regex: keyword as string, $options: "i" } },
        { "sender.phone": { $regex: keyword as string, $options: "i" } },
      ];
    }

    let sortOption: any = {};
    if (sorting === "oldestDate") {
      sortOption = { sentAt: 1 }; // Ascending order for oldest date
    } else if (sorting === "newestDate") {
      sortOption = { sentAt: -1 }; // Descending order for newest date
    }

    const messages = await Message.find(query)
      .sort(sortOption)
      .populate("estate");

    return res.status(200).json({ messages });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteMessages = async (req: Request, res: Response) => {
  try {
    const message = req.params.message;

    if (!message) {
      return res
        .status(400)
        .json({ error: "Message ID parameter is required" });
    }

    // Find and remove the message by its ID
    const deletedMessage = await Message.findByIdAndDelete(message);

    if (!deletedMessage) {
      return res.status(404).json({ error: "Message not found" });
    }

    return res
      .status(200)
      .json({ message: "Message deleted successfully", deletedMessage });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default {
  sendMessage,
  searchMessages,
  deleteMessages,
};
