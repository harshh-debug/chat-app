import { useEffect, useRef, useState } from "react";

function xyz() {
	const [messages, setMessages] = useState<string[]>(["hi there"]);
	const wsRef = useRef<WebSocket | null>(null);
	const inputRef = useRef<HTMLInputElement | null>(null);
	function sendMessage() {
		if (!wsRef.current || !inputRef.current) return;
		const mess = inputRef.current?.value;
		wsRef.current.send(
			JSON.stringify({
				type: "chat",
				payload: {
					message: mess,
				},
			})
		);
	}

	useEffect(() => {
		const ws = new WebSocket("ws://localhost:8070");
		wsRef.current = ws;
		ws.onmessage = (event) => {
			setMessages((m) => [...m, event.data]);
		};
		ws.onopen = () => {
			ws.send(
				JSON.stringify({
					type: "join",
					payload: {
						roomId: "red",
					},
				})
			);
		};
		return () => {
			ws.close();
		};
	}, []);

	return (
		<div className="h-screen bg-black ">
			<br />
			<br />
			<br />
			<div className="h-[80vh]">
				{messages.map((message,index) => (
					<div key={index} className="m-8">
						<span className="bg-white text-black rounded p-4 ">{message}</span>
					</div>
				))}
			</div>
			<div className="w-full h-[10vh] bg-white flex ">
				<input ref={inputRef} type="text" className="flex-1" />
				<button onClick={sendMessage} className="bg-purple-600 text-white p-4">
					Send Message
				</button>
			</div>
		</div>
	);
}

export default xyz;
