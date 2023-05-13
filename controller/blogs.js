const {error,validate}=require('../service/repeat')
const blog=require('../models/blog')
const mongoose=require('mongoose')

const getAllBlog=async(req,res)=>{
    try{
        const {perPages,currentPages,authorName}=req.body.obj
        const perPage=Number(perPages)
        const currentPage=Number(currentPages)
        if(perPage>10) perPage=10   // no one can get more then 10 pege at a time 
        const p1= blog.countDocuments({author:authorName})
        const p2= blog.find({author:authorName}).skip(currentPage*perPage).limit(perPage).sort({'uploadTime':-1})
        // resolve both at a time
        const allUserBlog=await  Promise.all([p1,p2])

            let lastpage=(Math.floor(allUserBlog[0]/perPage))   
            
            const isnextpage={
                currentPage:currentPage,
                hasNextpage: lastpage>=currentPage+1,
                nextpage:currentPage+1,
                hasPreviouspage:currentPage>0,
                previouspage:currentPage-1,
                lastpage:lastpage>currentPage+1?lastpage:0
            }
        res.status(200).json({data:allUserBlog[1],nextObj:isnextpage})
    }catch(err){
        error(res,'something went wrong',err.message)
    }
}
const editBlog=async(req,res)=>{
    try{
        const{title,content}=req.body.obj
        if( !validate(title,content)) {
         return res.status(400).json({message:'some field is empty '})
        }
       await blog.findByIdAndUpdate(req.params.id,{title:title,author:req.user.name,content:content})
       res.status(200).json({message:'edited'})
    }catch(err){
        error(res,'something went wrong',err.message)
    }
}
const addNewBlog=async(req,res)=>{
    const session=await mongoose.startSession()
    session.startTransaction()
    try{
        const{title,content}=req.body.obj
       if( !validate(title,content)) {
        return res.status(400).json({message:'please fill all details '})
       }
    const addBlog=await blog.create({title:title,author:req.user.name,content:content},{session:session})
      req.user.blog.push(addBlog._id)
      await req.user.save({session:session})
      await session.commitTransaction()
        res.status(200).json({message:'you blog added'})

    }catch(err){
        await session.abortTransaction()
        error(res,' duplicate title ',err.message)
    }finally{
        await session.endSession()
    }
}

const deleteBlog=async(req,res)=>{
    const session=await mongoose.startSession()
    session.startTransaction()
    try{
        const id=req.params.id
        req.user.blog=req.user.blog.filter(e=>e.toString()!=id.toString())
        const p1=req.user.save({session:session})
        const p2=blog.findByIdAndRemove(id).session(session)
        //both start at a time
        await Promise.all([p1,p2])
        await session.commitTransaction()
        res.status(200).json({message:'deleted'})
    }catch(err){
        await session.abortTransaction()
        error(res,'something went wrong',err.message)
    }finally{
        await session.endSession()
    }
}
const getBlogById=async(req,res)=>{
    try{
        const getById=await blog.findById(req.params.blogid)
        res.status(200).json(getById)
    }catch(err){
        error(res,'','error while ')
    }
}

//user all page
const getAllBlogOfUser=async(req,res)=>{
    try{
        const {perPages,currentPages}=req.body.obj
        const perPage=Number(perPages)
        const currentPage=Number(currentPages)
        const count=req.user.blog.length
        if(perPage>10) perPage=10
        const allUserBlog=await req.user.populate(
            {
            path:'blog',
            model:'daxblog',
            options:{
                skip:currentPage*perPage,
                limit:perPage,
                sort:{
                    'uploadTime':1
                }
             }
            })
            let lastpage=(Math.floor(count/perPage))   
            
            const isnextpage={
                currentPage:currentPage,
                hasNextpage: lastpage>=currentPage+1,
                nextpage:currentPage+1,
                hasPreviouspage:currentPage>0,
                previouspage:currentPage-1,
                lastpage:lastpage>currentPage+1?lastpage:0
            }
        res.status(200).json({data:allUserBlog.blog,nextObj:isnextpage})
    }catch(err){
        error(res,'something went wrong',err.message)
    }
}
module.exports={
    getAllBlogOfUser,
    getBlogById,
    getAllBlog,
    deleteBlog,
    editBlog,
    addNewBlog
}