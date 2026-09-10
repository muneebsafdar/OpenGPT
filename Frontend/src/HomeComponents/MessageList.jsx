import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EmptyState } from "./EmptyState";
import { MessageItem } from "./MessageItem";
import { TypingIndicator } from "./TypingIndicator";

export const MessageList = ({ messages = [], loading, selectedConversation }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  if (!selectedConversation) {
    return <EmptyState />;
  }

  return (
    <div className="h-full w-full flex-1 bg-gradient-to-b from-[#EB4C4C]/[0.02] to-transparent">
      <ScrollArea className="h-full w-full">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-3 py-4 sm:gap-6 sm:px-6 sm:py-8">
          {messages.map((message, index) => (
            <MessageItem
              key={message.id || message._id || index}
              message={message}
            />
          ))}

          {loading && <TypingIndicator />}

          <div ref={bottomRef} />
        </div>
      </ScrollArea>
    </div>
  );
};