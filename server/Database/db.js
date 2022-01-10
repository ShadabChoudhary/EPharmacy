const mongoose = require("mongoose");

const Connectdb = async (username, password) => {
  const DB_URL =
    process.env.DATABSE_URL ||
    `mongodb+srv://${username}:${password}@ecommerceweb.lk1sw.mongodb.net/test`;

  try {
    await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected successfully");
  } catch (err) {
    console.log(err);
  }
};

module.exports = Connectdb;
