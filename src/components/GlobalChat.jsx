// src/components/GlobalChat.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { Link } from 'react-router-dom';
// import api from '../services/api'; // Not used for now

const profanityFilter = ['badword1', 'badword2'];

function GlobalChat({ showLauncher = true }) {
    const { isOpen, setIsOpen, messages, sendMessage, deleteMessage, clearChat } = useChat();
    const [newMessage, setNewMessage] = useState('');
    const { user } = useAuth();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;

        if (!user || !user.username) {
            alert("Error: Your user data is not loaded correctly. Please log out and log back in.");
            return;
        }

        if (profanityFilter.some(word => newMessage.toLowerCase().includes(word))) {
            alert("Inappropriate language is not allowed.");
            return;
        }

        sendMessage(newMessage);
        setNewMessage('');
    };

    const handleDeleteMessage = (id) => {
        if (window.confirm("Delete this message?")) {
            deleteMessage(id);
        }
    };

    const handleClearAll = () => {
        if (window.confirm("Clear ENTIRE chat history? This cannot be undone.")) {
            clearChat();
        }
    };

    const formatDate = (isoString) => {
        if (!isoString) return 'Just now';
        return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (!isOpen) {
        if (!showLauncher) return null;
        return (
            <button onClick={() => setIsOpen(true)} className="fixed bottom-5 right-5 bg-cyan-600 text-white p-4 rounded-full shadow-lg z-50 hover:bg-cyan-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            </button>
        );
    }

    return (
        <div className="fixed bottom-5 right-5 w-[350px] h-[500px] bg-gray-800 border border-gray-700 rounded-lg shadow-2xl flex flex-col z-50 animate-fadeInUp">
            <div className="flex justify-between items-center p-3 bg-gray-900 rounded-t-lg">
                <h3 className="font-bold text-lg text-cyan-400">Global Chat</h3>
                <div className="flex items-center space-x-2">
                    {user?.role === 'admin' && (
                        <button onClick={handleClearAll} title="Clear All Chat" className="text-red-500 hover:text-red-400 mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                    )}
                    <button onClick={() => setIsOpen(false)} className="text-gray-400 text-2xl hover:text-white">&times;</button>
                </div>
            </div>

            <div className="flex-1 p-3 overflow-y-auto">
                {messages.length === 0 && (
                    <div className="text-center text-gray-500 mt-10">No messages yet. Say hi!</div>
                )}
                {messages.map((msg, index) => {
                    const isMe = msg.username === user.username;
                    return (
                        <div key={msg.id || index} className={`mb-3 flex items-center group ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`inline-block p-2 rounded-lg max-w-[80%] ${isMe ? 'bg-cyan-800' : 'bg-gray-700'}`}>
                                <div className="text-xs text-gray-400 flex justify-between items-center">
                                    <span className="font-bold">{isMe ? 'You' : msg.username}</span>
                                    <span className="ml-2 text-[10px]">{formatDate(msg.created_at || msg.createdAt)}</span>
                                </div>
                                <p className="text-white break-words text-sm mt-1">{msg.text}</p>
                            </div>
                            {user?.role === 'admin' && (
                                <button onClick={() => handleDeleteMessage(msg.id)} className="ml-2 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>
                                </button>
                            )}
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-700 flex items-center space-x-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-gray-700 p-2 rounded-lg text-white outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                />
                <button type="submit" className="bg-cyan-600 p-2 rounded-lg text-white hover:bg-cyan-700 disabled:opacity-50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                </button>
            </form>
        </div>
    );
}

export default GlobalChat;