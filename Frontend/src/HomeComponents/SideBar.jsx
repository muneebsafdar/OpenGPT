import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  Bot,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  MessageSquare,
  LogOut,
  Coins,
  X,
} from "lucide-react";

import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import { logout } from "../slice/authSlice.js";
import { logoutFeature } from "@/features/logoutFeature.js";
import getConversations from "@/features/getConversations.js";

import {
  setConversation,
  setSelectedConversation,
} from "@/slice/ConversationSlice.js";

export const SideBar = ({ onToggleBilling, isMobileOpen, setIsMobileOpen }) => {
  const [collapsed, setCollapsed] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { conversations, selectedConv } = useSelector(
    (state) => state.conversation
  );

  useEffect(() => {
    const getConversationData = async () => {
      try {
        const data = await getConversations();
        const convList = data.data.data || [];
        dispatch(setConversation(convList.reverse()));
      } catch (error) {
        console.error("Failed to get conversations:", error);
      }
    };

    getConversationData();
  }, [selectedConv, dispatch]);

  const closeMobileSidebar = () => {
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  const handleCreateConv = () => {
    dispatch(setSelectedConversation(null));
    closeMobileSidebar();
  };

  const handleSelectConversation = (chat) => {
    dispatch(setSelectedConversation(chat));
    closeMobileSidebar();
  };

  const handleLogout = async () => {
    await logoutFeature();
    dispatch(logout());
    navigate("/login");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      {/* Mobile Overlay Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 md:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex h-full min-h-0 flex-col
          border-r border-black/[0.06] bg-white
          shadow-[1px_0_0_0_rgba(0,0,0,0.02)]
          transition-all duration-300 ease-in-out
          md:relative md:z-auto
          ${isMobileOpen ? "translate-x-0 w-[280px] sm:w-[320px] shadow-2xl" : "-translate-x-full md:translate-x-0"}
          ${collapsed ? "md:w-[72px]" : "md:w-[264px]"}
        `}
      >
        {/* Header */}
        <div
          className={`
            flex h-16 shrink-0 items-center px-3.5
            ${collapsed && !isMobileOpen ? "md:justify-center" : "justify-between"}
          `}
        >
          {/* Logo & Brand (Shown when expanded or on mobile) */}
          {(!collapsed || isMobileOpen) && (
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-[10px] bg-[#EB4C4C] shadow-sm shadow-[#EB4C4C]/30 ring-1 ring-[#EB4C4C]/20">
                <Bot size={16} className="text-white" strokeWidth={2.25} />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-tight text-zinc-900">
                  OpenGPT
                </span>

                <Badge className="h-5 rounded-full border-0 bg-[#EB4C4C]/10 px-2 text-[9px] font-semibold tracking-wide text-[#EB4C4C] hover:bg-[#EB4C4C]/10">
                  {user?.plan}
                </Badge>
              </div>
            </div>
          )}

          {/* Desktop Control: Collapsed State (Expand Button) */}
          {collapsed && !isMobileOpen && (
            <Button
              variant="ghost"
              size="icon"
              className="hidden size-9 rounded-lg text-zinc-400 transition-colors hover:bg-[#EB4C4C]/10 hover:text-[#EB4C4C] md:flex"
              onClick={() => setCollapsed(false)}
              title="Expand Sidebar"
            >
              <PanelLeftOpen size={18} />
            </Button>
          )}

          {/* Desktop Control: Expanded State (Collapse Button) */}
          {!collapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="hidden size-8 rounded-lg text-zinc-400 transition-colors hover:bg-[#EB4C4C]/10 hover:text-[#EB4C4C] md:flex"
              onClick={() => setCollapsed(true)}
              title="Collapse Sidebar"
            >
              <PanelLeftClose size={17} />
            </Button>
          )}

          {/* Mobile Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="size-8 rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 md:hidden"
            onClick={closeMobileSidebar}
          >
            <X size={18} />
          </Button>
        </div>

        {/* New Chat Button */}
        <div className="shrink-0 px-3 pb-3">
          <Button
            onClick={handleCreateConv}
            className={`
              h-9 rounded-lg bg-[#EB4C4C] text-white shadow-sm shadow-[#EB4C4C]/25 transition-all duration-200
              hover:bg-[#D63F3F] hover:shadow-md hover:shadow-[#EB4C4C]/30
              active:scale-[0.98]
              ${collapsed && !isMobileOpen ? "w-full justify-center px-0" : "w-full justify-start gap-2 px-3"}
            `}
          >
            <Plus size={16} strokeWidth={2.5} />

            {(!collapsed || isMobileOpen) && (
              <span className="text-xs font-semibold">
                New Chat
              </span>
            )}
          </Button>
        </div>

        <Separator className="bg-black/[0.06]" />

        {/* Chat History List */}
        <ScrollArea className="min-h-0 flex-1 px-2 py-3">
          {(!collapsed || isMobileOpen) && (
            <p className="px-2.5 pb-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
              Recent chats
            </p>
          )}

          <div className="space-y-0.5 px-1">
            {conversations.length === 0 ? (
              (!collapsed || isMobileOpen) && (
                <p className="px-2.5 py-4 text-center text-xs text-zinc-400">
                  No recent chats
                </p>
              )
            ) : (
              conversations.map((chat) => {
                const isActive = selectedConv?._id == chat?._id;
                return (
                  <button
                    key={chat._id}
                    type="button"
                    onClick={() => handleSelectConversation(chat)}
                    title={collapsed && !isMobileOpen ? chat.title : undefined}
                    className={`
                      group relative flex w-full items-center rounded-lg text-xs font-medium
                      transition-all duration-150
                      ${collapsed && !isMobileOpen ? "h-10 justify-center" : "h-10 gap-2.5 px-2.5"}
                      ${
                        isActive
                          ? "bg-[#EB4C4C]/10 text-[#EB4C4C]"
                          : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800"
                      }
                    `}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-[#EB4C4C]" />
                    )}

                    <MessageSquare
                      size={15}
                      className={`
                        shrink-0 transition-colors
                        ${
                          isActive
                            ? "text-[#EB4C4C]"
                            : "text-zinc-400 group-hover:text-zinc-600"
                        }
                      `}
                    />

                    {(!collapsed || isMobileOpen) && (
                      <span className="truncate text-left">{chat?.title}</span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </ScrollArea>

        {/* User Footer */}
        <div className="shrink-0 border-t border-black/[0.06] p-3">
          {collapsed && !isMobileOpen ? (
            <div className="flex flex-col items-center gap-2">
              <Avatar className="size-8 ring-2 ring-[#EB4C4C]/15">
                {user?.avatar && (
                  <AvatarImage src={user.avatar} alt={user?.username || "User"} />
                )}
                <AvatarFallback className="bg-[#EB4C4C] text-[10px] font-semibold text-white">
                  {getInitials(user?.username)}
                </AvatarFallback>
              </Avatar>

              <Button
                variant="ghost"
                size="icon"
                className="size-8 rounded-lg text-amber-500 transition-colors hover:bg-amber-500/10 hover:text-amber-600"
                onClick={onToggleBilling}
                title="Plans & Billing"
              >
                <Coins size={15} />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Avatar className="size-8 shrink-0 ring-2 ring-[#EB4C4C]/15">
                {user?.avatar && (
                  <AvatarImage src={user.avatar} alt={user?.username || "User"} />
                )}
                <AvatarFallback className="bg-[#EB4C4C] text-[10px] font-semibold text-white">
                  {getInitials(user?.username)}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-zinc-900">
                  {user?.username}
                </p>
                <p className="truncate text-[10px] text-zinc-400">
                  {user?.email || ""}
                </p>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="size-8 shrink-0 rounded-lg text-amber-500 transition-colors hover:bg-amber-500/10 hover:text-amber-600"
                onClick={onToggleBilling}
                title="Plans & Billing"
              >
                <Coins size={15} />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="size-8 shrink-0 rounded-lg text-zinc-400 transition-colors hover:bg-[#EB4C4C]/10 hover:text-[#EB4C4C]"
                onClick={handleLogout}
                title="Log out"
              >
                <LogOut size={14} />
              </Button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};