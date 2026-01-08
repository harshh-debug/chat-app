import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import CreateRoom from "./components/CreateRoom";
import JoinRoom from "./components/JoinRoom";
import Chat from "./pages/Chat";

const App = () => {
	return (
		<Routes>
			<Route path="/" element={<Home></Home>}></Route>
			<Route path="/create" element={<CreateRoom></CreateRoom>}></Route>
			<Route path="/join" element={<JoinRoom></JoinRoom>}></Route>
			<Route path="/chat/:roomId" element={<Chat></Chat>}></Route>
		</Routes>
	);
};

export default App;
