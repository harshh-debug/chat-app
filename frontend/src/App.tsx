import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import CreateRoom from "./components/CreateRoom";
import Chat from "./pages/Chat";
import { Toaster } from "sonner";
import JoinRoom from "./components/JoinRoom";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateRoom />} />
        <Route path="/join" element={<JoinRoom/>} />
        <Route path="/chat/:roomId" element={<Chat />} />
      </Routes>
      <Toaster richColors position="top-right" />
    </>
  );
};

export default App;
