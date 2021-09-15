//imports

import  { Request,Response } from "express";
import  UserService  from "./user.service";
import { IUserModel, ILogInModel } from "./user.interface";




class UserCtrl {

    public async registerUser(req:Request,res:Response): Promise<void>{

        const user:IUserModel = req.body;

        try {
            const response = await UserService.createUser(user);
            res.status(response[0]).json(response[1]);
        } catch (error) {
            res.status(500).send(error);
        }
    }

    public async logIn(req:Request,res:Response): Promise<void>{

        const credentials:ILogInModel = req.body;

        try {
            const response = await UserService.logInUser(credentials);
            res.status(response[0]).json(response[1]);
        } catch (error) {
            res.status(500).send(error);
        }
    }

}


export default new UserCtrl()