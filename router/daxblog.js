const {Router}=require('express')
const {authenticate}=require('../authentication/autho')
const {getAllBlogOfUser,getBlogById,getAllBlog,deleteBlog,editBlog,addNewBlog}=require('../controller/blogs')
const router=Router()

router.get('/blog/:blogid',getBlogById)

router.get('/allblog',getAllBlog)

router.post('/blog',authenticate,addNewBlog)

router.get('/blog',authenticate,getAllBlogOfUser)

router.delete('/blog/:id',authenticate,deleteBlog)

router.patch('/blog/:id',authenticate,editBlog)


module.exports=router