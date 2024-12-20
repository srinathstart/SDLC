import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import io from 'socket.io-client';
import Navba from '../components/Navba';
import Sidebar from '../components/Sidebar';
import { useLocation } from 'react-router-dom';

const socket = io("http://localhost:5000");

const Chat = () => {
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState('');
  const [messages, setMessages] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [sendmsg, setSendmsg] = useState('');
  const [selectedConv, setSelectedConv] = useState('');
  
  // Reference for the messages container
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.id);
        socket.emit("join", decodedToken.id);
      } catch (error) {
        console.error('Invalid token:', error);
      }
    }
  }, []);
  
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const chatUserId = queryParams.get('userId');
    if (chatUserId) {
      setSelectedUserId(chatUserId);
    }
  }, [location.search]);

  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/user/users/${userId}`);
      setUsers(res.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      alert("Failed to fetch users.");
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUsers();
    }
  }, [userId]);

  // Fetch messages
  const fetchMessages = async () => {
    try {
      if (userId && selectedUserId) {
        const res = await axios.get(`http://localhost:5000/message/${selectedUserId}?senderId=${userId}`);
        setMessages(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch messages:", err);
      alert("Failed to fetch messages.");
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [userId, selectedUserId]);

  // Scroll to the bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Listen for new messages
  useEffect(() => {
    socket.on("newMessage", (newMessage) => {
      if (
        (newMessage.senderId === userId && newMessage.receiverId === selectedUserId) ||
        (newMessage.senderId === selectedUserId && newMessage.receiverId === userId)
      ) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    });

    return () => {
      socket.off("newMessage");
    };
  }, [userId, selectedUserId]);

  const handleUserClick = (userId, username) => {
    setSelectedUserId(userId);
    setSelectedConv(username);
    setMessages([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sendmsg.trim()) return;

    try {
      await axios.post(`http://localhost:5000/message/send/${selectedUserId}`, {
        message: sendmsg,
        userid: userId,
      });
      setSendmsg('');
    } catch (err) {
      console.error("Failed to send message:", err);
      alert("Failed to send message.");
    }
  };

  return (
    <div className='d-flex'>
      <div style={{ width: '20%' }}>
        <Sidebar />
      </div>
      <div className='center-wrapper' style={{ width: '100%' }}>
        <div className="chat-container">
          <div className="user-list">
            <table>
              <thead>
                <tr>
                  <th>Chat</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="user-row">
                    <td>
                      <button onClick={() => handleUserClick(user._id, user.username)}>
                        {user.username}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="chat-window">
            {selectedUserId ? (
              <>
                <div className="chat-header">{selectedConv}</div>
                <div className="messages">
                  {messages.length === 0 ? (
                    <p>No messages to display</p>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message._id}
                        className={`message ${message.senderId === userId ? 'from-you' : 'from-other'}`}
                      >
                        {message.message}
                      </div>
                    ))
                  )}
                  {/* Scroll to bottom marker */}
                  <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSubmit} className="message-form">
                  <input
                    type="text"
                    placeholder="Send a message"
                    value={sendmsg}
                    onChange={(e) => setSendmsg(e.target.value)}
                    className="message-input"
                  />
                  <button type="submit" className="send-button">Send</button>
                </form>
              </>
            ) : (
              <p>Select a user to start a chat</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
