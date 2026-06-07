import { io, Socket } from "socket.io-client";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_WS_URL ||
  process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
  "http://localhost:3001";

export let socket: Socket | null = null;

export function getSocket(): Socket {
  if (socket && socket.connected) {
    return socket;
  }

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("access_token")
      : null;

  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ["websocket"],
    autoConnect: true,
  });

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
