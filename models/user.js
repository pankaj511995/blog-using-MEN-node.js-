const mongoose=require('mongoose')
const user=new mongoose.Schema({
    email:{

        type:String,
        require:true,
        unique:true
    },
    name:{

        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    blog:[{type:mongoose.Schema.Types.ObjectId,ref:'daxblog'}]
})

module.exports=mongoose.model('daxuser',user)