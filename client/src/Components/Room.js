import React, { useRef } from 'react'
import { useHistory } from "react-router-dom";
import {v4 as uuidv4} from "uuid";
import io from "socket.io-client";

const socket=io.connect('http://localhost:5000', {reconnect: true});
export default function Room({setUsername}) {
  const usernameRef=useRef(null);
  const URL=`/room/${uuidv4()}`;
  const history=useHistory();

  const joinRoom=(e)=>{
    e.preventDefault();
    setUsername(usernameRef.current.value);
    history.push(URL);
    const room=URL.split("/")[2]
    socket.emit("create-room",room);
  }

  return (
    <div className="container">
      <form className="form" onSubmit={joinRoom}>
        <div className="my-3">
          <label className="form-label">Username:</label>
          <input className="form-control" ref={usernameRef} required minLength="5" maxLength="25" type="text"/>
        </div>
        <button className="btn btn-primary">Create a new room</button>
      </form>
    </div>
  )
}
