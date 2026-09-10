import {
  createConversationService,
  getConversationsService,
  deleteConversationService,
  updateConversationService,
  createMessageService,
  getMessagesService,
} from "../services/chat.services.js";


export const createConversation = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: user id missing" });
    }

    const title = req.body?.title    

    const conversation = await createConversationService(userId, title);

    return res.status(201).json({
      success: true,
      message: "Conversation created successfully",
      data: conversation,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /conversation — get all conversations for the user
export const getConversations = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: user id missing" });
    }


    const conversations = await getConversationsService(userId);

    return res.status(200).json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /conversation/:id — delete a conversation by id
export const deleteConversation = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: user id missing" });
    }

    const { id } = req.body;
    const deleted = await deleteConversationService(id, userId);

    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Conversation not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Conversation deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /conversation/:id — update only the title of a conversation
export const updateConversation = async (req, res) => {
  try {

    const { id } = req.body;
    const { title } = req.body;

    if (!title) {
      return res
        .status(400)
        .json({ success: false, message: "title is required" });
    }

    const updated = await updateConversationService(id, title);

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Conversation not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Conversation updated successfully",
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createMessage = async (req, res) => {
  try {
    const { role, content, conversationId,images,artifacts } = req.body;

    if (!role || !content) {
      return res
        .status(400)
        .json({ success: false, message: "role and content are required" });
    }

    const message = await createMessageService(conversationId, role, content,images,artifacts);

    return res.status(201).json({
      success: true,
      message: "Message created successfully",
      data: message,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.query;

    console.log("conversationId:", conversationId);

    const messages = await getMessagesService(conversationId);

    return res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};