const check =(req,res,next)=>{
    console.log('i did my job')
    next()
}

module.exports =check