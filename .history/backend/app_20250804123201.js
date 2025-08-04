import express from "express";
import connectToDb from "./db/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import UserRoutes from "./routes/user.routes.js"
import Wor
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
connectToDb()

app.use("/api/user", UserRoutes);
app.get("/", (req, res) => {
    res.send("Hello World");
});

export default app;