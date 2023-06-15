const mongoose = require("mongoose");
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const userSchema = mongoose.Schema(
  {
    name: { type: "String", required: true },
    email: { type: "String", unique: true, required: true },
    password: { type: "String", required: true },
    pic: {
      type: "String",
      // required: true,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    isAdmin: {
      type: Boolean,
      //required: true,
      default: false,
    },
  },
  { timestaps: true }
);
userSchema.pre('save',async function() {
      const salt=await bcrypt.genSalt(10)
      this.password=await bcrypt.hash(this.password, salt) 
})

userSchema.methods.verifyCode=async function(ppassword){
  //  console.log("the password issss",password)
      return await bcrypt.compareSync(ppassword, this.password)
}
userSchema.methods.createToken=async function(){
    return jwt.sign({id:this._id},process.env.SECRET,{ expiresIn:'30d'})
}
const User=mongoose.model("User",userSchema)
module.exports=User