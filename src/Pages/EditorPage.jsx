import React, { useState } from 'react'
import "../App.css"
import Client from "../Components/Client.jsx"
import Editor from "../Components/Editor.jsx"

const EditorPage = () => {
  
  const [client, setClient] = useState([
    {socketId: 1, username: 'Sailesh' },
    {socketId: 2, username: 'Sailesh' },
  ])

  return (
    <>
    <div className="main-class">
      <div className="sidebar">
      <div className="name name-editor">CodeCollab </div>
        <div className="sidebar-inner">
          <div className="client-list">{client.map((client) => (<Client key={client.socketId} username={client.username} />))}</div>
        </div>
        <div className="buttons">
        <button className="button-cmn copy-button">Copy ROOM ID</button>
        <button className="button-cmn leave-button">Leave</button> 
        </div>
      </div>
      <div className="editor-page"><Editor /></div>
    </div>
    </>
  )
}

export default EditorPage