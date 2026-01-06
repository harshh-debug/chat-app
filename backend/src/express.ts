import express from "express";
import { getCode } from "./utils.js";

const app = express();

app.use(express.json());

let activeRooms: string[] = [];

app.post("/create", (req, res) => {
	try {
		const { roomId, username } = req.body;
		if (activeRooms.includes(roomId)) {
			return res.json({
				success: false,
				message: "Room Id already exists",
			});
		} else {
			activeRooms.push(roomId);
			return res.json({
				success: true,
				roomId: roomId,
				username: username
			});
		}
	} catch (error) {
        console.log(error)
        return res.json({
            success:false,
            message:"Error creating room"
        })
    }
});
app.get("/getCode", (req, res) => {
	try {
		let code = getCode();
		if (activeRooms.includes(code)) {
			code = getCode();
		}
		return res.status(200).json({
			success: true,
			roomId: code,
		});
	} catch (error) {
		console.log(error);
		return res.json({
			success: false,
			message: "Error creating room",
		});
	}
});
app.post("/join", (req, res) => {
	const { roomId, username } = req.body;
	if (activeRooms.includes(roomId)) {
		return res.json({
			success: true,
			roomId: roomId,
			username: username,
		});
	} else {
		return res.json({
			success: false,
			message: "Invalid room code",
		});
	}
});
export default app;
