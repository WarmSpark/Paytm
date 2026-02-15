const express=require("express");
const jwt=require("jsonwebtoken")
const zod=require("zod");
const {User}=require("../db")
const Router=express.Router();
const JWT_SECRET=require("../config")

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
    const dbUser=await User.create(body);
    const token=jwt.sign({
        userId:dbUser._id
    },JWT_SECRET)

    res.json({
        message:"the user is created",
        token:token
    })
})







module.exports=Router;