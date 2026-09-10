import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Menu, FileCode2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MessageList } from "./MessageList";
import { ChatHeader } from "./ChatHeader";
import { ChatInputBox } from "./ChatInputBox";
import {
  setMessages,
  addMessage,
  setLoading,
  clearMessages,
  setArtifacts,
} from "@/slice/MessageSlice";
import { getMessages } from "@/features/getMessages";
import { sendMessages } from "@/features/sendMessages";
import { createConversation } from "@/features/createConversation";
import { updateConversation as updateConversationApi } from "../features/updateCOnversation.js";

import {
  setSelectedConversation,
  updateConversation as addConversationToSlice,
  updateConversationTitle,
} from "@/slice/ConversationSlice";

export const Chat = ({ onOpenSidebar, onOpenArtifacts }) => {
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [selectedMode, setSelectedMode] = useState("auto");
  const dispatch = useDispatch();

  const isNewConvRef = useRef(false);
  const isSendingRef = useRef(false);

  const selectedConv = useSelector(
    (state) => state.conversation.selectedConv
  );
  const { messages, loading, artifacts } = useSelector((state) => state.messages);
  const hasArtifacts = Array.isArray(artifacts) ? artifacts.length > 0 : !!artifacts;

  const generateTitle = (text) =>
    text.length > 30 ? `${text.slice(0, 30)}...` : text;

  const getErrorMessage = (err) => {
    const isRateLimit =
      err.response?.status === 429 ||
      err.statusCode === 429 ||
      err.message?.toLowerCase().includes("limit");

    if (isRateLimit) {
      const ttl =
        err.response?.data?.ttl ||
        err.response?.data?.resetInSeconds ||
        err.ttl;

      if (ttl) {
        const mins = Math.floor(ttl / 60);
        const secs = ttl % 60;
        const timeFormatted =
          mins > 0
            ? `${mins} minute${mins > 1 ? "s" : ""}${secs > 0 ? ` and ${secs} second${secs > 1 ? "s" : ""}` : ""}`
            : `${secs} second${secs > 1 ? "s" : ""}`;

        return `⏱️ **Rate Limit Reached**: You have exceeded your prompt limit for this mode. Please wait **${timeFormatted}** before trying again.`;
      }

      return (
        err.response?.data?.message ||
        "⏱️ **Rate Limit Reached**: You have hit your usage limit. Please try again in a few minutes."
      );
    }

    return (
      err.response?.data?.message ||
      err.message ||
      "Something went wrong. Please try again."
    );
  };

  const handleNoCOnvSelected = async (textToSend, fileToSend) => {
    isNewConvRef.current = true;
    isSendingRef.current = true;

    dispatch(clearMessages());
    dispatch(setLoading(true));

    try {
      const newConv = await createConversation();
      const convData = newConv.data;
      const newTitle = generateTitle(textToSend || fileToSend?.name || "New Chat");

      await updateConversationApi(convData._id, newTitle, selectedMode);

      const updatedConv = { ...convData, title: newTitle };

      dispatch(addConversationToSlice(updatedConv));
      dispatch(setSelectedConversation(updatedConv));

      dispatch(
        addMessage({
          role: "user",
          content: textToSend,
          file: fileToSend ? fileToSend.name : null,
          id: Date.now().toString(),
        })
      );

      dispatch(setLoading(true));

      const aiRes = await sendMessages(textToSend, convData._id, selectedMode, fileToSend);
      const aiData = aiRes.data || aiRes;

      dispatch(
        addMessage({
          role: "assistant",
          content: aiData.data || aiData.content || aiData,
          images: aiRes.images || [],
        })
      );

      dispatch(setArtifacts(aiRes.artifacts || []));
    } catch (err) {
      console.error("Failed to create conversation or send message:", err);

      const errorMessage = getErrorMessage(err);
      dispatch(
        addMessage({
          role: "assistant",
          content: errorMessage,
          isError: true,
        })
      );
    } finally {
      dispatch(setLoading(false));
      isNewConvRef.current = false;
      isSendingRef.current = false;
    }
  };

  useEffect(() => {
    if (!selectedConv?._id) {
      dispatch(clearMessages());
      return;
    }

    if (isNewConvRef.current || isSendingRef.current) {
      return;
    }

    const fetchMessages = async () => {
      dispatch(setLoading(true));
      try {
        const messages = await getMessages(selectedConv._id);
        dispatch(setMessages(messages.data));
        const latestArtifacts = [...messages.data].reverse().find((msg) => msg.artifacts)?.artifacts || null;
        dispatch(setArtifacts(latestArtifacts));

      } catch (err) {
        console.error("Failed to fetch messages:", err);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchMessages();
  }, [selectedConv?._id, dispatch]);

  const handleSend = async () => {
    if ((!input.trim() && !file) || loading) return;

    const currentInput = input;
    const currentFile = file;

    setInput("");
    setFile(null);

    if (!selectedConv || !selectedConv._id) {
      await handleNoCOnvSelected(currentInput, currentFile);
      return;
    }

    isSendingRef.current = true;

    const currentTitle = selectedConv.title?.toLowerCase() || "";
    const isDefaultTitle =
      currentTitle === "new conversation" ||
      currentTitle === "new chat" ||
      !selectedConv.title;

    if (isDefaultTitle) {
      const newTitle = generateTitle(currentInput || currentFile?.name || "New Chat");
      dispatch(updateConversationTitle(newTitle));
      updateConversationApi(selectedConv._id, newTitle, selectedMode).catch(
        (err) => console.error("Failed to update conversation title:", err)
      );
    }

    dispatch(
      addMessage({
        role: "user",
        content: currentInput,
        file: currentFile ? currentFile.name : null,
        id: Date.now().toString(),
      })
    );
    dispatch(setLoading(true));

    try {
      const aiRes = await sendMessages(
        currentInput,
        selectedConv._id,
        selectedMode,
        currentFile
      );
      const aiData = aiRes.data || aiRes;

      dispatch(
        addMessage({
          role: "assistant",
          content: aiData.data || aiData.content || aiData,
          images: aiData.images || [],
        })
      );

      dispatch(setArtifacts(aiRes.artifacts || []));
    } catch (err) {
      console.error("API call failed:", err);

      const errorMessage = getErrorMessage(err);
      dispatch(
        addMessage({
          role: "assistant",
          content: errorMessage,
          isError: true,
        })
      );
    } finally {
      dispatch(setLoading(false));
      isSendingRef.current = false;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!loading) {
        handleSend();
      }
    }
  };

  return (
    <main className="relative flex h-screen min-w-0 flex-1 flex-col overflow-hidden bg-white">
      <div className="flex h-14 items-center justify-between border-b border-black/[0.06] bg-white/90 px-2 sm:px-4 backdrop-blur-md">
        <Button
          variant="ghost"
          size="icon"
          className="size-9 shrink-0 rounded-lg text-zinc-400 transition-colors hover:bg-[#EB4C4C]/10 hover:text-[#EB4C4C] md:hidden"
          onClick={onOpenSidebar}
          title="Open Menu"
        >
          <Menu size={20} />
        </Button>

        <div className="min-w-0 flex-1">
          <ChatHeader title={selectedConv?.title} />
        </div>

        {hasArtifacts && (
          <Button
            variant="ghost"
            size="icon"
            className="relative size-9 shrink-0 rounded-lg text-[#EB4C4C] transition-colors hover:bg-[#EB4C4C]/10 md:hidden"
            onClick={onOpenArtifacts}
            title="View Artifacts"
          >
            <FileCode2 size={20} />
            <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-[#EB4C4C] animate-pulse ring-2 ring-white" />
          </Button>
        )}
      </div>

      <div className="min-h-0 flex-1">
        <MessageList
          messages={messages}
          loading={loading}
          selectedConversation={selectedConv}
        />
      </div>

      <ChatInputBox
        input={input}
        setInput={setInput}
        file={file}
        setFile={setFile}
        handleSend={handleSend}
        handleKeyDown={handleKeyDown}
        selectedMode={selectedMode}
        setSelectedMode={setSelectedMode}
        loading={loading}
      />
    </main>
  );
};