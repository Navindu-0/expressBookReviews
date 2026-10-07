const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    // Check if the user already exists
    if (!isValid(username)) { 
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(400).json({message: "User already exists!"});
    }
  }
  return res.status(400).json({message: "Unable to register user. Username and password are required."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  // Use JSON.stringify to format the output neatly
  return res.status(200).send(JSON.stringify({books: books}, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let booksByAuthor = [];
  
  // Iterate through the books object
  for (let isbn in books) {
    if (books[isbn].author === author) {
      booksByAuthor.push({
        "isbn": isbn,
        "title": books[isbn].title,
        "reviews": books[isbn].reviews
      });
    }
  }
  return res.status(200).json({booksbyauthor: booksByAuthor});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let booksByTitle = [];
  
  // Iterate through the books object
  for (let isbn in books) {
    if (books[isbn].title === title) {
      booksByTitle.push({
        "isbn": isbn,
        "author": books[isbn].author,
        "reviews": books[isbn].reviews
      });
    }
  }
  return res.status(200).json({booksbytitle: booksByTitle});
});

// Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;

// ==========================================
// TASK 11: Async/Await and Promises with Axios
// ==========================================

// 1. Get all books using Async/Await
const getAllBooksAsync = async () => {
    try {
        const response = await axios.get('http://localhost:5000/');
        console.log("All Books:", response.data);
    } catch (error) {
        console.error("Error fetching all books:", error);
    }
};

// 2. Get book details by ISBN using Promises
const getBookByISBNPromise = (isbn) => {
    axios.get(`http://localhost:5000/isbn/${isbn}`)
        .then(response => {
            console.log(`Book with ISBN ${isbn}:`, response.data);
        })
        .catch(error => {
            console.error(`Error fetching book with ISBN ${isbn}:`, error);
        });
};

// 3. Get book details by Author using Async/Await
const getBookByAuthorAsync = async (author) => {
    try {
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        console.log(`Books by ${author}:`, response.data);
    } catch (error) {
        console.error(`Error fetching books by ${author}:`, error);
    }
};

// 4. Get book details by Title using Promises
const getBookByTitlePromise = (title) => {
    axios.get(`http://localhost:5000/title/${title}`)
        .then(response => {
            console.log(`Books with title ${title}:`, response.data);
        })
        .catch(error => {
            console.error(`Error fetching books with title ${title}:`, error);
        });
};