import { Request, Response } from "express";
import User from "../models/user";
import Message from "../models/message";
import Estate from "../models/estate";

const sendMessage = async (req: Request, res: Response) => {
  const { sender, text, userID, estateID } = req.body;

  try {
    // find user by userID
    const user = await User.findOne({ "acc.userID": userID });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // find estate by estateID
    const estate = await Estate.findOne({ "head.estateID": estateID });
  
    if (!estate) {
      return res.status(404).json({ error: "Estate not found" });
    }

    const sentAt = new Date();

    // create new message
    const newMessage = new Message({
      sender,
      text,
      sentAt,
      user,
      estate,
    });

    // Save the message to the database
    await newMessage.save();

    // Add the new message to the user's messages array
    user.messages.push(newMessage._id);

    // Save the updated user document
    await user.save();

    return res.status(201).json({ message: "Message sent successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const searchMessages = async (req: any, res: Response) => {
  const userID = req.user.userID; 
  const { keyword, sorting } = req.query;

  try {
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
      // Limit the keyword to 60 characters
      const limitedKeyword = keyword.substring(0, 60).toLowerCase();

      // If a keyword is provided, filter messages based on the keyword
      const filteredMessages = messages.filter((message: any) => {
        const messageText = (message.text || "").toLowerCase();
        const senderEmail = (message.sender.email || "").toLowerCase();
        const senderPhone = (message.sender.phone || "").toLowerCase();

        // Check for the keyword in text, sender.email, and sender.phone
        return (
          messageText.includes(limitedKeyword) ||
          senderEmail.includes(limitedKeyword) ||
          senderPhone.includes(limitedKeyword)
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

export const deleteMessages = async (req: any, res: Response) => {  
  const userID = req.user.userID; 
  const messageObjectId = req.params.messageObjectId;
  
  try {
    // Find the user by userID and populate the "messages" field
    const user = await User.findOne({ "acc.userID": userID }).populate("messages");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the message in the user's messages list
    const messageIndex = user.messages.findIndex((message) => message._id.toString() === messageObjectId);

    if (messageIndex === -1) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Remove the message from the user's messages list
    user.messages.splice(messageIndex, 1);
    await user.save();

    // You may also want to delete the message from the database if needed
    await Message.findByIdAndRemove(messageObjectId);

    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default {
  sendMessage,
  searchMessages,
  deleteMessages,
};
