const express = require("express");
const mongoose =require("mongoose");
const cors=require("cors")
const MainRouter=require("./routes/index")
mongoose.connect("mongodb+srv://divyansh1410:divyansh2005@cluster0.qrenin7.mongodb.net/paytm?retryWrites=true&w=majority");


const app=express();
app.use(cors);
app.use(express.json());
app.use("/api/v1",MainRouter)

app.listen(3000);