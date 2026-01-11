import cors from "cors";
import express from "express";
import { activeRooms, getCode } from "./utils.js";

const app = express();
app.use(cors())

app.use(express.json());


app.post("/create", (req, res) => {
	try {
		const { roomId, username } = req.body;
		if (activeRooms.has(roomId)) {
			return res.json({
				success: false,
				message: "Room Id already exists",
			});
		} else {
			activeRooms.add(roomId);
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
		if (activeRooms.has(code)) {
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
	if (activeRooms.has(roomId)) {
		return res.json({
			success: true,
			roomId: roomId,
			username: username,
		});
	} else {
		return res.json({
			success: false,
			message: "Room does not exist or has expired",
		});
	}
});
export default app;
