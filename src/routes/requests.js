const express=require("express");
const requestRouter=express.Router();
const {UserAuth}=require("../middlewares/auth");
const User=require("../models/user")
const ConnectionRequest=require("../models/connectionRequests");

requestRouter.post("/request/send/:status/:userId",UserAuth,async(req,res)=>
{
  try {
      const fromUserId=req.user._id;
      const toUserId=req.params.userId;
      const status=req.params.status;
      const allowedStatus=["ignored","interested"];
      if(!allowedStatus.includes(status))
      {
        return res.status(400).json({message:"Invalid status type: "+  status })
      }
      const existingConnectionRequest=await ConnectionRequest.findOne(
        {
          $or:[{fromUserId,toUserId},{fromUserId:toUserId,toUserId:fromUserId}]
        }
      )
      const toUser=await User.findById(toUserId);
      if(!toUser)
      {
        return res.status(404).json({message:"User not found"});
      }
      if(existingConnectionRequest)
      {
        return res.status(400).send({message:"Connection Request Already Exists"});
      }
      const connectionRequest=new ConnectionRequest({
        fromUserId,
        toUserId,
        status
      })
      const data=await connectionRequest.save();
      res.json({
        message:req.user.firstName+" is "+status+" in "+toUser.firstName,
        data
      });

  } catch (error) {
  res.status(400).send(error.message);
    
  }

})
requestRouter.post("/request/review/:status/:requestId",UserAuth,async(req,res)=>
{
try {
  const loggedInUser=req.user;
const {status,requestId}=req.params;
const allowedStatus=["accepted","rejected"];
if(!allowedStatus.includes(status))
{
  return res.status(400).json({message:"status not allowed"});
}
const connectionRequest=await ConnectionRequest.findOne(
  {
    _id:requestId, 
    toUserId:loggedInUser._id,
    status:"interested"
  }
);
if(!connectionRequest)
{
  return res.status(404).json({message:"Connection request not found"});

}
  
connectionRequest.status=status;
const data=await connectionRequest.save();
res.json({message:"Connection request "+status,data}); 
} catch (error) {
  res.send(error.message);
}


})
module.exports=requestRouter;
