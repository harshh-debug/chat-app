import { useEffect, useRef, useState } from "react";
import { useParams, useLocation } from "react-router";

const Chat = () => {
  const { roomId } = useParams();
  const location = useLocation();
  const username = location.state?.username;

  const [messages, setMessages] = useState<string[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  function sendMessage() {
    if (!wsRef.current || !inputRef.current) return;

    wsRef.current.send(
      JSON.stringify({
        type: "chat",
        payload: {
          message: inputRef.current.value,
        },
      })
    );

    inputRef.current.value = "";
  }

  useEffect(() => {
    if (!roomId) return;

    const ws = new WebSocket("ws://localhost:8070");
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          payload: {
            roomId,
          },
        })
      );
    };

    ws.onmessage = (event) => {
      setMessages((m) => [...m, event.data]);
    };

    return () => {
      ws.close();
    };
  }, [roomId]);

  return (
    <div className="h-screen bg-black text-white">
      <div className="h-[80vh] p-6 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className="mb-4">
            <span className="bg-white text-black p-3 rounded">
              {msg}
            </span>
          </div>
        ))}
      </div>

      <div className="h-[10vh] flex bg-white p-2">
        <input
          ref={inputRef}
          type="text"
          className="flex-1 border px-3 text-black"
        />
        <button
          onClick={sendMessage}
          className="bg-purple-600 text-white px-6 ml-2"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
