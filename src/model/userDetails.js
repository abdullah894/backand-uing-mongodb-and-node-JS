const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  Username: {
    type: String,
    required: true,
    unique: true,
  },
  FirstName: {
    type: String,
    required: true,
  },
  LastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  Birthday: {
    type: Date,
    required: true,
  },
  Gender: {
    type: String,
    required: true,
  },
  Nationality: {
    type: String,
    required: true,
  },
  UserImage: { 
    type: String, 
    required: true,
  },
  
});



const User = mongoose.model('User', UserSchema);
module.exports = User;

