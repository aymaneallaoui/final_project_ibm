const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Get the book list available in the shop
public_users.use("/register", (req, res, next) => {
  req.url = "/customer/register"; // Change the request URL
  next(); // Continue to the next middleware/route handler
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  console.log(req.params.isbn);
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  const bookList = Object.values(books).filter(
    (book) => book.author === author
  );
  if (bookList.length > 0) {
    return res.status(200).json(bookList);
  } else {
    return res.status(404).json({ message: "No books found by this author" });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  const bookList = Object.values(books).filter((book) => book.title === title);
  if (bookList.length > 0) {
    return res.status(200).json(bookList);
  } else {
    return res.status(404).json({ message: "No books found with this title" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "No reviews found for this book" });
  }
});

module.exports.general = public_users;
