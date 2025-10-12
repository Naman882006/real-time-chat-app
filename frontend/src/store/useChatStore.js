import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  onlineUsers: [], // ✅ needed for online/offline
  typingUser: null, // ✅ store who’s typing
  isUsersLoading: false,
  isMessagesLoading: false,

  // 🟢 Fetch all users except logged-in
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // 💬 Fetch messages for selected user
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      const msgs = Array.isArray(res.data)
        ? res.data
        : res.data.messages || [];
      set({ messages: msgs });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // ✉️ Send message
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },

  // 🧠 Subscribe to new messages (real-time)
  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.off("newMessage");
    socket.on("newMessage", (newMessage) => {
      const { selectedUser, messages } = get();

      // Only add message if it's from the active chat user
      if (
        newMessage.senderId === selectedUser._id ||
        newMessage.receiverId === selectedUser._id
      ) {
        set({ messages: [...messages, newMessage] });
      }
    });
  },

  // 🚫 Unsubscribe to messages
  unsubscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  // ✍️ Subscribe to typing + online status
  subscribeToSocketEvents: () => {
    const socket = useAuthStore.getState().socket;

    // ✅ Online users
    socket.on("getOnlineUsers", (onlineUserIds) => {
      set({ onlineUsers: onlineUserIds });
    });

    // 💬 User typing
    socket.on("userTyping", ({ senderId }) => {
      const { selectedUser } = get();
      if (selectedUser && senderId === selectedUser._id) {
        set({ typingUser: senderId });
      }
    });

    // 💬 Stop typing
    socket.on("userStoppedTyping", ({ senderId }) => {
      const { selectedUser } = get();
      if (selectedUser && senderId === selectedUser._id) {
        set({ typingUser: null });
      }
    });
  },

  // ✅ Set selected chat user
  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
