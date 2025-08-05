import express from "express";
import connectToDb from "./db/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import UserRoutes from "./routes/user.routes.js"
import ProjectRoutes from "./routes/project.routes.js";
import PromptRoutes from "./routes/prompt.routes.js";
// import Workspaceoutes from "./routes/workspace.routes.js";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(
    {
        origin: "http://localhost:5173",
        credentials: true
    }
));
app.use(cookieParser());
connectToDb()

app.use("/api/user", UserRoutes);

// app.use("/api/workspace", Workspaceoutes);
app.get("/", (req, res) => {
    res.send("Hello World");
});

export default app;