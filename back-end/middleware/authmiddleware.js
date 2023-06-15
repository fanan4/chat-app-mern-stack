const { StatusCodes }=require('http-status-codes')
const jwt=require('jsonwebtoken')
const User = require('../Models/user')
exports.authMiddleware=async (req,res,next)=>{
      const tokenA=req.headers.authorization
     
       if(!tokenA && !tokenA.startsWith('Bearer')){ 
           return res.status(StatusCodes.UNAUTHORIZED).send('you are unauthorized')
       }
       const tokenC=tokenA.split(' ')[1]
       const decoded=jwt.verify(tokenC,process.env.SECRET)
       req.user = await User.findById(decoded.id).select("-password");
       next()  
}
