const { required } = require('joi')
const mongoose=require('mongoose')
const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please provide a name'],
        trim:true
    },
    email:{
        type:String,
        required:[true,'Please provide a email'],
        unique:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
         minlength: 4,
    },
    isVerified:{
        type:Boolean,
        default:false
    }, 
    image:{
        type:String,

    } 
},{
    versionKey:false,
    timestamps:true
})
const UserModel=mongoose.model("user",UserSchema)
module.exports=UserModel