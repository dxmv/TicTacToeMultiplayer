import React from 'react'

export default function TooManyPlayer({room}) {
  return (
    <div>
      <h1 style={{textAlign:"center",fontSize:"3rem"}}>Room {room} is occupied<br/>Please wait for a player to leave or</h1>
      <a href="/" className="btn btn-danger">GO BACK</a>
    </div>
  )
}
