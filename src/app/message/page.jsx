"use client";

import React, { useState, useEffect } from "react";
import { MoreVertical } from "lucide-react";
import SideBar from "@/components/SideBar";
import { useSocket } from "@/hooks/useSocket";
import { fetchMessagesAPI } from "@/services/allAPI";
import { useSocketContext } from "@/context/SocketContext";
import Welcome from "@/components/Welcome";

export default function Message() {
    const [user, setUser] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [onlineStatus, setOnlineStatus] = useState(false);
    const { isConnected } = useSocketContext();

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedUser = sessionStorage.getItem("user");
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        }
    }, []);

    useEffect(() => {
        if (!user?.id || !selectedUser?.id) {
            setMessages([]);
            return;
        }

        const fetchMessages = async () => {
            try {
                const reqBody = {
                    user1: user.id,
                    user2: selectedUser.id,
                };
                const result = await fetchMessagesAPI(reqBody);
                console.log(result.data);

                if (result.status === 200) {
                    setMessages(result.data || []);
                } else {
                    console.log("Fetch messages failed:", result);
                }
            } catch (err) {
                console.error("Fetch messages error:", err);
            }
        };

        fetchMessages();
    }, [selectedUser?.id, user?.id]);

    const { sendMessage, sendTyping } = useSocket(
        user?.id,
        {
            onMessage: (message) => {
                if (message.senderId === selectedUser?.id) {
                    setMessages((prev) => [message, ...prev]);
                }
            },
            onTyping: (senderId) => {
                if (senderId === selectedUser?.id) {
                    setIsTyping(true);
                    setTimeout(() => setIsTyping(false), 3000);
                }
            },
            onUserOnline: (userId) => {
                if (userId === selectedUser?.id) {
                    setOnlineStatus(true);
                }
            },
            onUserOffline: (userId) => {
                if (userId === selectedUser?.id) {
                    setOnlineStatus(false);
                }
            },
        },
        selectedUser?.id
    );

    const handleSendMessage = () => {
        if (!newMessage.trim() || !selectedUser?.id || !user?.id) return;

        const messageData = {
            senderId: user.id,
            receiverId: selectedUser.id,
            message: newMessage,
            timestamp: new Date().toISOString(),
        };

        sendMessage(selectedUser.id, newMessage);
        setMessages((prev) => [messageData, ...prev]);
        setNewMessage("");
    };

    const handleTyping = () => {
        if (selectedUser?.id && user?.id) {
            sendTyping(selectedUser.id);
        }
    };

    if (!user) {
        return <div className="p-4">Please log in to continue</div>;
    }

    return (
        <div className="grid grid-cols-4 h-screen bg-gray-50">
            <SideBar setSelectedUser={setSelectedUser} selectedUser={selectedUser} />
            {selectedUser ? (
                <div className="col-span-3 flex flex-col justify-between">
                    <div className="flex items-center justify-between py-4 px-6 border-b-2 border-gray-100 bg-white shadow-sm">
                        <div className="flex items-center">
                            <div className="relative">
                                <div className="h-10 w-10 rounded-full flex items-center justify-center font-extrabold text-white bg-gradient-to-br from-purple-500 to-indigo-500 me-3 transition-transform hover:scale-105">
                                    {selectedUser?.name?.[0]?.toUpperCase() || "U"}
                                </div>
                                <span
                                    className={`absolute top-6 left-7 h-4 w-4 rounded-full border-2 border-white ${onlineStatus ? "bg-green-500" : "bg-red-500"
                                        }`}
                                ></span>
                            </div>
                            <div>
                                <h1 className="text-gray-800 font-medium">{selectedUser?.name || "Select a User"}</h1>
                                {isTyping && selectedUser && (
                                    <p className="text-gray-500 text-sm">Typing...</p>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`text-sm ${isConnected ? "text-green-500" : "text-red-500"}`}>
                                {isConnected ? "Connected" : "Disconnected"}
                            </span>
                            <MoreVertical className="text-gray-300 cursor-pointer" />
                        </div>
                    </div>

                    <div
                        className="flex flex-col-reverse overflow-y-auto px-7 py-4 bg-gradient-to-b from-gray-50 to-gray-100"
                        style={{ height: "calc(100vh - 160px)" }}
                    >
                        {messages.length === 0 && (
                            <p className="text-gray-500 text-center mb-70">Start the conversation!</p>
                        )}
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.senderId === user.id || msg.sender_id === user.id ? "justify-end" : "justify-start"
                                    } mb-4`}
                            >
                                <div
                                    className={`max-w-md rounded-2xl p-4 shadow-sm relative ${msg.senderId === user.id || msg.sender_id === user.id
                                            ? "bg-blue-600 text-white rounded-br-none"
                                            : "bg-white text-gray-800 rounded-bl-none border border-gray-200"
                                        }`}
                                    style={{ wordBreak: "break-word" }}
                                >
                                    <p className="text-sm">{msg.message}</p>
                                    <span className="text-xs opacity-75 block mt-1 text-right">
                                        {new Date(msg.timestamp).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                    <div
                                        className={`absolute bottom-0 ${msg.senderId === user.id || msg.sender_id === user.id ? "right-0" : "left-0"
                                            } w-3 h-3 ${msg.senderId === user.id || msg.sender_id === user.id
                                                ? "bg-blue-600"
                                                : "bg-white border-b border-r border-gray-200"
                                            }`}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="w-full flex gap-2 py-4 px-7 bg-white border-t border-gray-100">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => {
                                handleTyping();
                                if (e.key === "Enter") handleSendMessage();
                            }}
                            placeholder="Type a message..."
                            className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition-colors"
                            disabled={!selectedUser || !isConnected}
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim() || !selectedUser || !isConnected}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                        >
                            Send
                        </button>
                    </div>
                </div>
            ) : (
                <div className="col-span-3">
                    <Welcome />
                </div>
            )}
        </div>
    );
}