import http from "http"
import app from "./express.js"
import { initWsServer } from "./socket.js";

const server=http.createServer(app)

initWsServer(server);

server.listen(8070,()=>{
    console.log("Server is listening at 8070")
})
