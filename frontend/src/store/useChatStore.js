import { create } from "zustand";
import {persist} from "zustand/middleware";
import toast from "react-hot-toast";
import {axiosInstance } from "../lib/axios";

export const useChatStore = create((set,get)=>({
    messages:[],
    users:[],
    selectedUser:null,
    isUsersLoading:false,
    isMessagesloading:false,

    getUsers:async()=>{
        set({isUsersLoading:true});
        try {
            const res= await axiosInstance.get("/messages/users");
            set({users:res.data});

        } catch (error) {
            toast.error(error.response.data.message);
        }finally{
            set({isUsersLoading:false});
        }
    },
    getMessages:async(userId)=>{
        set({isMessagesloading:true});
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
             const msgs = Array.isArray(res.data)
      ? res.data
      : res.data.messages || [];
            
 set({ messages: msgs, isMessagesloading: false });
        } catch (error) {
            toast.error(error.response.data.message);
        }finally{
            set({isMessagesloading:false});
        }
    },
sendMessage: async (messageData) => {
  const { selectedUser, messages } = get();
  try {
    const res = await axiosInstance.post(
      `/messages/send/${selectedUser._id}`,
      messageData
    );

    // Make sure messages is always an array
    const updatedMessages = Array.isArray(messages)
      ? [...messages, res.data]
      : [res.data];

    set({ messages: updatedMessages });

    return res.data; // important if you need it
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to send message");
  }
},

    setSelectedUser:(selectedUser)=> set({selectedUser}),
}));