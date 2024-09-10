const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  // Check if the username exists in the users array
  return users.some((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
  // Check if the username and password match the one in records
  return users.some(
    (user) => user.username === username && user.password === password
  );
};

regd_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }
  if (isValid(username)) {
    return res.status(409).json({ message: "Username is already taken" });
  }
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

// Only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ username }, "access_token_secret", {
    expiresIn: "1h",
  });

  req.session.token = token;
  return res.status(200).json({ message: "Login successful", token });
});

regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;
  const username = req.user.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  books[isbn].reviews = books[isbn].reviews || {};
  books[isbn].reviews[username] = review;

  return res.status(200).json({ message: "Review added/updated successfully" });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const username = req.user.username;

  if (!books[isbn] || !books[isbn].reviews || !books[isbn].reviews[username]) {
    return res.status(404).json({ message: "Review not found" });
  }

  delete books[isbn].reviews[username];

  return res.status(200).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
