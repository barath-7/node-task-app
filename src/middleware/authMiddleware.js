const jwt = require("jsonwebtoken")
const User = require("../models/user")

const authMiddleware = async (req,res,next) =>{
    try {
        let token = req.header('Authorization').replace('Bearer ','')
    let decodedToken = jwt.verify(token,'secretkey')
    let user = await User.findOne({_id:decodedToken._id,'tokens.token':token})
    if(!user){
        throw new Error()
    }
    req.token=token
    req.user=user
    next()
    } catch (error) {
        res.status(400).send('Authentication failed')
    }
    
}

module.exports=authMiddleware