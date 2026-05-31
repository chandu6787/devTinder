const mongoose = require("mongoose");
const validator=require("validator")
const jwt = require("jsonwebtoken");
const bcrypt=require("bcrypt");


const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required:true,
    minLength:4,
    maxLength:50
  },
  lastName: {
    type: String,

  },
  emailId: {
    type: String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true,
    validate(value)
    {
      if(!validator.isEmail(value))
      {
        throw new Error("Invalid email address: "+value)
      }

    }
  },
  password: {
    type: String,
    required:true,
    validate(value)
    {
      if(!validator.isStrongPassword(value))
      {
        throw new Error("Enter a strong password: "+value);
      }

    }
  },
  age: {
    type: Number,
    min:18
  },
  gender: {
    type: String,
    validate(value){
        if(!["male","female","others"].includes(value))
        {
            throw new Error("Gender data is not valid");
        }
    }
  },
  photoUrl:{
    type:String,
    default:"https://media.istockphoto.com/id/2151669184/vector/vector-flat-illustration-in-grayscale-avatar-user-profile-person-icon-gender-neutral.jpg?s=612x612&w=0&k=20&c=UEa7oHoOL30ynvmJzSCIPrwwopJdfqzBs0q69ezQoM8=",
    validate(value)
    {
      if(!validator.isURL(value))
      {
        throw new Error("Invalid email Photo URL: "+value);
      }

    }
  },
  skills:{
    type:[String]
  }
},{
    timestamps:true
});
userSchema.methods.getJWT=async function ()
{
  const user=this;
  const token=await jwt.sign({_id:user._id},"Chandu143@c",{expiresIn:"1d"})
  return token;

}
userSchema.methods.validatePassword=async function(password)
{
  const user=this;
  const isPasswordValid=await bcrypt.compare(password,this.password)
  return isPasswordValid;
}

module.exports=mongoose.model("User",userSchema);