//imports
import { Router } from "express";
import userCtrl from "./user.ctrl";
import UserCtrl from "./user.ctrl";

export const userRouter = Router();

//rutas


userRouter
    .post("/sign", userCtrl.registerUser)