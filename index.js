const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const userRouter = require('./routes/user')
const authRouter = require('./routes/auth')
const productRouter = require('./routes/product')
dotenv.config()

mongoose.connect(process.env.MONGO_URL).then((e )=>{
    console.log('connected db successfull')
}).catch((e)=>{
    console.log(e)
})

app.use(express.json())

app.use('/api/user',userRouter)
app.use('/api/auth',authRouter)
app.use('/api/product',productRouter)
app.listen(process.env.PORT||5000,()=>{
    console.log('running on 5000')
})