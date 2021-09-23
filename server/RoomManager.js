module.exports=class RoomManager{
  constructor(){
    this.rooms=[];
  }

  addNewRoom(roomID){
    this.rooms.push({id:roomID,players:[]});
  }

  addPlayerToTheRoom(roomID,{id,username}){
    let index=-1;
    for(let i=0;i<this.rooms.length;i++){
      if(this.rooms[i].id===roomID){
        index=i;
        break;
      }
    }
    if(index!=-1){
      this.rooms[index].players.push({id,username});
      return this.rooms[index].players.length===2;
    }
  }

  findRoomIndex(id){
    for(let i=0;i<this.rooms.length;i++){
      const room=this.rooms[i];
      if(room.id == id){
        return i;
      }
    }
    return -1;
  }
  findPlayerIndex(roomIndex,id){
    const arr=this.rooms[roomIndex].players;
    for(let i=0;i<arr.length;i++){
      if(arr[i].id===id){
        return i;
      }
    }
    return -1;
  }

  deleteRoom(index){
    this.rooms.splice(index,1);
  }
  
  deletePlayer(room,player){
    const index=this.findRoomIndex(room);
    if(index!=1){
      const playerIndex=this.findPlayerIndex(index,player);
      this.rooms[index].players.splice(playerIndex,1);
    }
  }
}