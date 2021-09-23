import React, { useState,useEffect } from 'react'
import "../Assets/style.css"

// Quit Button
 
export default function BoardComponent({player,socket,playerXWins,playerOWins}) {
  const [board,setBoard]=useState([
    ["","",""],
    ["","",""],
    ["","",""],
  ]);
  const [currentPlayer,setCurrentPlayer]=useState("X");
  const playerWon=()=>{
    for(let i=0,j=0;i<board.length;i++){
      if(board[i][j]===currentPlayer && board[i][j+1]===currentPlayer && board[i][j+2]===currentPlayer){
        return true;
      }
    }
    for(let i=0,j=0;i<board.length;i++){
      if(board[j][i]===currentPlayer && board[j+1][i]===currentPlayer && board[j+2][i]===currentPlayer){
        return true;
      }
    }
    if(board[0][0]===currentPlayer && board[1][1]===currentPlayer && board[2][2]===currentPlayer){
      return true;
    }
    if(board[0][2]===currentPlayer && board[1][1]===currentPlayer && board[2][0]===currentPlayer){
      return true;
    }
    return false;
  }
  const isBoardFull=()=>{
    for(let i=0;i<board.length;i++){
      for(let j=0;j<board[i].length;j++){
        if(board[i][j]==""){
          return false;
        }
      }
    }
    return true;
  }

  const restartBoard=(room)=>{
    socket.emit("played",{arr:[
      ["","",""],
      ["","",""],
      ["","",""],
    ],currentPlayer,room});
  }

  useEffect(() => {
    socket.on("set-board",async ({newBoard,newPlayer})=>{
      await setBoard([...newBoard]);
      const room=window.location.href.split("/")[4];
      if(playerWon()){
        socket.emit("player-won",{wins:currentPlayer==="X"?playerXWins:playerOWins,room,currentPlayer});
        restartBoard(room);
        return;
      }
      else if(isBoardFull()){
        restartBoard(room);
        return;
      } 
      setCurrentPlayer(newPlayer);
    })
    return () => socket.off("set-board");
  }, [socket,playerWon]);


  const play=async (i,j)=>{
    if(player===currentPlayer){
      const arr=[...board];
      const room=window.location.href.split("/")[4];
      if(board[i][j]===""){
        arr[i][j]=currentPlayer;
        socket.emit("played",{arr,currentPlayer,room});
      }
    }
  };
  
  return (
    <div id="board">
      {board.map((row,i)=>
        <div className="board-row" key={i}>
          {row.map((cell,j)=>
            <div className="board-cell" onClick={()=>{play(i,j)}} key={i+j}>
              {cell}
            </div>
          )}
          </div>
        )}
      <h3 className="mt-3" style={{textAlign:"center"}}>{currentPlayer}'s Turn</h3>
    </div>
  )
}
