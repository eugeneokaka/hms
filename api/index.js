const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
// Simple route

app.use(
  cors({
    origin: "http://localhost:3000", // Allow frontend origin only
    credentials: true, // Allow cookies
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed request types
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  })
);

// ✅ Manually handle preflight requests
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200); // Respond immediately to preflight
  }

  next();
});

app.use(express.json());
app.use(cookieParser());
const loginRouter = require("./routes/login");
app.use("/login", loginRouter);
app.get("/", (req, res) => {
  res.send("Hello, World!");
});
app.get("/auth/status", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ authenticated: false });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { firstname: true, email: true, id: true },
    });

    if (!user) {
      return res.status(401).json({ authenticated: false });
    }

    res.json({ authenticated: true, user });
  } catch (error) {
    console.error(error);
    res.status(401).json({ authenticated: false });
  }
});
// logout
app.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.json({ message: "Logged out successfully" });
});
// Start the server
app.listen(4000, () => {
  console.log(`Server running on port 4000`);
});
