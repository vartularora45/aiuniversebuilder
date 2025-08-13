import app from "./app.js";
import http from "http";
import dotenv from "dotenv";
dotenv.config();


const server = http.createServer(app);
const PORT = process.env.PORT ;
console.log(PORT)
server.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});