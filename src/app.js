require("dotenv").config(); // go up one level to find .env
const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");
const {validateSignUpData}=require("./utils/validation")
const bcrypt=require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser=require("cookie-parser");
const {UserAuth}=require("./middlewares/auth");

app.use(express.json());
app.use(cookieParser())
app.post("/signup", async (req, res) => {
  

  try {
    validateSignUpData(req);
  const {password,firstName,lastName,emailId,gender}=req.body;
  const passwordHash=await bcrypt.hash(password,10);
  const user = new User({
    firstName,
    lastName,
    emailId,
    password:passwordHash,
    gender

  });
    await user.save();
    res.send("User saved successfully");
  } catch (err) {
    res.status(400).send("something went wrong in /signup " + err.message);
  }
});
app.post("/login",async(req,res)=>
{
  try{
    const {emailId,password}=req.body;
    const user=await User.findOne({emailId:emailId});
    if(!user)
    {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid=await user.validatePassword(password);
    if(isPasswordValid)
    {
      const token=await user.getJWT();
      res.cookie("token",token);
      res.send("Login Successful!!!");
    }
    else{
      throw new Error("Invalid credentials");
    }



  }catch(err)
  {
    res.status(400).send("ERROR : "+err.message);
  }
})
app.delete("/user", async (req, res) => {
  const userId = req.body._id;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("User deleted successfully"+ user);
  } catch (err) {
    res.status(400).send("something went wrong in /signup " + err.message);
  }
});
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data=req.body;
 
  try {
     const ALLOWED_UPDATES=["_id","photoUrl","about","gender","age","skills"]
  const isUpdateAllowed=Object.keys(data).every((k)=>ALLOWED_UPDATES.includes(k)) 
     if(!isUpdateAllowed)
  {
    res.status(400).send("Update not allowed!");
  }
  if(data?.skills.length>10)
  {
    throw new Error("Skills cannot be more than 10");
  }
    const user = await User.findByIdAndUpdate({_id:userId},data,{runValidators:true});
    res.send("User updated successfully");
  } catch (err) {
    res.status(400).send("something went wrong in /signup " + err.message);
  }
});
app.get("/profile",UserAuth,async(req,res)=>
{
 try
 {
   const user=req.user;
  res.send(user);

 }catch(err)
 {
   console.log("Something went wrong "+err.message)
 }
})
app.post("/sendConnectionRequest",UserAuth,async(req,res)=>
{
  try {
      res.send("Connection Request sent1");

  } catch (error) {
    console.log(error.message);
    
  }

})

connectDB()
  .then(() => {
    app.listen(3000, () => {
      console.log("Server is successfully listening on port 3000...");
    });
  })
  .catch((err) => {
    console.log("Database cannot be connected.", err);
  });
