//imports
import { Router } from "express";
import userCtrl from "./user.ctrl";

export const userRouter = Router();

//rutas


userRouter
    .get("/list",userCtrl.getList)
    .get("/notifications", userCtrl.getUserNotifications)
    .post("/signup", userCtrl.registerUser)
    .post("/login", userCtrl.logIn)
    .post("/list/create", userCtrl.createList)
    .post("/list/collaborator/:id", userCtrl.addCollaborator)
    .put("/list/update/:id", userCtrl.updateList)
    .put("/notifications/status/:id", userCtrl.updateUserNotification)
    .delete("/user/delete", userCtrl.deleteUser)
    .delete("/list/delete/:id", userCtrl.deleteList)
    
    