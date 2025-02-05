import React, { useState } from 'react';
import '../App.css';
import {v4 as uuid_v4} from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Rooms = () => {

  const navigate = useNavigate();
  const [roomid, setRoomId] = useState('');
  const [username, setUserName] = useState('');

  const createNewRoom = (e) => {
    e.preventDefault(); // Stops from refreshing the page.
    const id = uuid_v4();
    setRoomId(id);

    toast.success("Created a new room.")
  }

  const joinRoom = () => {
      if(!roomid || !username){
        toast.error("Enter a roomid and an username.")
      }

      navigate(`/editor/${roomid}`, {
         state:{
           username,
         }
      })
  } 

  const handleInputEnter = (e) => {
    console.log(`Key pressed: ${e.code}`);

    if(e.code === 'Enter') {
      joinRoom();
    }
};

  return (
    <>
    <div className="JoinRooms">
      <div className="form-box">
          <p className="name-form">CodeCollab</p>
          <h4 className="main-label">Enter the ROOM ID</h4>
          <div className="inputForm">
            <input type='text' className="input-box" placeholder='ROOM ID' value={roomid} onChange={(e) => setRoomId(e.target.value)/*onChange - used when one enters room id manually.*/}></input> 
            <input type='text' className="input-box" placeholder='USERNAME' value={username} onChange={(e) => setUserName(e.target.value)} onKeyDown={handleInputEnter}></input>
            <button className='join-button button-cmn' onClick={joinRoom}>Join</button>
            <span className='create-info'>If you don't have an invite, create a &nbsp;<a onClick={createNewRoom}className="createNewRoom"href=''>new room id</a>
            </span>
          </div>
        </div>
      </div> 
      </>
  )
}

export default Rooms