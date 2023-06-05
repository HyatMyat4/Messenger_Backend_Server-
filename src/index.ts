import express from "express";
import http from "http";
import bodyParser from "body-parser";
import compression from "compression";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import RootRoutes from "./routes/RootRoutes";
import { Server } from "socket.io";
import Auth_Routes from "./routes/Auth_Routes";
import User_Routes from "./routes/User_Routes";
import Search_Routes from "./routes/Search_Routes";
import Chats_Routes from "./routes/Chats_Routes";
import cookie_parser from "cookie-parser";
import crypto from "crypto";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
  transports: ["websocket"],
  allowEIO3: true,
});

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(cookie_parser());

//app.use(morgan("common"));

app.use(bodyParser.json());

let data = [] as any[];
io.on("connection", (socket) => {
  socket.on("sendMessage", (message: string) => {
    console.log("message :", message);
    data.push(message);
    io.emit("receiveMessage", data);
  });
});

const PORT = process.env.PORT || 4000;

app.use("/", RootRoutes);

app.use("/img", express.static(path.join(__dirname, "img")));

app.use("/", express.static(path.join(__dirname, "public")));

app.use("/User", User_Routes);

app.use("/Register", Auth_Routes);

app.use("/Search", Search_Routes);

app.use("/Chats", Chats_Routes);

app.all("*", (req: any, res: any) => {
  res.status(404);

  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});
/*
const refreshTokenSecret = crypto.randomBytes(64).toString('hex');
console.log(refreshTokenSecret);
*/
server.listen(PORT, () =>
  console.log(`Server running on Port : http://localhost:${PORT} 🔥🔥🚀🚀`)
);
