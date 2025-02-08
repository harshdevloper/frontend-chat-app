import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  groups: [], // Store for groups
  selectedGroup: null, // Store for selected group
  isUsersLoading: false,
  isMessagesLoading: false,

  // Fetch users
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // Fetch group messages
  getGroupMessages: async (groupId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/group/${groupId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // Fetch user messages
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // Send group message
  sendGroupMessage: async (messageData) => {
    const { selectedGroup, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/group/${selectedGroup._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  // Send private message
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  // Subscribe to private messages
  subscribeToMessages: () => {
    const { selectedUser, selectedGroup } = get();
    const socket = useAuthStore.getState().socket;

    if (selectedUser) {
      socket.on("newMessage", (newMessage) => {
        if (newMessage.senderId === selectedUser._id) {
          set({
            messages: [...get().messages, newMessage],
          });
        }
      });
    }

    if (selectedGroup) {
      socket.on("newGroupMessage", (newMessage) => {
        if (newMessage.groupId === selectedGroup._id) {
          set({
            messages: [...get().messages, newMessage],
          });
        }
      });
    }
  },

  // Subscribe to group messages
  subscribeToGroupMessages: () => {
    const { selectedGroup } = get();
    const socket = useAuthStore.getState().socket;
    if (!selectedGroup) return;

    socket.on("newGroupMessage", (newMessage) => {
      if (newMessage.groupId === selectedGroup._id) {
        set({
          messages: [...get().messages, newMessage],
        });
      }
    });
  },

  // Unsubscribe from messages
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
    socket.off("newGroupMessage");
  },

  // Set selected user
  setSelectedUser: (selectedUser) => set({ selectedUser }),

  // Set selected group
  setSelectedGroup: (selectedGroup) => set({ selectedGroup }),

  // Get all groups
  getGroups: async () => {
    try {
      const res = await axiosInstance.get("/messages/groups");
      set({ groups: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
}));
