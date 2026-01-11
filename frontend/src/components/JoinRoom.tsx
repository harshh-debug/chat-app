import { useState } from "react";
import { Button } from "./ui/button";
import axiosClient from "@/utils/api";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const JoinRoom = () => {
	const navigate = useNavigate();
	const [username, setUsername] = useState("");
	const [roomCode, setRoomCode] = useState("");
	const [loading2, setLoading2] = useState(false);

	const joinRoom = async () => {
		if (!username || !roomCode) {
			toast.error("Missing details", {
				description: "Username and room code are required",
			});
			return;
		}

		try {
			setLoading2(true);
			const response = await axiosClient.post("/join", {
				username,
				roomId: roomCode,
			});

			if (response.data.success) {
				toast.success("Joined room");
				navigate(`/chat/${roomCode}`, {
					state: { username },
				});
			} else {
				toast.error("Unable to join room", {
					description: response.data.message,
				});
			}
		} catch (error) {
			console.error(error);
			toast.error("Something went wrong", {
				description: "Please try again",
			});
		} finally {
			setLoading2(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center">
			<div className="h-[75vh] w-[40vw] border-4 rounded-2xl border-dotted p-8">
				<h1 className="text-center text-3xl mb-10">Join Room</h1>

				<div className="mb-6">
					<input
						type="text"
						placeholder="Username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						className="w-full p-3 border rounded-lg"
					/>
				</div>

				<div className="mb-8">
					<input
						type="text"
						placeholder="Room Code"
						value={roomCode}
						onChange={(e) => setRoomCode(e.target.value)}
						className="w-full h-12 px-3 border rounded-lg"
					/>
				</div>

				<div className="flex justify-center">
					<Button
						className="px-10 py-6 text-lg mt-10"
						onClick={joinRoom}
						disabled={loading2}
					>
						Join
					</Button>
				</div>
			</div>
		</div>
	);
};

export default JoinRoom;
