const express=require('express')
const itemRoute=require('./route/itemRoute')
const userRoute=require('./route/userRoute')
const cartRoute =require('./route/cartRoute.js')
const categoryRoute =require('./route/categoryRoute.js')
const { AppError } = require('./utilites/appError.js')

const app = express();

app.use(express.json()); 

app.use('/users',userRoute)
app.use('/items',itemRoute)
app.use('/cart',cartRoute)
app.use('/category',categoryRoute)

app.use('*',(req,res,next)=>{
    // res.json({msg:`not fount page  : ${req.originalUrl}`})
    next(new AppError(`not fount page  : ${req.originalUrl}` ,404))
})


//global Error handling
app.use((err,req,res,next)=>{
    res.status(err.statusCode).json({Error :err.message})
})

module.exports=app;
