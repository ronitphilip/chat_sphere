import { io } from 'socket.io-client';
import server_url from './serverURL';

let socket = null;

export const initializeSocket = () => {
  if (!socket) {
    socket = io(server_url, {
      autoConnect: false,
    });
    socket.connect();
  }
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};