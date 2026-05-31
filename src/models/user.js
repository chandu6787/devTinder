const mongoose = require("mongoose");
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
    trim:true
  },
  password: {
    type: String,
    required:true
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
    default:"https://media.istockphoto.com/id/2151669184/vector/vector-flat-illustration-in-grayscale-avatar-user-profile-person-icon-gender-neutral.jpg?s=612x612&w=0&k=20&c=UEa7oHoOL30ynvmJzSCIPrwwopJdfqzBs0q69ezQoM8="
  },
  skills:{
    type:[String]
  }
},{
    timestamps:true
});
module.exports=mongoose.model("User",userSchema);