import express from 'express';
import {Server} from 'socket.io';
import http from 'http';

const app =express();
const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin:['http://localhost:5173'],
    },
});

export function getReceiverSocketId(userId){
    return userSocketMap[userId];
}

const userSocketMap={}; 

io.on("connection",(socket)=>{
    console.log('A user connected',socket.id);
    const userId = socket.handshake.query.userId;
    if(userId) userSocketMap[userId] = socket.id

    io.emit("getOnlineUsers",Object.keys(userSocketMap));

     // 📩 Listen for typing event
  socket.on("typing", ({ receiverId }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("userTyping", { senderId: userId });
    }
  });

  // 📨 Listen for stop typing event (optional but better UX)
  socket.on("stopTyping", ({ receiverId }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("userStoppedTyping", { senderId: userId });
    }
  });

    socket.on("disconnect",()=>{
        console.log("A user disconnect",socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketMap))
    });
})

  

export{
    io,app,server
};
