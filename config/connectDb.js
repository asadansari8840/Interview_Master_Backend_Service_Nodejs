import mongoose from "mongoose";
import conConstants from "./connectionConstants.js";


const connectDb = ()=>{
    mongoose.connect(conConstants.MONGO_DB_LIVE_URI,{useUnifiedTopology: true , useNewUrlParser : true}).then((conn)=>{
        console.log(`connected to mongodb at ${conn.connection.host} : ${conn.connection.port}`);
    });
};


export default connectDb ;