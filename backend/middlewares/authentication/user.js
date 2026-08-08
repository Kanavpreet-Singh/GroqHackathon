const jwt=require('jsonwebtoken')
require('dotenv').config();
 const userAuth=async(req,res,next)=>{
    let token=req.headers.token
    if(!token){
        return res.status(401).json({ success: false, message:"You are not signed in" })
    }

    try {
        const check = jwt.verify(token,process.env.JWT_SECRET)
        req.user = { userid: check.userid };
        next()
    } catch (err) {
        return res.status(401).json({ success: false, message:"Your session is invalid or has expired. Please sign in again." })
    }
}

module.exports=userAuth