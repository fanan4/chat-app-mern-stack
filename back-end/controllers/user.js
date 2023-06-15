
const User = require('../Models/user');
const Users=require('../Models/user')
const { StatusCodes }=require('http-status-codes')
exports.getUsers=async(req,res)=>{
    // console.log("hello in get Users search is:",req.query.search)
    const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } }, 
        ],
      }
    : {};
      try {
        const users= await User.find( keyword )/*.find( {_id :{ $ne: req.user._id } } )*/
        res.status(StatusCodes.OK).json({users})
      } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error) 
      }
    
                           

      
}