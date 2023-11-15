const handleError = require('../models/http-error')
const jwt = require('jsonwebtoken')
async function verifyToken (req,res,next){
    const token = req.cookies.access_token
    if(!token){
        return next(handleError("Unauthrized", 401))
    }
    jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
        if(err){
            return next(handleError("Forbidden", 403))
        }
        req.user = user
        next()
    })
}
module.exports = verifyToken