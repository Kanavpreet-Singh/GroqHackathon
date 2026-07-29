const jwt=require('jsonwebtoken')
require('dotenv').config();
 const userAuth=async(req,res,next)=>{
    let token=req.headers.token
    if(!token){
        return res.status(401).json({message:"you are not signed in"})
    }

    let check
    try {
        check = jwt.verify(token,process.env.JWT_SECRET)
    } catch (err) {
        return res.status(401).json({message:"you are not signed in"})
    }

    req.user = { userid: check.userid };
    next()
}

module.exports=userAuth