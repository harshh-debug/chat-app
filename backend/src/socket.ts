import http from "http";
import { WebSocketServer, WebSocket } from "ws";

interface User {
	socket: WebSocket;
	room: string;
}

let userCount = 0;
let allsockets: User[] = [];

export function initWsServer(server: http.Server) {
	const wss = new WebSocketServer({ server });
	wss.on("connection", (socket) => {
		userCount++;

		console.log("user connected #" + userCount);
		socket.on("message", (message) => {
			//@ts-ignore
			const parsedMessage = JSON.parse(message);
			if (parsedMessage.type === "join") {
				allsockets.push({
					socket,
					room: parsedMessage.payload.roomId,
				});
			}
			if (parsedMessage.type === "chat") {
				const currentUserRoom = allsockets.find(
					(x) => x.socket == socket
				)?.room;
				if (!currentUserRoom) return;
				allsockets.forEach((user) => {
					if (user.room == currentUserRoom) {
						user.socket.send(parsedMessage.payload.message);
					}
				});
			}
		});
		socket.on("close", () => {
			allsockets = allsockets.filter((u) => u.socket !== socket);
		});
	});
}
