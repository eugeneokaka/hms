const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
const loginRouter = require("./routes/login");
// Simple route
app.use("/login", loginRouter);
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Start the server
app.listen(4000, () => {
  console.log(`Server running on port 4000`);
});
