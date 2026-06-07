const validator=require("validator");
const validateSignUpData=(req)=>
{
    const {firstName,lastName,emailId,password}=req.body;
    if(!firstName || !lastName)
    {
        throw new Error("Name is not valid!");
    }else if(!validator.isEmail(emailId))
    {
        throw new Error("Email is not valid");
    }else if(!validator.isStrongPassword(password))
    {
        throw new Error("Please enter a strong Password")
    }
 
};
const validateEditProfileData=(req)=>
{
    const data=req.body;
 const ALLOWED_UPDATES=["photoUrl","about","gender","age","skills","firstName","lastName"];
  const isUpdateAllowed=Object.keys(data).every((fields)=>ALLOWED_UPDATES.includes(fields)) 
  return isUpdateAllowed ? true :false;
}
module.exports={
    validateSignUpData,
    validateEditProfileData
}