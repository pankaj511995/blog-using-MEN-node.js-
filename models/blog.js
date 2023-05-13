const mongoose=require('mongoose')

const blog=new mongoose.Schema({
    title:{

        type:String,
        require:true,
        unique:true
    },
    content:{

        type:String,
        require:true
    },
    author:{
        type:String,
        require:true
    },
    uploadTime:{
        type:Date,
        default:Date.now
    }
})
module.exports=mongoose.model('daxblog',blog)