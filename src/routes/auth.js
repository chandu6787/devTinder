const express=require("express");
const authRouter=express.Router();
const User=require("../models/user");
const bcrypt=require("bcrypt");
const {validateSignUpData}=require("../utils/validation")

authRouter.post("/login",async(req,res)=>
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
      res.cookie("token", token, {
  httpOnly: true,
  sameSite: "None",  // 👈 allows cross-domain
  secure: true,       // 👈 required with sameSite: None (needs HTTPS)
});
      res.status(200).send(user);
    }
    else{
      throw new Error("Invalid credentials");
    }



  }catch(err)
  {
    res.status(400).send(err.message);
  }
})
authRouter.post("/signup", async (req, res) => {
  

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
    res.send(user);
  } catch (err) {
    res.status(400).send("something went wrong in /signup " + err.message);
  }
});
authRouter.post("/logout",async(req,res)=>
{
    res.cookie("token",null,{expires:new Date(Date.now())});
    res.send("Logout Successful!!");

})

module.exports=authRouter;