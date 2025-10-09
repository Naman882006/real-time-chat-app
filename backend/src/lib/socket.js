import express from 'express';
import {Server} from 'socket.io';
import http from 'http';
import { Socket } from 'dgram';

const app =express();
const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin:['http://localhost:5173'],
    },
});
io.on("connection",(socket)=>{
    console.log('Auser connected',socket.id);

    socket.on("disconnect",()=>{
        console.log("A user disconnect",socket.id);
    });
})

  

export{
    io,app,server
};
