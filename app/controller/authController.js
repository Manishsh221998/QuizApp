const sendEmailVerification = require("../helper/emailVerification")
const comparePassword = require("../middleware/comparePassword")
const generateUserToken = require("../middleware/createUserToken")
const  hashPassword  = require("../middleware/hashPassword")
const jwt = require("jsonwebtoken");
const UserModel = require("../model/users");
 const fs=require('fs')
 const path=require('path')

class AuthController{
 
    
     async registerUser(req,res){
        console.log(req.body)

        try {
            const{name,email,password}=req.body
            let userImage
            if(req.file){
               userImage=req.file.path 
            }
            if(!(name,email,password)){
                res.status(404).json({message:"All fileds are required !"})
            }

            const exitingUser=await UserModel.findOne({email})
            if(exitingUser){
                  res.status(404).json({
                    status:false,
                    message:"User already exists",
                     
                })
            }
          

            const passwordHased=await hashPassword(password)
            const data=await UserModel.create({name,email,password:passwordHased})
            const token= await generateUserToken(data)
            // console.log(token)

            if(data){
                res.status(201).json({
                    status:true,
                    message:"User created successfully",
                    data,
                    token
                })
            }
            await sendEmailVerification(req,data)
        } catch (error) {
            console.log("Error while register : ",error.message)
        }
    }

    async verifyEmail(req,res){
        try {
            const {id}=req.params
            // const decode=jwt.verify(token,process.env.JWT_SECRET_KEY)
            // console.log(decode)
            await UserModel.findByIdAndUpdate(id,{isVerified:true})
            res.send("Email Verified")
        } catch (error) {
            
        }
    }

    async loginUser(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        const exitingUser = await UserModel.findOne({ email });
            const token= await generateUserToken(exitingUser)

        if (!exitingUser) {
            return res.status(400).json({
                status: false,
                message: "User not exists",
            });
        }

        const passwordMatched = await comparePassword(password, exitingUser.password);
        if (!passwordMatched) {
            return res.status(400).json({
                status: false,
                message: "Incorrect password",
            });
        }

        if (!exitingUser.isVerified) {
            await sendEmailVerification(req,exitingUser);
            return res.status(400).json({
                status: false,
                message: "User is not verified, new verification link sent to your email",
            });
        }

        return res.status(200).json({
            status: true,
            message: "Logged in successfully",
            token,
            exitingUser
         });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: "Internal server error"
        });
    }
    }

    async profile(req,res){
       try {
        return res.status(200).json({
            message: "Profile fetched successfully",
            data: req.user
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching profile",
            error: error.message
        });
    }
    }

    async updateProfile(req, res) {
    try {
    const{name,newPassword}=req.body
        const id = req.user.userId; 
        if (!req.file) {
            return res.status(400).json({
                status: false,
                message: "No image file provided"
            });
        }

         const user = await UserModel.findById(id);
        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found"
            });
        }

         if (user.image && fs.existsSync(user.image)) {
            fs.unlinkSync(user.image);
        }

     const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { image:req.file.path,name,password:await hashPassword(newPassword)},
      { new: true }  
    );

        return res.status(200).json({
            status: true,
            message: "Profile updated successfully",
            data:updatedUser
        });

    } catch (error) {
        console.error("Error updating profile image:", error);
        return res.status(500).json({
            status: false,
            message: "Error updating profile image",
            error: error.message
        });
    }
    }

}

module.exports=new AuthController