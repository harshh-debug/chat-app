import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import CreateRoom from "./components/CreateRoom";
import JoinRoom from "./components/JoinRoom";

const App = () => {
	return (
		<Routes>
			<Route path="/" element={<Home></Home>}></Route>
			<Route path="/create" element={<CreateRoom></CreateRoom>}></Route>
			<Route path="/join" element={<JoinRoom></JoinRoom>}></Route>
		</Routes>
	);
};

export default App;
