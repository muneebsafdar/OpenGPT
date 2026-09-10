import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slice/authSlice.js";
import conversationReducer from "../slice/ConversationSlice.js";
import messageReducer from "../slice/MessageSlice.js";

const store = configureStore({
    reducer: {
        auth: authReducer,
        conversation: conversationReducer,
        messages: messageReducer,
    },
});

export default store;
