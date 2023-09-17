import app from "./app.js";
import connectDb from "./config/connectDb.js";
import connectionConstants from "./config/connectionConstants.js";

process.on("uncaughtException", (err) => {
    console.log(`Error :- ${err.message}`);
    console.log("Shutting down the server due to uncaught exception");
    process.exit(1);
});

connectDb();

const server = app.listen(process.env.PORT || connectionConstants.DEV_SERVER_PORT, () => {
    console.log(`App is listening on http://localhost:${connectionConstants.DEV_SERVER_PORT}`)
});

//Handling errors of unhandled promises !!
process.on("unhandledRejection", (err) => {
    console.log(`Error Reason :- ${err.message}`);
    console.log(`Shutting down the server due to unhandled promise rejection :- ${err}`);
    server.close(() => {
        process.exit(1);
    });
});