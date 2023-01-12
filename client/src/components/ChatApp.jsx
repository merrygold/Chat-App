import React, { useState } from 'react';
import io from 'socket.io-client';

import axios from "axios"

const socket = io('http://localhost:3000');

function ChatApp() {

  const [check, setCheck] = useState("no messsage from server")

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [username, setUsername] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if(username !== "") {
      const data = {
          message: input,
          username: username,
          timestamp: new Date().toLocaleTimeString()
      }
      socket.emit('new_message', data);
    }
    setInput('');
  }

  socket.on('new_message', (data) => {
    setMessages([...messages, data]);
  });

  async function checkServer() {
    const response = await axios.get("http://localhost:3000/");
    setCheck(response.data.Done)
  }

  return (
    <div>
      <h1>Chat App</h1>
      <button onClick={checkServer}>Value {check}</button>
      <form>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br/><br/>
        <input
          type="text"
          placeholder="Enter your message"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button type="submit" onClick={handleSubmit}>Send</button>
      </form>
      <div>
        {messages.map((message, index) => (
          <div key={index}>
            <strong>{message.username}</strong>
            <br/>
            <p>{message.message}</p>
            <span>{message.timestamp}</span>
            <br/><br/>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatApp;