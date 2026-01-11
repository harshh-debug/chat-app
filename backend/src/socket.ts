import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import { activeRooms } from "./utils.js";

interface User {
	socket: WebSocket;
	room: string;
	username: string;
}

let userCount = 0;
let allsockets: User[] = [];

export function initWsServer(server: http.Server) {
	const wss = new WebSocketServer({ server });
	wss.on("connection", (socket) => {
		userCount++;
		socket.on("message", (message) => {
			//@ts-ignore
			const parsedMessage = JSON.parse(message);
			if (parsedMessage.type === "join") {
				const newUser = {
					socket,
					room: parsedMessage.payload.roomId,
					username: parsedMessage.payload.username,
				};

				allsockets.push(newUser);
				allsockets.forEach((user) => {
					if (user.room === newUser.room) {
						user.socket.send(
							JSON.stringify({
								type: "system",
								payload: {
									message: `${newUser.username} joined the room`,
								},
							})
						);
					}
				});
			}

			if (parsedMessage.type === "chat") {
				const sender = allsockets.find((x) => x.socket == socket);
				if (!sender) return;
				allsockets.forEach((user) => {
					if (user.room == sender.room) {
						user.socket.send(
							JSON.stringify({
								type: "chat",
								payload: {
									room: parsedMessage.payload.roomId,
									username: sender.username,
									message: parsedMessage.payload.message,
								},
							})
						);
					}
				});
			}
		});
		socket.on("close", () => {
			const leavingUser = allsockets.find((u) => u.socket === socket);
			if (!leavingUser) return;

			allsockets = allsockets.filter((u) => u.socket !== socket);

			allsockets.forEach((user) => {
				if (user.room === leavingUser.room) {
					user.socket.send(
						JSON.stringify({
							type: "system",
							payload: {
								message: `${leavingUser.username} left the room`,
							},
						})
					);
				}
			});
			const roomHasUsers = allsockets.some((u) => u.room === leavingUser.room);
			if(!roomHasUsers){
				activeRooms.delete(leavingUser.room)
			}
		});
	});
}
