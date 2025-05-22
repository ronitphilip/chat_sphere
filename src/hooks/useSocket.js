import { useSocketContext } from "@/context/SocketContext";
import { useCallback, useEffect } from "react";

export const useSocket = (userId, events, currentChatId) => {
  const { socket } = useSocketContext();

  useEffect(() => {
    if (!socket || !userId) return;

    socket.emit("join", userId);

    if (events.onMessage) {
      socket.on("receive_message", (message) => {
        const receivedMessage = {
          ...message,
          timestamp: message.timestamp && !isNaN(new Date(message.timestamp))
            ? message.timestamp
            : new Date().toISOString(),
        };
        events.onMessage(receivedMessage);
      });
    }
    if (events.onTyping) {
      socket.on("user_typing", ({ senderId }) => {
        if (senderId === currentChatId) {
          events.onTyping(senderId);
        }
      });
    }
    if (events.onUserOnline) {
      socket.on("user_online", ({ userId }) => {
        events.onUserOnline(userId);
      });
    }
    if (events.onUserOffline) {
      socket.on("user_offline", ({ userId }) => {
        events.onUserOffline(userId);
      });
    }

    return () => {
      socket.off("receive_message");
      socket.off("user_typing");
      socket.off("user_online");
      socket.off("user_offline");
    };
  }, [ socket, userId, currentChatId, events.onMessage, events.onTyping, events.onUserOnline, events.onUserOffline, ]);

  const sendMessage = useCallback(
    (receiverId, message) => {
      if (socket && socket.connected) {
        socket.emit("send_message", {
          senderId: userId,
          receiverId,
          message,
          timestamp: new Date().toISOString(),
        });
      } else {
        console.error("Cannot send message: Socket not connected");
      }
    },
    [socket, userId],
  );

  const sendTyping = useCallback(
    (receiverId) => {
      if (socket && socket.connected) {
        socket.emit("typing", { senderId: userId, receiverId });
      } else {
        console.error("Cannot send typing: Socket not connected");
      }
    },
    [socket, userId],
  );

  return { sendMessage, sendTyping };
};