const express=require('express')
const { sendMessage, getMessages } = require('../controllers/message')
const { authMiddleware } = require('../middleware/authmiddleware')
const router=express.Router()


router.route('/sendMessage').put(authMiddleware,sendMessage)
router.route('/getMessages/:chatId').post(authMiddleware,getMessages)
module.exports=router 