const mongoose  =require("mongoose");

const userScheam = new mongoose.Schema({
    username:{
        type:String, 
        required:true,
        unique:true
    },
    email:{
        type:String, 
        required:true,
        unique:true
    },
    password:{
        type:String, 
        required:true
    },
    avatar:{
        type:String,
        default:'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&q=60&w=500&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D'
    }
},{timestamps:true})
const User = mongoose.model('User', userScheam);
module.exports= User;