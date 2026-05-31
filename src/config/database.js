const mongoose = require("mongoose");
const connectDB = async () => {
  return await mongoose.connect(process.env.mongodb_connection_string);
};

module.exports=connectDB;