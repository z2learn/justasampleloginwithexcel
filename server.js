// server.js
const express = require("express");
const XLSX = require("xlsx");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// Ensure data directory exists
const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Create Excel file if it doesn't exist
const excelFile = path.join(dataDir, "users.xlsx");
if (!fs.existsSync(excelFile)) {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet([]);
  XLSX.utils.book_append_sheet(wb, ws, "Users");
  XLSX.writeFile(wb, excelFile);
}

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  try {
    const workbook = XLSX.readFile(excelFile);
    const sheet = workbook.Sheets["Users"];
    const users = XLSX.utils.sheet_to_json(sheet);

    // Check if user already exists
    if (users.some((user) => user.email === email)) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Add new user
    users.push({
      name,
      email,
      password, // In production, hash this password
      registrationDate: new Date().toLocaleDateString(),
    });

    const newSheet = XLSX.utils.json_to_sheet(users);
    workbook.Sheets["Users"] = newSheet;
    XLSX.writeFile(workbook, excelFile);

    res.json({ message: "Registration successful" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  try {
    const workbook = XLSX.readFile(excelFile);
    const sheet = workbook.Sheets["Users"];
    const users = XLSX.utils.sheet_to_json(sheet);

    const user = users.find(
      (u) => u.email === email && u.password === password
    );
    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
