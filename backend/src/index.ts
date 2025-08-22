import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import taskRoutes from "./routes/taskRoutes";
import { GoogleAuthController } from "./controllers/GoogleAuthController";

dotenv.config();
const app = express();


// app.use(cors({
//   origin: ["http://localhost:4200"],
//   credentials: true,
// }));
app.use(cors());
app.use(express.json());
// app.use(session({
//   name: "stm.sid",
//   secret: process.env.SESSION_SECRET || "dev_secret_change_me",
//   resave: false,
//   saveUninitialized: false,
// }));

// --- Task routes ---
app.use("/api/tasks", taskRoutes);

// --- Google auth routes ---
app.get("/api/google/auth/url", GoogleAuthController.getAuthUrl);
app.get("/api/google/oauth2callback", GoogleAuthController.handleOAuthCallback);
app.get("/api/google/auth/status", GoogleAuthController.authStatus);

const PORT = process.env['PORT'] || 3003;
app.listen(PORT, () => {
  console.log(`LangChain-powered Task Manager running on port ${PORT}`);
});
