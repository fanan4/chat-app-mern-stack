const { StatusCodes }=require('http-status-codes')
const Chat=require('../Models/chat')
const User=require('../Models/user')
exports.accessChat=async(req,res)=>{
     console.log('hello in access chat req',req.body)
     const { userId } = req.params;
     console.log('user iddd',userId)   
    //  req.user={ _id:req.body.MyId }
  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
   }).populate("users", "-password")
        .populate("latestMessage");

  // isChat = await User.populate(isChat, {
  //   path: "latestMessage.sender",
  //   select: "name pic email",
  // });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else { 
    console.log('hello in create a new chattt')
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
    //   throw new Error(error.message);
    }
  }
}
//fetch results ***************
//    ******************************   ******************************
exports.fetchChats=async(req,res)=>{
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password") 
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).send(results); 
      });
  } catch (error) {
    res.status(400);
    return res.status(StatusCodes.BAD_REQUEST).send(error)
  }
}
//    ******************************    ******************************
exports.createGroupChat=async(req,res)=>{
   
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill all the feilds" });
  }

  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }

  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user._id,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    res.status(StatusCodes.BAD_REQUEST).send(error)
  }
}
exports.addGroupe=async(req,res)=>{
    const UpdatedChat=await Chat.findByIdAndUpdate( req.body.chatId,{
      $push: { users: req.body.userId },
    },{ new:true })
        .populate("users","-password")
        .populate("groupAdmin","-password")
      if(!UpdatedChat){
         return res.status(StatusCodes.BAD_REQUEST).send('there is an error')
      }
         return res.status(StatusCodes.BAD_REQUEST).json({UpdatedChat})
}
//    ******************************     ******************************
exports.renameGroupe=async(req,res)=>{
  const UpdatedChat=await Chat.findByIdAndUpdate( req.body.chatId,{
      chatName:req.body.chatName
  },{ new:true })
      .populate("users","-password")
      .populate("groupAdmin","-password")
    if(!UpdatedChat){
       return res.status(StatusCodes.BAD_REQUEST).send('there is an error')
    }
       return res.status(StatusCodes.BAD_REQUEST).json({UpdatedChat})
}
//    ******************************    ******************************
exports.removeGroupe=async(req,res)=>{
  const UpdatedChat=await Chat.findByIdAndUpdate( req.body.chatId,{
    $pull: { users: req.body.userId },
  },{ new:true })
      .populate("users","-password")
      .populate("groupAdmin","-password")
    if(!UpdatedChat){
       return res.status(StatusCodes.BAD_REQUEST).send('there is an error')
    }
       return res.status(StatusCodes.BAD_REQUEST).json({UpdatedChat})
}
//    ******************************    ******************************
