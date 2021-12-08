//imports

import  { Request,Response } from "express";
import  UserService  from "./user.service";
import { IUserModel, ILogInModel, IListModel } from "./user.interface";




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
        const bod = req.body

        try {
            const response = await UserService.logInUser(credentials,bod);
            res.status(response[0]).json(response[1]);
        } catch (error) {
            res.status(500).send(error);
        }
    }

    public async getList(req:Request,res:Response): Promise<void>{
        const token = req.headers['authorization']
        const fpriority = req.query.priority
        const ftask = req.query.task
        const fdescription = req.query.description
        try {
            const response = await UserService.getItems(token,fpriority,ftask, fdescription);
            res.status(response[0]).json(response[1]);
        } catch (error) {
            res.status(500).send(error);
        }
    }
    public async createList(req:Request,res:Response): Promise<void>{
        
        const list:IListModel = req.body
        const token = req.headers['authorization']
        try{
            const response = await UserService.createItems(list,token)
            res.status(response[0]).json(response[1]);
        } catch(error){
            res.status(500).send(error);
        }
    }

}


export default new UserCtrl()