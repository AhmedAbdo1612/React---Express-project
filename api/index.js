const express = require( 'express')
const mongoose = require ('mongoose')
const dotenv = require ('dotenv');
const bodyParser = require('body-parser')
const userRouter = require ('./routes/user-routes.js')
const handleError = require('./models/http-error.js')
const cookieParser = require('cookie-parser');
const listingRouter = require('./routes/listing-routes.js')
const path = require('path') 
dotenv.config() 
const app = express()
const dirname = path.resolve()
app.use(bodyParser.json())
app.use(cookieParser())
console.log(process.version)
app.use('/api/users',userRouter)
app.use('/api/listings', listingRouter)
app.use(express.static(path.join(dirname, `client/dist`)))
app.get('*',(req,res)=>{
    res.sendFile(path.join(dirname,'/client/dist/index.html'))
})
app.use((req, res,next)=>{
    return next(handleError("Could not find this route", 404))
})
app.use((error, req,res,next)=>{
    if(res.headerSent){
        return next(error)
    }
    res.status(error.code||500).json({message:error.message||"unknown error occured",success:false})
})

mongoose.connect(process.env.MONGO).then(()=>{
    app.listen(3000)
    console.log('Successful connection')
}).catch((err)=>{
    console.log(err)
})
