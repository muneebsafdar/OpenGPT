import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
  loading: false,
  artifacts:[],
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    setArtifacts:(state,action)=>{
      state.artifacts=action.payload
    }
  },
});

export const { setMessages, addMessage, setLoading, clearMessages,setArtifacts } =
  messageSlice.actions;

export default messageSlice.reducer;