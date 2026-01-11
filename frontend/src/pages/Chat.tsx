import { useEffect, useRef, useState } from "react";
import { useParams, useLocation } from "react-router";
import { toast } from "sonner";
import { useNavigate } from "react-router";

type Message =
	| {
			type: "chat";
			payload: {
				username: string;
				message: string;
			};
	  }
	| {
			type: "system";
			payload: {
				message: string;
			};
	  };

const Chat = () => {
	const { roomId } = useParams();
	const location = useLocation();
	const username = location.state?.username;

	const [messages, setMessages] = useState<Message[]>([]);
	const wsRef = useRef<WebSocket | null>(null);
	const inputRef = useRef<HTMLInputElement | null>(null);
	const bottomRef = useRef<HTMLDivElement | null>(null);
	const navigate = useNavigate();

	const sendMessage = () => {
		if (!wsRef.current || !inputRef.current) return;
		if (!inputRef.current.value.trim()) return;

		wsRef.current.send(
			JSON.stringify({
				type: "chat",
				payload: {
					message: inputRef.current.value,
				},
			})
		);

		inputRef.current.value = "";
	};

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);
  
	useEffect(() => {
		if (!username) {
			navigate("/join");
		}
	}, [username, navigate]);

	useEffect(() => {
		if (!roomId || !username) return;

		const ws = new WebSocket("ws://localhost:8070");
		wsRef.current = ws;

		ws.onopen = () => {
			ws.send(
				JSON.stringify({
					type: "join",
					payload: { roomId, username },
				})
			);
		};

		ws.onmessage = (event) => {
			const data = JSON.parse(event.data);
			setMessages((prev) => [...prev, data]);
		};

		return () => {
			ws.close();
		};
	}, [roomId, username]);

	const copyRoomCode = async () => {
		if (!roomId) return;

		await navigator.clipboard.writeText(roomId);

		toast.success("Room code copied", {
			description: `Code ${roomId} copied to clipboard`,
			duration: 2000,
		});
	};

	return (
		<div className="h-screen bg-[#0b1220] text-white flex flex-col relative">
			<button
				onClick={copyRoomCode}
				className="absolute top-4 right-4 text-xs px-3 py-1.5 rounded-md 
                   bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
				title="Copy room code"
			>
				Copy room code
			</button>

			<div className="flex-1 overflow-y-auto px-6 py-6 space-y-3">
				{messages.map((msg, index) => {
					if (msg.type === "system") {
						return (
							<div key={index} className="text-center text-xs text-slate-400">
								{msg.payload.message}
							</div>
						);
					}

					const isMe = msg.payload.username === username;

					return (
						<div
							key={index}
							className={`flex ${isMe ? "justify-end" : "justify-start"}`}
						>
							<div
								className={`max-w-[65%] px-4 py-2 rounded-2xl text-sm ${
									isMe
										? "bg-purple-600 rounded-br-none"
										: "bg-slate-700 rounded-bl-none"
								}`}
							>
								{!isMe && (
									<div className="text-xs text-slate-300 mb-1">
										{msg.payload.username}
									</div>
								)}
								<div className="break-words">{msg.payload.message}</div>
							</div>
						</div>
					);
				})}
				<div ref={bottomRef} />
			</div>

			<div className="h-16 flex items-center gap-3 px-4 border-t border-slate-800">
				<input
					ref={inputRef}
					type="text"
					placeholder="Type a message..."
					onKeyDown={(e) => e.key === "Enter" && sendMessage()}
					className="flex-1 bg-slate-800 text-white px-4 py-2 rounded-lg 
                     outline-none placeholder-slate-400"
				/>
				<button
					onClick={sendMessage}
					className="px-5 py-2 rounded-lg bg-purple-600 
                     hover:bg-purple-500 transition"
				>
					Send
				</button>
			</div>
		</div>
	);
};

export default Chat;
