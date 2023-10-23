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

export const searchMessages = async (req: any, res: Response) => {
  try {
    const userID = req.user.userID; 
    const { keyword, sorting } = req.query;

    const user = await User.findOne({ "acc.userID": userID })
      .populate({
        path: "messages",
        populate: {
          path: "estate",
        },
      });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Extract the messages property from the user object
    let messages = user.messages; // Use let here to allow reassignment

    if (keyword) {
      // If a keyword is provided, filter messages based on the keyword
      const filteredMessages = messages.filter((message: any) => {
        const messageText = message.text || "";
        const senderEmail = message.sender.email || "";
        const senderPhone = message.sender.phone || "";

        // Check for the keyword in text, sender.email, and sender.phone
        return (
          messageText.includes(keyword as string) ||
          senderEmail.includes(keyword as string) ||
          senderPhone.includes(keyword as string)
        );
      });
      
      messages = filteredMessages;
    }

    // Sort messages based on sorting parameter
    if (sorting === "oldestDate") {
      messages.sort((a: any, b: any) => a.sentAt - b.sentAt);
    } else if (sorting === "newestDate") {
      messages.sort((a: any, b: any) => b.sentAt - a.sentAt);
    }

    // If no keyword is provided, return all messages
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
