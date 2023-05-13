const jwt=require('jsonwebtoken')
const {error}=require('../service/repeat')
const users=require('../models/user')
exports.authenticate=async(req,res,next)=>{
    try{
    const userdetails=jwt.verify(process.env.TOKEN,process.env.SECRATE)
    if(userdetails){
        const user=await users.findOne({email:userdetails.email})
        if(user){
            req.user=user
            next()
        }else throw new Error('')
        }else throw new Error('')
   
    }catch(err){
        error(res,'New user Sign Up now','error while authentication')
    }
}

    // const token=jwt.sign({email:'pankaj@gmail.com'},process.env.SECRATE)

