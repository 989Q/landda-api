import { Request, Response } from "express";
import User from "../../models/user";
import Message from "../../models/message";
import Estate from "../../models/estate";

export const sendMessage = async (req: Request, res: Response) => {
  const { sender, text, userId, estateId } = req.body;

  try {
    // find user by userId
    const user = await User.findOne({ "acc.userId": userId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // find estate by estateId
    const estate = await Estate.findOne({ "head.estateId": estateId });
  
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

    // save message to database
    await newMessage.save();

    // add new message to user's messages array
    user.messages.push(newMessage._id);

    // save updated user document
    await user.save();

    return res.status(201).json({ message: "Message sent successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const searchMessages = async (req: any, res: Response) => {
  const userId = req.user.userId; 
  const { keyword, sorting } = req.query;

  try {
    const user = await User.findOne({ "acc.userId": userId })
      .populate({
        path: "messages",
        populate: {
          path: "estate",
        },
      });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // extract messages property from user object
    let messages = user.messages; // use let here to allow reassignment

    if (keyword) {
      // limit keyword to 60 characters
      const limitedKeyword = keyword.substring(0, 60).toLowerCase();

      // if keyword is provided, filter messages based on the keyword
      const filteredMessages = messages.filter((message: any) => {
        const messageText = (message.text || "").toLowerCase();
        const senderEmail = (message.sender.email || "").toLowerCase();
        const senderPhone = (message.sender.phone || "").toLowerCase();

        // check for keyword in text, sender.email, and sender.phone
        return (
          messageText.includes(limitedKeyword) ||
          senderEmail.includes(limitedKeyword) ||
          senderPhone.includes(limitedKeyword)
        );
      });
      
      messages = filteredMessages;
    }

    // sort messages based on sorting parameter
    if (sorting === "oldestDate") {
      messages.sort((a: any, b: any) => a.sentAt - b.sentAt);
    } else if (sorting === "newestDate") {
      messages.sort((a: any, b: any) => b.sentAt - a.sentAt);
    }

    // if no keyword is provided, return all messages
    return res.status(200).json({ messages });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteMessages = async (req: any, res: Response) => {  
  const userId = req.user.userId; 
  const messageObjectId = req.params.messageObjectId;
  
  try {
    // find user by userId and populate "messages" field
    const user = await User.findOne({ "acc.userId": userId }).populate("messages");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // find message in user's messages list
    const messageIndex = user.messages.findIndex((message) => message._id.toString() === messageObjectId);

    if (messageIndex === -1) {
      return res.status(404).json({ error: "Message not found" });
    }

    // remove message from user's messages list
    user.messages.splice(messageIndex, 1);
    await user.save();

    // may also want to delete message from database if needed
    await Message.findByIdAndRemove(messageObjectId);

    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
