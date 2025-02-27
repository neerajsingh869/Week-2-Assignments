/**
  You need to create a HTTP server in Node.js which will handle the logic of an authentication server.
  - Don't need to use any database to store the data.

  - Save the users and their signup/login data in an array in a variable
  - You can store the passwords in plain text (as is) in the variable for now

  The expected API endpoints are defined below,
  1. POST /signup - User Signup
    Description: Allows users to create an account. This should be stored in an array on the server, and a unique id should be generated for every new user that is added.
    Request Body: JSON object with username, password, firstName and lastName fields.
    Response: 201 Created if successful, or 400 Bad Request if the username already exists.
    Example: POST http://localhost:3000/signup

  2. POST /login - User Login
    Description: Gets user back their details like firstname, lastname and id
    Request Body: JSON object with username and password fields.
    Response: 200 OK with an authentication token in JSON format if successful, or 401 Unauthorized if the credentials are invalid.
    Example: POST http://localhost:3000/login

  3. GET /data - Fetch all user's names and ids from the server (Protected route)
    Description: Gets details of all users like firstname, lastname and id in an array format. Returned object should have a key called users which contains the list of all users with their email/firstname/lastname.
    The users username and password should be fetched from the headers and checked before the array is returned
    Response: 200 OK with the protected data in JSON format if the username and password in headers are valid, or 401 Unauthorized if the username and password are missing or invalid.
    Example: GET http://localhost:3000/data

  - For any other route not defined in the server return 404

  Testing the server - run `npm run test-authenticationServer` command in terminal
 */

const express = require("express")
const PORT = 3000;
const app = express();
const bodyParser = require('body-parser');
// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server

app.use(bodyParser.json());

let users = [];
/*
  1. POST /signup - User Signup
    Description: Allows users to create an account. This should be stored in an array on the server, and a unique id should be generated for every new user that is added.
    Request Body: JSON object with username, password, firstName and lastName fields.
    Response: 201 Created if successful, or 400 Bad Request if the username already exists.
    Example: POST http://localhost:3000/signup
*/
app.post("/signup", function(req, res){
  let userInput = req.body;
  let isUserPresent = false;
  for(let user of users){
    if(user.username === userInput.username){
      isUserPresent = true;
      break;
    }
  }
  if(isUserPresent){
    res.status(400).send("Username already exists");
  }
  else{
    userInput.id = Date.now();
    users.push(userInput);
    res.status(201).send("Signup successful");
  }
});

/*
  2. POST /login - User Login
    Description: Gets user back their details like firstname, lastname and id
    Request Body: JSON object with username and password fields.
    Response: 200 OK with an authentication token in JSON format if successful, or 401 Unauthorized if the credentials are invalid.
    Example: POST http://localhost:3000/login
*/
app.post("/login", function(req, res){
  let userInput = req.body;
  let isUserAuthorized = false;
  let userData = null;
  for(let user of users){
    if(user.username === userInput.username && user.password === userInput.password){
      isUserAuthorized = true;
      userData = user;
      break;
    }
  }
  if(isUserAuthorized){
    res.status(200).send(userData);;
  }
  else{
    res.status("401").send("Unauthorized");
  }
});

/*
  3. GET /data - Fetch all user's names and ids from the server (Protected route)
    Description: Gets details of all users like firstname, lastname and id in an array format. Returned object should have a key called users which contains the list of all users with their email/firstname/lastname.
    The users username and password should be fetched from the headers and checked before the array is returned
    Response: 200 OK with the protected data in JSON format if the username and password in headers are valid, or 401 Unauthorized if the username and password are missing or invalid.
    Example: GET http://localhost:3000/data

*/
app.get("/data", function(req, res){
  let userNameInput = req.headers.username;
  let userPwdInput = req.headers.password;
  let isUserAuthorized = false;
  for(let user of users){
    if(user.username === userNameInput && user.password === userPwdInput){
      isUserAuthorized = true;
      break;
    }
  }
  if(isUserAuthorized){
    let response = {
      users: users
    }
    res.status("200").send(response);
  }
  else{
    res.status("401").send("Unauthorized");
  }
});

// for any other route, just return 404 status and Not Found text
app.use((req, res, next) => {
  res.status(404).send("Route not found");
});

// Used listen method for testing purpose
// app.listen(PORT, () => {
//   console.log(`Example app listening on port ${PORT}`)
// })

module.exports = app;
