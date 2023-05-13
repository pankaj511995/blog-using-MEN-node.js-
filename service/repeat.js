
exports.error=(res,sendErrorMessage,consoleError)=>{
    res.status(400).json(sendErrorMessage)
    console.log(consoleError)
}
exports.validate=(one,two)=>{
    if(one===''||two===''){
        return false
    }else if(typeof one ==='string' && typeof two ==='string'){
        return true
    }else {
        return false
    }
}