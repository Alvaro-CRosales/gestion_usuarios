//imports
import pool from "../database/pstg"
import { ILogInModel, IUserModel } from "./user.interface"
import {hash, compare} from 'bcrypt'

//clase con los metodos

class UserService {
    
    
    public async createUser(user: IUserModel):Promise<any>{
        try {
            user.password = await hash(user.password,10);
            const validate = (await pool.query(`SELECT email FROM users WHERE email = '${user.email}'`)).rows
            console.log(validate)

            if(validate.length == 0){

                const result = await pool.query(`INSERT INTO users (email,password,name,age,gender,bio) VALUES 
                ('${user.email}','${user.password}','${user.name}', ${user.age}, '${user.gender}','${user.bio}')`)
                return[200,{mensaje:"se agregó un nuevo usuario"}]

            }else{
                return[400,{mensaje:"El correo ya existe"}]
            }
            
            
        } catch (error) {
            console.log(error)
            return[500,error]
        }
    }

    public async logInUser(credentials:ILogInModel): Promise <any>{
        try {
            
            const validateEmail = (await pool.query(`SELECT email FROM users WHERE email = '${credentials.email}'`)).rows
            const validatePass = (await pool.query(`SELECT password FROM users WHERE email = '${credentials.email}'`)).rows[0].password.toString()
            console.log(validatePass)
            if(validateEmail.length == 0) {
                return[404,{mensaje:"El correo no existe"}]
            }
            if(await compare(credentials.password,validatePass)){
                return[200,{mensaje:"Se inició sesion correctamente"}]
            }else{
                return[400,{mensaje:"El correo o la contraseña son incorrectos"}]
            }

        } catch (error) {
            console.log(error)
            return[500,error]
        }
    }

}


export default new UserService()