// const customError = require('../errors/customError')
const error_handle = (err,req,res,next)=>{
    // if (err instanceof customError){
    //     return res.status(err.statusCode).json({
    //         msg:err.message
    //     })
    // }
    res.status(500).json({
        msg:"Something wrong, please try again later!"
    })
}
module.exports=error_handle;