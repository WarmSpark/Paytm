const express=require("express");
const jwt=require("jsonwebtoken")
const zod=require("zod");
const {User,Account}=require("../db")
const Router=express.Router();
const JWT_SECRET=require("../config")
const authMiddleware=require("../middleware");
const { da } = require("zod/v4/locales");

const SignupSchema=zod.object({
    username:zod.string(),
    firstName:zod.string(),
    lastName:zod.string(),
    email:zod.string(),
    password:zod.string()
})
Router.post("/signup",async(req,res)=>{
    const body=req.body;
    const {success}=SignupSchema.safeParse(req.body);
    if(!success){
        return res.json({
            message:"invalid"
        })
    }
    const user=await User.findOne({
        username:body.username
    })
    if(user){
        return res.json({
            message:"user is already there"
        })
    }
     const dbuser = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    })
    const userID=dbuser._id;
    await Account.create({
        userID,
        balance:1+Math.random()*10000
    })

    const token=jwt.sign({
        userId:dbUser._id
    },JWT_SECRET)

    res.json({
        message:"the user is created",
        token:token
    })

})

const SigninBody=zod.object({
    username:zod.string().email(),
    password:zod.string()

})
Router.post("/signin",async(req,res)=>{
    const {success}=SigninBody.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            message:"incorrect inputs"
        })
    }
    const user=await User.findOne({
        username:req.body.username,
        password:req.body.password
    })
    if(user){
        const token=jwt.sign({
            userId:user._id
        },JWT_SECRET)
        res.json({
            token:token
        })
        return
    }
    res.status(411).json({
        message: "Error while logging in"
    })
})


const UpdateBody=zod.object({
    firstName:zod.string().optional(),
    lastName:zod.string().optional(),
    password:zod.string().optional()
})
Router.put("/",authMiddleware,async(req,res)=>{
    const {success}=UpdateBody.safeParse(req.body);
    if(!success){
        res.status(400).json({
            message:"error"
        })
    }
    await User.updateOne(req.body,{
        _id:req.userId
    })
    res.json({
        message:"updated succesfully"
    })
})
Router.get("/bulk",async(req,res)=>{
    const filter=req.query.filter || "";
    const users=await User.find({
        $or:[{
            firstName:{
                "$regex": filter
            }
        },{
            lastName:{
                "$regex": filter
            }
        }]
    })  
        res.json({
            user:users.map(user=>({
                username:user.username,
                firstName:user.firstName,
                lastName:user.lastName,
                _id: user._id
            }))
        })

    })



module.exports=Router;