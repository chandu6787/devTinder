const express=require("express");
const profileRouter=express.Router();
const {UserAuth}=require("../middlewares/auth");
const {validateEditProfileData}=require("../utils/validation")
const User = require("../models/user");  // ← add this


profileRouter.get("/profile/view",UserAuth,async(req,res)=>
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
profileRouter.delete("/user", UserAuth,async (req, res) => {
  const userId = req.body._id;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("User deleted successfully"+ user);
  } catch (err) {
    res.status(400).send("something went wrong in /signup " + err.message);
  }
});
profileRouter.patch("/profile/edit",UserAuth, async (req, res) => {

 
  try {
    console.log("req.body:", req.body);           // check what's coming in
    console.log("req.user:", req.user); 
    
     if(!validateEditProfileData(req))
     {
      throw new Error("Invalid Edit Request");
     }
     const loggedInUser=req.user;
     Object.keys(req.body).forEach((key)=>(loggedInUser[key]=req.body[key]));
     await loggedInUser.save();
     const data=loggedInUser.toObject();
  
   res.json({message:"Profile updated successfully",data:data});
  } catch (err) {
    res.status(400).send("something went wrong in /signup " + err.message);
  }
});


module.exports=profileRouter;