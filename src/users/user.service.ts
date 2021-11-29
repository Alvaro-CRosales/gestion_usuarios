//imports
import pool from "../database/pstg"
import { ILogInModel, IUserModel } from "./user.interface"
import {hash, compare} from 'bcrypt'
import jwt from '../helpers/jwt'
import { type } from "os";


//clase con los metodos

class UserService {
    
    
    public async createUser(user: IUserModel):Promise<any>{
        try {
            user.password = await hash(user.password,10);
            const validate = (await pool.query(`SELECT email FROM public.user WHERE email = '${user.email}'`)).rows
            console.log(validate)

            if(validate.length == 0){

                const result = await pool.query(`INSERT INTO public.user (email,password,name ) VALUES 
                ('${user.email}','${user.password}','${user.name}')`)
                return[200,{mensaje:"se agregó un nuevo usuario"}]

            }else{
                return[400,{mensaje:"El correo ya existe"}]
            }
            
            
        } catch (error) {
            console.log(error)
            return[500,error]
        }
    }

    public async logInUser(credentials:ILogInModel,body:any): Promise <any>{
        try {
            
            const validateEmail = (await pool.query(`SELECT email FROM public.user WHERE email = '${credentials.email}'`)).rows
            const validatePass = (await pool.query(`SELECT password FROM public.user WHERE email = '${credentials.email}'`)).rows[0].password.toString()
            console.log(validatePass)

            if(validateEmail.length == 0) {
                return[404,{mensaje:"El correo no existe"}]
            }
            if(await compare(credentials.password,validatePass)){
                const token = await jwt.createJwt(body)
                console.log(token)
                return[200,{mensaje:"Se inició sesion correctamente", token}]
            }else{
                return[400,{mensaje:"El correo o la contraseña son incorrectos"}]
            }

        } catch (error) {
            console.log(error)
            return[500,error]
        }
    }
    public async getItems(token:any): Promise <any>{
        
        try {
            const decoded = jwt.verifyJwt(token)
            
            const list = (await pool.query(`SELECT l.name as TAREA FROM public.list as l INNER JOIN public.user as u ON l.user_id = u.id WHERE u.email='${decoded}'`)).rows
            console.log(list)
            return[200,{mensaje:"funciona",list}]
        } catch (error) {
            console.log(error)
            return[500,error]
        }
    }
}


export default new UserService()