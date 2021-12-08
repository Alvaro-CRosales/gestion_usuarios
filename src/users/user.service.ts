//imports
import pool from "../database/pstg"
import { ILogInModel, IUserModel, IListModel } from "./user.interface"
import { hash, compare } from 'bcrypt'
import jwt from '../helpers/jwt'


//clase con los metodos

class UserService {


    public async createUser(user: IUserModel): Promise<any> {
        try {
            user.password = await hash(user.password, 10);
            const validate = (await pool.query(`SELECT email FROM public.user WHERE email = '${user.email}'`)).rows
            console.log(validate)

            if (validate.length == 0) {

                const result = await pool.query(`INSERT INTO public.user (email,password,name ) VALUES 
                ('${user.email}','${user.password}','${user.name}')`)
                return [200, { mensaje: "se agregó un nuevo usuario" }]

            } else {
                return [400, { mensaje: "El correo ya existe" }]
            }


        } catch (error) {
            console.log(error)
            return [500, error]
        }
    }

    public async logInUser(credentials: ILogInModel, body: any): Promise<any> {
        try {

            const validateEmail = (await pool.query(`SELECT email FROM public.user WHERE email = '${credentials.email}'`)).rows
            const validatePass = (await pool.query(`SELECT password FROM public.user WHERE email = '${credentials.email}'`)).rows[0].password.toString()
            console.log(validatePass)

            if (validateEmail.length == 0) {
                return [404, { mensaje: "El correo no existe" }]
            }
            if (await compare(credentials.password, validatePass)) {
                const token = await jwt.createJwt(body)
                console.log(token)
                return [200, { mensaje: "Se inició sesion correctamente", token }]
            } else {
                return [400, { mensaje: "El correo o la contraseña son incorrectos" }]
            }

        } catch (error) {
            console.log(error)
            return [500, error]
        }
    }
    public async getItems(token: any, priority: any, task: any, description: any): Promise<any> {



        try {

            const decoded = jwt.verifyJwt(token)
            if (decoded.length > 0) {

                let filter = `SELECT l.name as TAREA, l.description as descripcion,p.name as Prioridad,u.email as USUARIO from ((public.list as l
                INNER JOIN public.priority as p ON l.priority_id = p.id)
                INNER JOIN public.user as u ON l.user_id = u.id) WHERE u.email = '${decoded}'`

                if (priority) filter += ` AND p.id= '${priority}'`

                if (task) filter += ` AND l.name LIKE '%${task}%'`

                if (description) filter += ` AND l.description LIKE '%${description}%'`

                const list = (await pool.query(filter)).rows

                return [200, { mensaje: "funciona", list }]
            }else{
                return[400,{mensaje:"El token no es valido"}]
            }


        } catch (error) {
            console.log(error)
            return [500, error]
        }
    }

    public async createItems(list: IListModel,token:any): Promise<any> {

        try {
            const decoded = jwt.verifyJwt(token)
            const id = (await pool.query(`SELECT id FROM public.user WHERE email= '${decoded}'`)).rows[0]
            
            await pool.query(`INSERT INTO public.list (name,description,priority_id,user_id) VALUES('${list.name}','${list.description}',${list.priority_id},${id.id})`)
            return [200, { mensaje: "se agregó una nueva tarea" }]
        } catch (error) {
            console.log(error)

            return [500, error]
        }

    }
}


export default new UserService()