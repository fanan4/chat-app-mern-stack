const User=require('../Models/user')
const { StatusCodes }=require('http-status-codes')
exports.login=async(req,res,next)=>{ 
    console.log("hello in the login ",req.body)
     User.findOne({email:req.body.email})
      .exec(async(error,user)=>{
            if(error) return res.status(StatusCodes.BAD_REQUEST).json({error})
            if(user){
                 const auth=await user.verifyCode(req.body.password)
                 if(auth){
                    const token=await user.createToken() 
                  //   console.log('the token isss ',token)
                    const USER=await User.findOne({ name:user.name,email:user.email})
                  //   user._id=USER._id
                    console.log('user issss ',USER)  
                    user._id=USER._id
                    return res.status(StatusCodes.OK).json({token,user})
                 }
                 else{
                    return res.status(StatusCodes.BAD_REQUEST).json({error:'password invlaid'})
                 } 
            }
      })
}
exports.signUp=async(req,res)=>{
    console.log("hello in signUp req body iss",req.body)
      User.findOne({ email:req.body.email }) 
        .exec((error,user)=>{
             if(error) return res.status(StatusCodes.BAD_REQUEST).json({error})
             if(user) return res.status(StatusCodes.BAD_REQUEST).json('user already registred')
             else{
                console.log("hi user does not exist ")
                 const UserR={
                    name:req.body.name,
                    email:req.body.email,
                    password:req.body.password, 
                  //   isAdmin:false
                 }
                 if(req.file){
                     console.log('filename isss :',req.file.filename)
                      UserR.pic=req.file.filename
                 }
                 const user=new User(UserR)
                 console.log("the user iss:",user)
                 user.save((err,data)=>{
                    if(err) {
                     console.log("the error is :",err)
                     return res.status(StatusCodes.BAD_REQUEST).json({error:err})
                    }
                    if(data){
                        return res.status(StatusCodes.OK).json({data})
                    }
                 })
             }
        })
}