const validateJsonContentType=(req,res,next)=>{
    const methodRequiringBody=["POST","PUT","PATCH"];

    if(!methodRequiringBody.includes(req.method)){
        return next();
    }
    const contentType=req.header("content-type");

    if(!contentType){
        return res.status(400).json({
            success:false,
            message:"Content-Type header is required"
        });
    }

    if(!contentType.toLowerCase().includes("application/json")){
        return res.status(415).json({
            success:false,
            message:"Content-Type must be appliaction/json "
        })
    }
    next();
};
module.exports=validateJsonContentType;