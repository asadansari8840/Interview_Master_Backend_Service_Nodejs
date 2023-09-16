import catchAsyncErrors from "./catchAsyncErrors.js";


const errorMiddleware = (err, req, res, next) => {
    err.message = err.message || 'Internal server error';
    err.statusCode = err.statusCode || 500;


    //Wrong mongo db id error
    if (err.name === "CastError") {
        const message = `Resource not found. Invalid : ${err.path}`;
        err = new ErrorHandler(message, 400)
    }

    //Mongoose Duplicate key error
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`
        err = new ErrorHandler(message, 400)
    }

    return res.status(err.statusCode).json({
        success: false,
        message: err.message,
    })

};


export default errorMiddleware ;