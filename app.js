require('dotenv').config()
const routerblog=require('./router/daxblog')
const app=require('express')()
const cors=require('cors')
const bodyParser=require('body-parser')
const  mongoose=require('mongoose')
app.use(cors())
app.use(bodyParser.json({extended:false}))


app.use('/',routerblog)



mongoose.connect(process.env.MONGO_URL).then(res=>{
    app.listen(process.env.PORT)
}).catch(err=>console.log(err.message))


 