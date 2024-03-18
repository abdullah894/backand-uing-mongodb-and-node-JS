const express = require("express");
const bcrypt = require("bcryptjs");
const admin = require("../model/admin");
const session = require('express-session');
const flash = require('express-flash');
const User = require("../model/userDetails");
const jwt = require('jsonwebtoken');
const secretKey = 'yourSecretKey';
const cookie = require('cookie');

const login = (req, res) => {
    res.render('login');
  };
  
  const signup = (req, res) => {
    res.render('signup');
  };
  
  const userregisterion = async (req, res) => {
    // console.log("body =", req.body);
    try {
        const password = req.body.password;
      const confirmPassword = req.body.conformpassword; 
  
      if (password === confirmPassword) {
        const registerUser = new admin({
          Username: req.body.Username,
          email: req.body.Email,
        });
  

        const hashedPassword = await bcrypt.hash(password, 10);
        registerUser.password = hashedPassword;
        const registered = await registerUser.save();
        const token = jwt.sign({ userId: registered._id }, secretKey, { expiresIn: '1h' });
        // console.log("token is:",token);
        res.cookie("jwt", token);
        // console.log("cookie is:",cookie);
        res.status(201).render('login');
      } 
      else 
      { 
        errorMessage = 'Password and confirm password do not match';
            req.flash('error', errorMessage);
        res.redirect('/sign%20up');
      }
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  };

  module.exports = {
    login,
    signup,
    userregisterion,
  };
  
