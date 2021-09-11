//modulos externos
import dotenv from "dotenv";
import express  from "express";
import {connect} from "./database/pstg"
import { userRouter } from "./users/user.router"

dotenv.config();

//variables App

if(!process.env.PORT){
    process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();

//configuracion de app

app.use(express.json());

app.use('/a',(req,res)=>{
    res.send("funcionó")
})

app.use("/users", userRouter )

//activacion de server

app.listen(PORT,()=>{
  console.log(`Listening on port ${PORT}`)
})

connect();