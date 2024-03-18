const User = require("../model/userDetails");
const mongoose = require("mongoose");
const { faker } = require('@faker-js/faker');
require("../db/connect");

async function seedDatabase() {
  try {

    const newDummyUsers = [];

    for (let i = 0; i < 100; i++) {
      newDummyUsers.push({
        Username: faker.internet.userName(),
        FirstName: faker.person.firstName(),
        LastName: faker.person.lastName(),
        email: faker.internet.email(),
        Birthday: faker.defaultRefDate(),
        Gender: faker.person.gender(),
        Nationality: faker.location.country(),
        UserImage: faker.image.avatar(),
      });
    }

    await User.insertMany(newDummyUsers);

    console.log("DONE!");
  } catch (err) {
    console.error("Error saving users:", err);

    if (err.code === 11000) {
      console.error("Duplicate key error. Make sure there are no duplicate records.");
    }
  } finally {
    mongoose.disconnect();
  }
}

seedDatabase();

