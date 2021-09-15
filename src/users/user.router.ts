//imports
import { Router } from "express";
import userCtrl from "./user.ctrl";

export const userRouter = Router();

//rutas


userRouter
    .post("/signup", userCtrl.registerUser)
    .post("/login", userCtrl.logIn)