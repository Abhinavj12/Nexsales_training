export const errorHandler = (error, req, res, next) => {
    console.error("Error:", error);

    if(error.name === "SequelizeValidationError"){
        return res.status(400).json({
            success: false,
            message:"validation error",
            errors:error.errors.map((err)=>err.message)
        });
    }
    if(error.name === "SequelizeUniqueConstraintError"){
        return res.status(409).json({
            success: false,
            message:"Unique constraint error"
        });
    }


    //Other unexpectd error
    return res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });
}