const express=require('express')
const router=express.Router()
const { login,signUp } = require('../controllers/auth')
const multer=require('multer')
const shortid=require('shortid')
const path=require('path')
const { getUsers } = require('../controllers/user')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(path.dirname(__dirname),'uploads'))
    },
    filename: function (req, file, cb) {
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, shortid.generate() + '-' + file.originalname)
    }
  })
  const upload=multer({ storage })
router.route('/signUp').put(upload.single('pic'),signUp)
router.route('/login').put(login)
router.route('/users').get(getUsers) 


module.exports=router
