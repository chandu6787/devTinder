require("dotenv").config(); // go up one level to find .env
const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");

app.use(express.json());
app.post("/signup", async (req, res) => {
  console.log("Hi");
  const user = new User(req.body);

  try {
    await user.save();
    res.send("User saved successfully");
  } catch (err) {
    res.status(400).send("something went wrong in /signup " + err.message);
  }
});
app.delete("/user", async (req, res) => {
  const userId = req.body._id;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("User deleted successfully"+ user);
  } catch (err) {
    res.status(400).send("something went wrong in /signup " + err.message);
  }
});
app.patch("/user", async (req, res) => {
  const userId = req.body._id;
  const data=req.body;
  const ALLOWED_UPDATES=["userId","photoUrl","about","gender","age","skills"]
  const isUpdateAllowed=Object.keys(data).every((k)=>ALLOWED_UPDATES.includes(k))
  try {
    const user = await User.findByIdAndUpdate({_id:userId},data,{runValidators:true});
    res.send("User updated successfully");
  } catch (err) {
    res.status(400).send("something went wrong in /signup " + err.message);
  }
});

connectDB()
  .then(() => {
    app.listen(3000, () => {
      console.log("Server is successfully listening on port 3000...");
    });
  })
  .catch((err) => {
    console.log("Database cannot be connected.", err);
  });
