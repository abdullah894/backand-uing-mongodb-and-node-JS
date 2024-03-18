 const mongoose = require("mongoose");
 const { Schema } = mongoose;

 const adminSchema = new Schema({
    Username :{
type:String,
required:true
    },
    email:{
        type:String,
        require:true,
        unique:[true, "email already present"],
    },
    password:{
        type:String,
        require:true,
    },
    confirmPassword:{
        type:String,
        require:true,
    },
    code:{
        type:String,
        require:false,
    }
 })


 const admin = new mongoose.model('admin',adminSchema);

 module.exports = admin;
