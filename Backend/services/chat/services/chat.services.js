import mongoose from "mongoose";
import Conversation from "../models/conversation.model.js";
import Message from "../models/messages.model.js";


// Create a new conversation for the user
export const createConversationService = async (userId, title) => {

  const conversation = await Conversation.create({
    userId,
    title: title || "New Conversation",
  });
  return conversation;
};

// Get all conversations for a user
export const getConversationsService = async (userId) => {
  

  const conversations = await Conversation.find({ userId }).exec();

  return conversations;
};

// Delete a conversation by id (only if it belongs to the user)
export const deleteConversationService = async (conversationId, userId) => {
  const conversation = await Conversation.findOneAndDelete({
    _id: conversationId,
    userId,
  });
  return conversation;
};

export const updateConversationService = async (conversationId, title) => {
  const conversation = await Conversation.findOneAndUpdate(
    { _id: conversationId},
    { title },
    { new: true }
  );
  return conversation;
};

export const createMessageService = async (conversationId, role, content,images,artifacts) => {
  const message = await Message.create({ conversationId, role, content,images,artifacts });
  return message;
};


export const getMessagesService = async (conversationId) => {
  const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });
  return messages;
};
