const express=require("express");
const userRouter=express.Router();
const {UserAuth}=require("../middlewares/auth");
const User=require("../models/user");
const ConnectionRequest=require("../models/connectionRequests");

const USER_SAFE_DATA="firstName lastName photoUrl age gender about skills"

userRouter.get("/user/requests/received",UserAuth,async(req,res)=>
{
    try {
        const loggedInUser=req.user;
        const connectionRequests=await ConnectionRequest.find({
            toUserId:loggedInUser._id,
            status:"interested"
        }).populate("fromUserId",USER_SAFE_DATA)
        res.send(connectionRequests);
        
        
    } catch (error) {
        res.send(error.message);
    }

})
userRouter.get("/user/connections",UserAuth,async (req,res)=>
{
    try {
        const loggedInUser=req.user;
        const connections=await ConnectionRequest.find({
            $or:[{toUserId:loggedInUser._id,status:"accepted"},{fromUserId:loggedInUser._id,status:"accepted"}]
        }).populate("fromUserId",USER_SAFE_DATA).populate("toUserId",USER_SAFE_DATA);
        const data=connections.map((item)=>{
            if(item.fromUserId._id.toString()===loggedInUser._id.toString())
            {
                return item.toUserId;
            }
            return item.fromUserId;
        });
    

        res.json(data);

    } catch (error) {
        res.send(error.message);
        
    }
})
userRouter.get("/feed",UserAuth,async(req,res)=>
{
    try {
        const loggedInUser=req.user;

        const page=parseInt(req.query.page)||1;
        const limit=parseInt(req.query.limit)||10;
        const skip=(page-1)*limit;


        const connectionRequests=await ConnectionRequest.find({
            $or:[{fromUserId:loggedInUser._id},{toUserId:loggedInUser._id}]
        }).select("fromUserId toUserId").populate("fromUserId",USER_SAFE_DATA).populate("toUserId",USER_SAFE_DATA);
        const hideUsersFromFeed=new Set();
        connectionRequests.forEach((req)=>
        {
            hideUsersFromFeed.add(req.fromUserId);
            hideUsersFromFeed.add(req.toUserId);
        });
        const users=await User.find({
            $and:[{_id:{$nin:Array.from(hideUsersFromFeed)}},{_id:{$ne:loggedInUser._id}}]
        }).select(USER_SAFE_DATA); 

        res.json({message:"Feed fetched successfully",data:users})

        
    } catch (error) {
        res.status(400).json({message:error.message})
        
    }
})
module.exports=userRouter;