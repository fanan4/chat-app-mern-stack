require('dotenv').config()
const express=require('express')
const app=express()
const cors=require('cors')
const connectDb=require('./config/db')
const AuthRouter=require('./routes/auth')
const accessChat=require('./routes/chat')
const messageRouter=require('./routes/message') 
app.use(cors())
app.use(express.json()) 
app.use(express.static('./uploads'))
app.use('/api/auth',AuthRouter)
app.use('/api/chat',accessChat)
app.use('/api/message',messageRouter) 
// app.get('/',(req,res)=>{
//     res.send('welcom to the app')
// } 
// )

const port=process.env.port
const url=process.env.URL

const start= async ()=>{
    try {
      await connectDb(url)  
      app.listen(port,console.log(`the server is lestenning to the port ${port}`))
    } catch (error) {
       console.log(error) 
    }
 }
 start()  
