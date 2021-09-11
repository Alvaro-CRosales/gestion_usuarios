//imports

import  { Request,Response } from "express";
import  UserService  from "./user.service";



class UserCtrl {

    public async registerUser(req:Request,res:Response): Promise<void>{

        const email = req.body.email
        const password = req.body.password
        const name = req.body.name
        const age = req.body.age
        const gender = req.body.gender
        const bio = req.body.bio
        try {
            const response = await UserService.createUser(email,password, name, age, gender, bio);
            res.status(response[0]).json(response[1]);
        } catch (error) {
            res.status(500).send(error)
        }
    }

}


export default new UserCtrl()