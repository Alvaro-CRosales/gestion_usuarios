//modulos externos
import dotenv from "dotenv";
import express  from "express";


dotenv.config();

//variables App

if(!process.env.PORT){
    process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();

//configuracion de app

app.use(express.json());

app.use('/',(req,res)=>{
    res.send("funcionó")
})

//activacion de server

app.listen(PORT,()=>{
  console.log(`Listening on port ${PORT}`)
})