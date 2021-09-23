import React, { useEffect, useRef, useState } from 'react'
import BoardComponent from "./BoardComponent"
import io from "socket.io-client";
import { useHistory } from "react-router-dom";
import "../Assets/style.css"
import TooManyPlayer from './TooManyPlayer';

const socket=io.connect('http://localhost:5000', {reconnect: true});
export default function Game({username}) {
  const [connected,setConnected]=useState(false);
  const[symbol,setSymbol]=useState("");
  const [extraPlayer,setExtraPlayer]=useState(false);
  const [playerXWins,setPlayerXWins]=useState(0);
  const [playerOWins,setPlayerOWins]=useState(0);
  const[enemyUsername,setEnemyUsername]=useState("");


  const STARTING_ROOM=window.location.href.split("/")[4];
  const roomRef=useRef(null);
  const history=useHistory();

  useEffect(()=>{
    socket.emit("join-room",{room:window.location.href.split("/")[4],username});
  },[])

  useEffect(()=>{
    socket.on("add-win",({wins,player})=>{
      if(player==="X"){
        setPlayerXWins(wins);
      }
      else{
        setPlayerOWins(wins);
      }
    })
    return ()=>socket.off("add-win");
  },[playerXWins,playerOWins])

  socket.on("start-game",()=>{
    setConnected(true);
  })

  socket.on("too-many-players",()=>setExtraPlayer(true))

  socket.on("assign-player",({symbol,otherUsername})=>{
    setSymbol(symbol);
    setEnemyUsername(otherUsername);
  })

  socket.on("stop-game",()=>{
    setConnected(false);
  })

  socket.on("left-game",()=>history.push("/"));

  const joinRoom=(e)=>{
    e.preventDefault();
    const URL=`/room/${roomRef.current.value}`;
    history.push(URL);
    const room=URL.split("/")[2];
    socket.emit("leave-room",STARTING_ROOM);
    socket.emit("join-room",{room,username});
  }

  const leaveRoom=(e)=>{
    const room=window.location.href.split("/")[4];
    socket.emit("leave-room",room);
  }

  return (
    <div className="container d-flex justify-content-center ">
    {extraPlayer?<TooManyPlayer room={window.location.href.split("/")[4]}/>:
    connected?
      <div>
        <h1 style={{textAlign:"center",fontSize:"3rem"}} className="mb-5">TIC-TAC-TOE</h1>
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h4 style={{textAlign:"center"}}>{username} (Player {symbol})<br/>{symbol==="X"?playerXWins:playerOWins}</h4>
          <h4 style={{textAlign:"center"}}>{enemyUsername} (Player {symbol==="X"?"O":"X"})<br/>{symbol==="X"?playerOWins:playerXWins}</h4>
        </div>
        <BoardComponent player={symbol} socket={socket}
        playerXWins={playerXWins} playerOWins={playerOWins}/>
        <button className="mt-4 btn btn-danger mx-auto" 
        onClick={leaveRoom}
        >QUIT</button>
      </div>
      :
      <div>
        <h1 className="mb-3" style={{textAlign:"center"}}>Hello {username} <br/>Invite your friend with this ID</h1>
        <h2 id="friend-url">{STARTING_ROOM}</h2>
        <h1 className="my-3" style={{textAlign:"center"}}>Or<br/></h1>
        <form className="form" onSubmit={joinRoom}>
          <label className="form-label">Join a room:</label>
          <input className="form-control" ref={roomRef} required type="text"/>
          <button className="btn btn-primary mt-3" type="submit">Join</button>
        </form>
      </div>}
    </div>
  )
}
