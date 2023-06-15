const Message=require('../Models/message')
const Chat=require('../Models/chat')
const { StatusCodes }=require('http-status-codes')
const User = require('../Models/user')

exports.sendMessage=async(req,res,next)=>{
    const { content,chat }=req.body 
    if( !content || !chat ){
       return res.status(StatusCodes.BAD_REQUEST).send('invalid data')
    }
    const messageData={
        sender:req.user._id,
        content,
        chat
    }
     var message=await Message.create(messageData)
     console.log('the new message is: ',message)
     message=await message.populate('sender','name pic').execPopulate()
     message=await message.populate('chat').execPopulate()
     message=await User.populate(message,{
        path:'chat.users',
        select: "name pic email",
     })
     await Chat.findByIdAndUpdate({_id:chat},{ latestMessage:message._id })
     
     res.status(StatusCodes.OK).json({message}) 
}
exports.getMessages=async(req,res,next)=>{
    const { chatId }=req.params
    console.log('chat id is: ',chatId) 
     if(!chatId){
        console.log('invalide data')
         res.status(StatusCodes.BAD_REQUEST).send('invalid data')
     }
      try {
         var messages=await Message.find( {chat:chatId} )
               .populate('sender','name pic')
               .populate('chat','users')      
         res.status(200).json(messages)
      } catch (error) {
        res.status(400).send(error)
      }
    


}