const express = require("express");
const router = express.Router();
const controller = require('../controller/productController');
const login = require('../controller/login');
const session = require('express-session');
const multer = require('multer');

// GET REQUESTS or RENDERING PAGES.

router.get("/", controller.login); 
router.get("/sign%20up", controller.signup);
router.get("/dashbord", login.dashboard);
router.get("/Userdetails", login.AddUser);
router.get("/forgetPassword",login.forgetPasswordejsfile);
router.post("/forgetPassword",login.forgetPassword);

// POST REQUESTS or SAVING FORMS.
router.post("/register", controller.userregisterion); 
router.post("/AddingUser",login.upload.single('image'),login.addinguserdetails);
router.post("/dashbord", login.login );
router.post("/updateuser/:Username", login.updateuser);
router.get("/apiuser", login.apilogin );
router.post("/otpVerification",login.otpVerification);
router.post("/resetPassword",login.resetPassword);
// GET REQUESTS or SHOWING DATA.
router.get("/updateuser/:Username",login.getuser);
router.get('/deleteuser/:Username',login.deleteUser);
router.get('/viewuser/:Username',login.viewUser);
// show users using postman
router.get('/showUsers',login.showUsers);
module.exports = router;

