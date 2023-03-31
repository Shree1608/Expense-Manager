/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");


const dotenv = require("dotenv").config();


module.exports = {
    singup: async(req,res)=>{
        const {userName ,email,password }= req.body;
        try{
          const user = await User.findOne({email});
          if(user){
            res.status(401).json({
                message : " email already exits"
            })
          }else{
           
            const minNumberofChars = 8;
            if(password.length<minNumberofChars){
                res.status(410).json({
                    message:"password length should be contain minimum 8 character"
                })
            }else{
        
                const hash = await bcrypt.hash(password,10);
                const newuser = await User.create({
                    userName,
                    email ,
                    password: hash,
                    
                }).fetch();

                // const doc = await Accounts.create({accountName : userName ,user:newuser.id})
                
                await sails.helpers.sendmail(email , userName);
                const account = await { accountName: userName,owner : newuser.id}
                await sails.models.user.fn(account)
                
                return res.json({
                    success : true,
                    message: 'user created'
                });
                
                
            }
            
            
             
          }
        }catch(err){
            console.log(err);
             res.status(500).json({
                success: false,
                message: err.message
             });
        }
    },
    
    login : async(req,res) =>{
        const {email,password}= req.body;
       
        try{
            const user = await User.findOne({email});
            if(!user){
                res.status(404).json({
                    message:"user not found"
                })
            }
            const passw = await bcrypt.compare({password : user.password});
            if(!passw){
                res.status(401).json({
                    message:"password invalid"
                })
            }
            const token = jwt.sign({
                id: user.id,
                email: user.email,
            },
            process.env.JWT_KEY ,{
                expiresIn :"1h"
            });
            await User.updateOne({_id: user.id},{token : token});
          
            return res.status(200).json({
                message: " Auth successful",
                token : token
            });

        }catch(error){
            console.log(error);
            res.status(500).json({
                error : error
            })
        }
    } ,
    logout: async (req, res) => {
        try {
       
          const userId = await req.userData.id;
          console.log(req.userData);
          const user = await User.findOne(
            {id : userId});
            console.log(user);
          await User.updateOne({  id:userId }, { token:null });
          res.status(200).json({ message: "User log out successfully" });
        } catch(error){
            console.log(error);
            res.status(500).json({
                error : error
            })
        }
      },
    
};

