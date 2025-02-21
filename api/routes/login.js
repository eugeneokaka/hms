const express = require("express");

const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // Store securely in .env
const router = express.Router();

// Register Route
router.post("/register", async function (req, res) {
  const { email, password, firstname, lastname, role } = req.body;

  try {
    // Check if the email already exists
    if (!email || !password || !firstname || !lastname || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Email already in use." });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstname,
        lastname,
        role,
      },
    });

    // Generate a JWT token
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });

    // Set the token in an HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set to true in production for HTTPS
      maxAge: 3600000, // 1 hour expiration time
      sameSite: "strict", // CSRF protection
    });

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error creating user" });
  }
});

// Login Route
router.post("/login", async function (req, res) {
  const { email, password } = req.body;

  try {
    // Find the user by email
    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Compare the password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });

    // Set the token in an HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set to true in production for HTTPS
      maxAge: 3600000, // 1 hour expiration time
      sameSite: "strict", // CSRF protection
    });

    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Database error" });
  }
});

// Middleware to authenticate the JWT token
const authenticate = async function (req, res, next) {
  const token = req.cookies.token; // Get token from cookies

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = await jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Add decoded user info to the request
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

// Middleware for role-based authorization
const authorize = function (roles) {
  return function (req, res, next) {
    if (roles.indexOf(req.user.role) === -1) {
      return res.status(403).json({ error: "Access denied" });
    }
    next();
  };
};

// Example of a protected route (only accessible by ADMIN)
router.get("/admin", authenticate, authorize(["ADMIN"]), function (req, res) {
  return res.status(200).json({ message: "Welcome Admin!" });
});

module.exports = router;
