import { Request, Response } from "express";
import Message from "../models/message";
import User, { IUserModel } from "../models/user";

const sendMessage = async (req: Request, res: Response) => {
  try {
    console.log('req.body: ', req.body)
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

const readMessages = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;

    // Find the user
    const currentUser = await User.findOne({ 'acc.userID': userID })
      // .populate('messages')
      .populate({
        path: 'messages',
        populate: {
          path: 'estate', // Populate the 'user' field in the 'IEstate' model
        },
      })

    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Extract messages from the user
    const userMessages = currentUser.messages;

    return res.status(200).json({ messages: userMessages });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// Export the controller functions
export default {
  sendMessage,
  readMessages,
};
