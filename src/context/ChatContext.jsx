import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export function useChat() {
    return useContext(ChatContext);
}

export function ChatProvider({ children }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);
    const { user } = useAuth();

    const toggleChat = () => setIsOpen(prev => !prev);
    const openChat = () => setIsOpen(true);
    const closeChat = () => setIsOpen(false);

    useEffect(() => {
        // If no user, disconnect if connected
        if (!user) {
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
            return;
        }

        // Prevent multiple connections
        if (socket && socket.connected) return;

        console.log("Initializing socket connection...");
        const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        // Ensure we strip /api if it exists in VITE_API_URL, usually socket connects to root
        // But assuming defaults for now.
        const newSocket = io(SOCKET_URL.replace('/api', ''), {
            transports: ['websocket', 'polling']
        });

        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('✅ Connected to chat socket');
            newSocket.emit('joinChat');
        });

        newSocket.on('chatHistory', (history) => {
            setMessages(history);
        });

        newSocket.on('chatMessage', (msg) => {
            setMessages(prev => [...prev, msg]);
        });

        newSocket.on('messageDeleted', (id) => {
            setMessages(prev => prev.filter(m => m.id !== id));
        });

        newSocket.on('chatCleared', () => {
            setMessages([]);
        });

        newSocket.on('connect_error', (err) => {
            console.error("Socket connection error:", err);
        });

        return () => {
            newSocket.disconnect();
        };
    }, [user?.id]);

    const sendMessage = (text) => {
        if (socket && user) {
            socket.emit('chatMessage', {
                text,
                username: user.username || user.name,
                userId: user.id
            });
        } else {
            console.warn("Cannot send message: Socket not connected or user missing");
        }
    };

    const deleteMessage = (id) => {
        if (socket) socket.emit('deleteMessage', id);
    };

    const clearChat = () => {
        if (socket) socket.emit('clearChat');
    };

    return (
        <ChatContext.Provider value={{ isOpen, setIsOpen, toggleChat, openChat, closeChat, messages, sendMessage, deleteMessage, clearChat, socket }}>
            {children}
        </ChatContext.Provider>
    );
}
