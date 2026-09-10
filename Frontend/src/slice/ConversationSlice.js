import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  conversations: [],
  selectedConv: null,
};

const ConvSlice = createSlice({
  name: "conversation",

  initialState,

  reducers: {
    // Store all conversations
    setConversation: (state, action) => {
      state.conversations = action.payload;
    },

    // Add newly created conversation to the top
    updateConversation: (state, action) => {
      state.conversations.unshift(action.payload);
    },

    // Store selected conversation
    setSelectedConversation: (state, action) => {
      state.selectedConv = action.payload;
    },

    // Clear conversations
    deleteConversation: (state) => {
      state.conversations = [];
      state.selectedConv = null;
    },

    // Update title of active conversation
    updateConversationTitle: (state, action) => {
      if (state.selectedConv) {
        state.selectedConv.title = action.payload;
      }
      
      const index = state.conversations.findIndex(
        (conv) => conv._id === state.selectedConv?._id
      );
      if (index !== -1) {
        state.conversations[index].title = action.payload;
      }
    },
  },
});

export const {
  setConversation,
  updateConversation,
  setSelectedConversation,
  deleteConversation,
  updateConversationTitle,
} = ConvSlice.actions;

export default ConvSlice.reducer;