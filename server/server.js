const express=require("express");
const http=require("http");
const socketio=require("socket.io");
const RoomManager = require("./RoomManager");

const roomManager=new RoomManager();
const app=express();
const server=http.createServer(app);
const io=socketio(server,{
  cors:{
    origin:"http://localhost:3000",
    credentials: true
  }
});

io.on("connection",(socket)=>{
  socket.on("create-room",(room)=>{
    roomManager.addNewRoom(room);
  })
  socket.on("join-room",({room,username})=>{
    socket.join(room);
    const index=roomManager.findRoomIndex(room);
    if(roomManager.addPlayerToTheRoom(room,{id:socket.id,username})){
      io.in(room).emit("start-game");
      const playerIndex=roomManager.findPlayerIndex(index,socket.id);
      const playerSymbol=playerIndex===0?"X":"O";
      socket.to(room).emit("assign-player",{symbol:playerSymbol==="X"?"O":"X",otherUsername:playerIndex===0?
      roomManager.rooms[index].players[0].username
      :
      roomManager.rooms[index].players[1].username});
      io.to(socket.id).emit("assign-player",{symbol:playerSymbol,otherUsername:playerIndex===0?
        roomManager.rooms[index].players[1].username
        :
        roomManager.rooms[index].players[0].username})
    }
    else{
      if(index!==-1){
        if(roomManager.rooms[index].players.length>2){
          socket.emit("too-many-players");
        }
      }
    }
  })

  socket.on("played",({arr,currentPlayer,room})=>{
    const newPlayer=currentPlayer==="X"?"O":"X";
    const newBoard=[...arr];
    io.in(room).emit("set-board",{newBoard,newPlayer});
  })
  
  socket.on("player-won",({wins,room,currentPlayer})=>{
    io.in(room).emit("add-win",{wins,player:currentPlayer});
  });
  
  socket.on("leave-room",(room)=>{
    roomManager.deletePlayer(room,socket.id);
    socket.leave(room);
    const index=roomManager.findRoomIndex(room);
    if(index!==-1){
      if(roomManager.rooms[index].players.length===0){
        roomManager.deleteRoom(index);
      }
      else if(roomManager.rooms[index].players.length===1){
        socket.to(room).emit("stop-game");
        socket.emit("left-game");
      }
    }
  })


})

server.listen(5000);