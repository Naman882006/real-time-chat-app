import { create } from "zustand";
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
            set({messages: res.data});

        } catch (error) {
            toast.error(error.response.data.message);
        }finally{
            set({isMessagesloading:false});
        }
    },
    sendMessage:async (messageData)=>{
      const {selectedUser, messages}=get();
      try {
        const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`,messageData);
         if (!res?.data) {
    throw new Error("No data returned from server");
  }
         const newMessage = res?.data;

    if (!newMessage) throw new Error("No data returned from server");

    // Ensure messages is always an array
    set({ messages: [...(Array.isArray(messages) ? messages : []), newMessage] });

      } catch (error) {
  toast.error(error.response?.data?.message || error.message);
}

    },

    setSelectedUser:(selectedUser)=> set({selectedUser}),
}))