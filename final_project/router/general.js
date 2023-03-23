const express = require('express');
const axios = require('axios').default;
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username=req.body.username
  const password=req.body.password

  if (username && password) {
    if (isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop (sequential code)
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books,null,4));
  });

  // Get book list (using async/await)
public_users.get('/books', async function (req, res) {
    await new Promise((resolve, reject)=>{
        resolve(res.send(books));
    })
    console.log("Task 10 successful")
  });

       
// Get book details based on ISBN (sequential code)
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn=req.params.isbn 
    res.send(books[isbn]);
  });
  
  // Get book details based on ISBN (using promise)
public_users.get('/books/isbn/:isbn',function (req, res) {
    const isbn=req.params.isbn 
    let get_book_isbn= new Promise((resolve, reject)=>{
        resolve(res.send(books[isbn]));
    })
    get_book_isbn.then(()=>{console.log("Task 11 successful")})
  });

// Get book details based on author (sequential code)
public_users.get('/author/:author',function (req, res) {
  const author=req.params.author

  for (book in books){
     
      if (books[book].author===author){
          res.send(books[book])
      }
  }
  return res.status(300).json({message: "Author not in list"});
});

//get  books based on author (using promise)
public_users.get('/books/author/:author',  (req, res)=> {
    const author = req.params.author
    let books_w_author = []
    let get_book_author = new Promise((resolve, reject)=> {
        for (book in books){
            if (books[book].author === author){
                books_w_author.push(books[book])
            }
        }
        resolve(res.status(200).send(books_w_author))
    })
    get_book_author.then(() => console.log("Task 12 successful"))
});


// Get all books based on title (sequential code)
public_users.get('/title/:title',function (req, res) {
    const title=req.params.title
    for (book in books){
      if (books[book].title===title){
          res.send(books[book])
      }
  }
  return res.status(300).json({message: "Title not in list"});
});

//get books based on title (using promise)
public_users.get('/books/title/:title', (req, res) =>{
    let title = req.params.title
    let books_w_title=[]
    let title_promise=new Promise((resolve, reject) =>{
        for (book in books){
            if (books[book].title===title){
                books_w_title.push(books[book])
            }
        }
        resolve(res.status(200).send(books_w_title))
    })
    title_promise.then(()=>console.log("Task 13 successful"))
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn
  let reviews={}
  if (isbn){
      reviews=books[isbn].reviews
  }
res.send(reviews);
});

module.exports.general = public_users;
