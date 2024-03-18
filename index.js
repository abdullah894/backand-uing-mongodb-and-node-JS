const express = require("express");
const mongoose =require("mongoose");
const ejs = require("ejs");
const admin = require("./src/model/admin");
const router = require("./src/routes/routes");
const User = require("./src/model/userDetails");
const flash = require('express-flash');
const session = require('express-session');
require("./src/db/connect");
const multer = require('multer');
const path = require('path');
const jwt = require("jsonwebtoken");

const app = express();
const port = process.env.PORT || 4000;

app.use(flash());
app.use(express.static(__dirname + '/public')); 
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
}));


const Item = mongoose.model('Item', {
  name: String,
  description: String,
});






app.use('/', router);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


