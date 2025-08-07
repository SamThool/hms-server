const express = require("express");
require("dotenv").config();
const cors = require("cors");
const connection = require("./config/config");
const routes = require("./routes");
const path = require("path");
const socketIO = require("socket.io");
const http = require("http");
const { initilizeSocket } = require("./utils/socket");
const app = express();
// const { like } = require("../src/public/images")

// ✅ Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // match frontend
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json({ limit: "50mb" }));
// app.options("*", cors());
app.use(express.urlencoded({ extended: true }));

// ✅ Static Files & Routes
app.use("/api", routes);
app.use("/api/images", express.static(path.join(__dirname, "public/images")));
console.log(
  "Serving static files from:",
  path.join(__dirname, "public/images")
);

// app.use(
//   "/api/images",
//   express.static(path.join(__dirname, "../src/public/images", "images"))
// );

// ✅ Create server from Express
const server = http.createServer(app);
initilizeSocket(server);
// ✅ Start Server
server.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("✅ Connected to Mongo Atlas" + process.env.db_url);
    console.log(`🚀 Server started on port ${process.env.port}`);
  } catch (err) {
    console.log("❌ MongoDB connection error:", err.message);
  }
});
