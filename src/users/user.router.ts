//imports
import { Router } from "express";
import userCtrl from "./user.ctrl";
import jwt  from "../helpers/jwt";

export const userRouter = Router();

//rutas


userRouter
    .post("/signup", userCtrl.registerUser)
    .post("/login", userCtrl.logIn)
    .get("/list",userCtrl.getList)