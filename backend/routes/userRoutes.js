const express = require('express');
const jwt=require('jsonwebtoken')
const router = express.Router();
const bcrypt=require("bcrypt");
const z=require("zod");
let User=require("../models/user");
let News=require("../models/news");
let userAuth=require("../middlewares/authentication/user")
require('dotenv').config();

router.post('/signup',async (req,res)=>{
    const {firstname,email,password,age}=req.body
    const reqBody=z.object({
        firstname:z.string().min(5).max(30),
        email:z.string().email(),
        password:z.string().max(10),
        age:z.number()
    })

    const data=reqBody.safeParse(req.body)
    if (!data.success) {
        
        const formattedErrors = data.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
        }));
        return res.status(400).json({
            success: false,
            errors: formattedErrors
        });
    }

    let user=await User.findOne({email:email})

    if(user) {
        return res.json({message:"This email already exists"})
    }

    const hashedPassword=await bcrypt.hash(password,5)

    const newUser = new User({
        firstname,
        email,
        password: hashedPassword, 
        age,
    });

    await newUser.save();

    return res.json({message:"you are signed up"})


})

router.post('/signin',async (req,res)=>{
    const {email,password}=req.body
    let user=await User.findOne({email:email})

    if(!user){
        return res.status(401).json({ message: "Invalid email or password" });

    }

    const match=await bcrypt.compare(password,user.password)

    if(!match){
        return res.status(401).json({ message: "Invalid email or password" });

    }

    let token=jwt.sign({firstname:user.firstname,email:user.email,userid:user._id},process.env.JWT_SECRET)

    return res.json({message:token})

})

router.get('/history', userAuth, async (req, res) => {
    const userId = req.user.userid;
  
    try {
      const userNews = await News.find({ userId }).sort({ createdAt: -1 });
  
      if (userNews.length === 0) {
        return res.json([]);
      }
  
      res.json(userNews);
    } catch (error) {
      console.error(error);
      res.status(500).json([]);
    }
  });
  
module.exports=router
