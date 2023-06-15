const express=require('express')
const { accessChat, fetchChats, createGroupChat, renameGroupe, addGroupe, removeGroupe } = require('../controllers/chat')
const { authMiddleware } = require('../middleware/authmiddleware')
const router=express.Router()

router.route('/accessChat/:userId').get(authMiddleware,accessChat)
router.route('/fetchChat').get(authMiddleware,fetchChats)
router.route('/createGChat').post(createGroupChat)
router.route('/renameChat').put(renameGroupe )
router.route('/addGroupe').put(addGroupe)
router.route('/removeGroupe').put(removeGroupe)
module.exports=router