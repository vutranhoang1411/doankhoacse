const not_found = (req,res,next)=>{
    res.status(404).json({
        msg:"Route not found"
    })
}
module.exports=not_found