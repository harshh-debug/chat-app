import { useState } from "react";
import { Button } from "./ui/button";
import axiosClient from "@/utils/api";

const CreateRoom = () => {
	const [username, setUsername] = useState("");
	const [roomCode, setRoomCode] = useState("");
	const [loading, setLoading] = useState(false);
	const [loading2, setLoading2] = useState(false);

	const generateCode = async () => {
		try {
			setLoading(true);
			const code = await axiosClient.get("/getCode");
			setRoomCode(code.data.roomId);
			console.log(code);
		} catch (error) {
			console.log("Error getting code" + error);
		} finally {
			setLoading(false);
		}
	};

	const createRoom = async () => {
		if (!username || !roomCode) {
			alert("Username and room-code are required");
			return;
		}
		try {
			setLoading2(true);
			const response = await axiosClient.post("/create", {
				username,
				roomId: roomCode,
			});
			if (response.data.success) {
				console.log("Room created", response.data);
			} else {
				alert(response.data.message);
			}
		} catch (error) {
			console.log("Error creating room", error);
		}
    finally{
      setLoading2(false)
    }
	};
	return (
		<div className="min-h-screen flex items-center justify-center">
			<div className="h-[75vh] w-[40vw] border-4 rounded-2xl border-dotted p-8">
				<div>
					<h1 className="text-center text-3xl mb-10">Create Room</h1>
				</div>

				<div className="mb-6">
					<input
						type="text"
						placeholder="Username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						className="w-full p-3 border rounded-lg"
					/>
				</div>

				<div className="flex mb-8 gap-3">
					<input
						type="text"
						placeholder="Room Code"
						value={roomCode}
						readOnly
						className="w-[80%] h-12 px-3 border rounded-lg bg-slate-100"
					/>
					<Button
						className="w-[20%] h-11"
						disabled={loading}
						onClick={generateCode}
					>
						{loading ? "..." : "Generate Code"}
					</Button>
				</div>
				<div className="flex justify-center">
					<Button
						className="px-10 py-6 text-lg"
						onClick={createRoom}
						disabled={loading2}
					>
						Create Room
					</Button>
				</div>
			</div>
		</div>
	);
};

export default CreateRoom;
