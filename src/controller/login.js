const express = require("express");
const bcrypt = require("bcryptjs");
const admin = require("../model/admin");
const User = require("../model/userDetails");
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const secretKey = 'yourSecretKey';
var nodemailer = require('nodemailer');
const cookie = require('cookie');

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, options);
};

const storage = multer.diskStorage({
  destination: (req,file, cb) => {
    cb(null, './public/uploads')
  },

  filename: (req, file ,cb) => {
    // console.log(file)
    cb(null, Date.now()+ path.extname(file.originalname));
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    const filePath = '' + uniqueSuffix + fileExtension;

    req.filepath = filePath;

    cb(null, uniqueSuffix + fileExtension);

  }
});

const dashboardView = async (res, items, formatDate, currentPage, totalPages) => {
  const itemsPerPage = 10; 
// console.log("currentPage=",currentPage);
 try {
    const totalItems = await User.countDocuments();
   const totalPages = Math.ceil(totalItems / itemsPerPage);
    currentPage = parseInt(currentPage) || 1;
    const skipItems = (currentPage - 1) * itemsPerPage;
    const itemsList = await User.find()
      .skip(skipItems)
      .limit(itemsPerPage);

    res.render('dashboard', { items: itemsList, formatDate, currentPage, totalPages });
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const dashboard = (req, res) => {
  const currentPage = req.query.page;
  User.find()
    .then((items) => {
      dashboardView(res, items, formatDate,currentPage);
    })
    .catch((err) => {
      console.error('Error fetching data:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    });
};


const login = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await admin.findOne({ email: email });

    if (!user) {
      return res.status(404).send("User not found");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '2s' });
      console.log("token is:",token);
      res.cookie("jwt", token, { maxAge: 2000, httpOnly: true });
        console.log("cookie is:",cookie);
      const items = await User.find();
      dashboardView(res, items, formatDate);
    } else {
      return res.status(401).send("Invalid password");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const AddUser = (req, res) => {
  res.render('userRegestration');
}; 

const addinguserdetails = async (req,res) => {
  try
  {
    const adddetails =new User({
      Username :req.body.Username,
      FirstName :req.body.FirstName,
      LastName :req.body.LastName,
      email :req.body.Email,
      Birthday :req.body.Birthday,
      Gender :req.body.gender,
      Nationality :req.body.nationality,
      UserImage: req.filepath,
    });
    

    const addeddetails =await adddetails.save();
    
    const items = await User.find();
    dashboardView(res, items, formatDate);
} catch (error) {
  console.log(error);
  res.status(400).send(error);
}
};

const getuser = async (req, res) => {
  try {
      const user = await User.findOne({ Username: req.params.Username });
      if (!user) {  
          return res.status(404).send('User not found');
      }
      res.render('updateUser', { user });
  } catch (err) {
      console.error(err);
      res.status(500).send('Error retrieving user');
  }
};

const updateuser = async (req, res) => {
  try {
      const username = req.params.Username;
      const { Username, FirstName, LastName, email, Birthday, Gender, Nationality } = req.body;

      const updatedUser = await User.findOneAndUpdate(
          { Username: username }, 
          { ...req.body },
      );
      const updated  = await updatedUser.save();

      const items = await User.find();
      dashboardView(res, items, formatDate);
     
      if (!updatedUser) {
          return res.status(404).send('User not found');
      }
  } catch (err) {
      console.error(err);
      res.status(500).send('Error updating user');
  }
};

const deleteUser = async (req, res) => {
  try {
    const username = req.params.Username;
    const deletedUser = await User.findOneAndRemove({ Username: username });
    const items = await User.find();
    dashboardView(res, items, formatDate);
    if (!deletedUser) {
      return res.status(404).send('User not found');
    }
    
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting user');
  }
};
const viewUser = async (req, res) => {
  const username = req.params.Username;

  try {

    const user = await User.findOne({ Username: username });
    // console.log("user=",user );
    if (!user) {
    return res.status(404).send('User not found');
}
res.render('viewsUserdetails', { user, formatDate });

  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching user data');
  }
};
// login using postman
const apilogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await admin.findOne({ email: email });

    if (!user) {
      return res.status(404).send("User not found");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {

      const items = await User.find();
      const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });
      // Create a JSON object containing the user data and token
      const response = {
        user: {
          Username: user.Username,
          email: user.email,
          // Add other user properties here if needed
        },
        token: token,
      };

      // Send the JSON response
      res.status(201).json(response);
      
      // console.log("token =", token);
    } else {
      return res.status(401).send("Invalid password");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

  // show users using postman
  const showUsers = async (req, res) => {
    const token = req.header('Authorization');
    // Check if the token exists
    if (!token) {
      return res.status(401).json({ error: 'Access denied. Token not provided.' });
    }

const decoded = jwt.decode(token)

  try {
    // Verify the token with the correct secret key
    const verify = jwt.verify(token, 'yourSecretKey'); 

    // Check if the user exists (assuming email is the user identifier)
    const user = await User.findOne({ email: decoded.email });
    
    // You can now fetch and return all users
    const users = await User.find();
    res.json(users);
  } 
  catch (error) {
    console.error(error);

    // Handle token verification errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token.' });
    }

    // Handle expired token
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token has expired.' });
    }

    res.status(500).json({ error: 'Internal Server Error' });
  }
  };

const upload = multer ({storage: storage})
// forgetPasswordEJSFILE
const forgetPasswordejsfile = (req,res) => {
res.render('forgetPassword');
}
// Post
const forgetPassword = async (req,res) => {
  const { email } =req.body;
  try
  {
    const matchOlduser = await admin.findOne({ email });
    if(!matchOlduser) {
      return res.json({alert:"User Not Exists!"});
    }
    const otpCode = Math.floor((Math.random()*10000)+1);
    const otpData = await admin.findOneAndUpdate({
      email:req.body.email,
      code:otpCode,
    })
    var transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "9f93a806ca5efd",
        pass: "f3d0897940c3d8"
      },
      secure: false,
      tls: {
        ciphers:'SSLv3'
    }
    });
    
    var mailOptions = {
      from: 'info@mailtrap.club',
      to: "abdullahlatif243@gmail.com",
      subject: 'Passoword Reset',
      text: `Your OTP code is: ${otpCode}`,
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    res.render("otp");
} 
catch (error){
  console.log(error);
}
};
const otpVerification = async (req, res) => {
  
  try {
    console.log("Request body:", req.body);
    const otp = req.body.otp.map(item => item.toString()).join('');
    const data = await admin.findOne({ code: otp }); 
    // console.log("otp =", otp);
    if (data) {
      res.render("resetPassword");
      const deleteOtp = await admin.updateOne({ $unset: { code: ""}}); 
    } else {
      res.send("Otp did not Match");
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error"); 
  }
};


const resetPassword = async (req, res) => {
  try {
    const { password, confirmpassword, email } = req.body; 
    // console.log(req.body);

    const matchOlduser = await admin.findOne({ email });

    if (!matchOlduser) {
      return res.send("User Not Exists!");
    }

    if (password === confirmpassword) {
      const hashedPassword = await bcrypt.hash(password, 10);

      await admin.findOneAndUpdate({ email: email }, { password: hashedPassword }); 

      res.render("login");
    } else {
      res.send("Password and Confirm Password do not match");
    }
  } catch (error) {
    res.send("Error");
    console.log(error);
  }
};





module.exports = {
  login,
  dashboard,
  AddUser,
  addinguserdetails,
  getuser,
    updateuser,
    deleteUser,
    viewUser,
    upload,
    apilogin,
    showUsers,
    forgetPassword,
    forgetPasswordejsfile,
    otpVerification,
    resetPassword
};



