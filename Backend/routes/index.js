const express=require("express");
const accountRouter=require("./account")
const router=express.Router();
const UserRouter=require("./user")

router.use("/user",UserRouter)
router.use("/account",accountRouter);
module.exports=router;