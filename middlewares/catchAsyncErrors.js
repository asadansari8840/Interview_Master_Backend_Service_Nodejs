const catchAsyncErrors = (asynFunc) => (req,res,next) =>{
    Promise.resolve(asynFunc(req,res,next)).catch(next);
}

export default catchAsyncErrors ;