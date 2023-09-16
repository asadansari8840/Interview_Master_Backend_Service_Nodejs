import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import errorMiddleware from "./middlewares/errorMiddleware.js";

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json());

//Importing contact router 
import ContactRouter from "./routes/contactRoutes.js";

app.use("/api", ContactRouter);

//Error Middleware
app.use(errorMiddleware);


export default app;