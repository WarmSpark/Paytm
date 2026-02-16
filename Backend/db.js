const mongoose =require("mongoose");
const Schema=mongoose.Schema;


const UserSchema=new Schema({
    username:String,
    firstName:String,
    lastName:String,
    email:String,
    password:String
})
const accountSchema=new Schema({

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    balance:{
        type:Number,
        required:true
    }
});


const UserModel=mongoose.model("user",UserSchema);
const Account=mongoose.model('account',accountSchema)
module.exports={UserModel,Account};
