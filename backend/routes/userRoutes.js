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
    try {
        const {firstname,email,password,age}=req.body
        const reqBody=z.object({
            firstname:z.string().trim().min(1, "Name is required").max(50),
            email:z.string().email(),
            // bcrypt ignores anything past 72 bytes, so that's the real ceiling here.
            password:z.string().min(6, "Password must be at least 6 characters").max(72),
            age:z.number({ invalid_type_error: "Age is required" }).int().min(13, "You must be at least 13 years old").max(120)
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
            return res.status(409).json({ success: false, message:"This email already exists" })
        }

        const hashedPassword=await bcrypt.hash(password,10)

        const newUser = new User({
            firstname,
            email,
            password: hashedPassword,
            age,
        });

        await newUser.save();

        return res.json({message:"you are signed up"})
    } catch (err) {
        console.error("Error in signup:", err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
})

router.post('/signin',async (req,res)=>{
    try {
        const {email,password}=req.body
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

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
    } catch (err) {
        console.error("Error in signin:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
})

router.get('/history', userAuth, async (req, res) => {
    const userId = req.user.userid;
  
    try {
      const userNews = await News.find({ userId })
        .sort({ createdAt: -1 })
        .limit(5); 
  
      res.json(userNews);
    } catch (error) {
      console.error(error);
      res.status(500).json([]);
    }
  });
   
module.exports=router
