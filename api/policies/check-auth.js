const jwt = require('jsonwebtoken');
const dotenv = require("dotenv").config();


module.exports = async(req , res ,next)=>{
    try{
        
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token , process.env.JWT_KEY)
        const user = await User.findOne({id : decoded.id})
        
        console.log(decoded);

        if(token == user.token){
            req.userData = decoded; 
            return next();
        }else{
            res.status(401).json({
                message : 'token invalid'
            })
        }
        
    }catch(error){
        res.status(401).json({
            message : 'Auth Failed'
        });
    }
}