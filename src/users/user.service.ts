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
            const validate = (await pool.query(`SELECT email FROM public.user WHERE email = '${user.email}'`)).rows[0]

            if (!validate) {

                const result = await pool.query(`INSERT INTO public.user (email,password,name,rol_id ) VALUES 
                ('${user.email}','${user.password}','${user.name}',2)`)
                return [200, { mensaje: "se agregó un nuevo usuario" }]

            } else {
                return [400, { mensaje: "El correo ya existe" }]
            }


        } catch (error) {
            console.log(error)
            return [500, error]
        }
    }

    public async logInUser(credentials: ILogInModel): Promise<any> {
        try {

            const validateEmail = (await pool.query(`SELECT email FROM public.user WHERE email = '${credentials.email}'`)).rows
          
            if (validateEmail.length === 0) {
                return [404, { mensaje: "El correo no existe" }]
            }
            
            const validatePass = (await pool.query(`SELECT password FROM public.user WHERE email = '${credentials.email}'`)).rows[0].password.toString()

            if (await compare(credentials.password, validatePass)) {
                const token = await jwt.createJwt(credentials)
                console.log(token)
                return [200, { mensaje: "Se inició sesion correctamente", token }]
            } else {
                return [400, { mensaje: "la contraseña es incorrecta" }]
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

                let filter = `SELECT u.name as USUARIO,r.name as ROL,l.name as TAREA, l.description as DESCRIPCION, p.name FROM ((((public.rel_user_list AS rul
                    INNER JOIN public.user as u ON rul.user_id = u.id)
                    INNER JOIN public.list as l ON rul.list_id = l.id)
                    INNER JOIN public.rol as r ON rul.rol_id = r.id)
                    INNER JOIN public.priority as p ON l.priority_id = p.id) WHERE u.email = '${decoded}'`

                if (priority) filter += ` AND p.id= '${priority}'`

                if (task) filter += ` AND l.name LIKE '%${task}%'`

                if (description) filter += ` AND l.description LIKE '%${description}%'`

                const list = (await pool.query(filter)).rows

                return [200, { mensaje: "funciona", list }]

            } else {
                return [400, { mensaje: "El token no es valido" }]
            }


        } catch (error) {
            console.log(error)
            return [500, error]
        } 


        
    }

    public async createItems(list: IListModel, token: any): Promise<any> {

        try {

            const decoded = jwt.verifyJwt(token)

            if (decoded.length > 0) {

                const id = (await pool.query(`SELECT id FROM public.user WHERE email= '${decoded}'`)).rows[0]
                

                const item = (await pool.query(`INSERT INTO public.list (name,description,priority_id) VALUES('${list.name}','${list.description}',${list.priority_id}) RETURNING id`)).rows[0].id
                

                await pool.query(`INSERT INTO public.rel_user_list (list_id,user_id,rol_id) VALUES(${item},${id.id},4)`)


                return [200, { mensaje: "se agregó una nueva tarea" }]
            } else {
                return [400, { mensaje: "El token no es valido" }]
            }



        } catch (error) {
            console.log(error)

            return [500, error]
        }

    }

    public async updateItems(list: IListModel, token: any, list_id: any): Promise<any> {


        try {

            const decoded = jwt.verifyJwt(token)

            if (decoded.length > 0) {

                const { id } = (await pool.query(`SELECT id FROM public.user WHERE email= '${decoded}'`)).rows[0]

                const result = (await pool.query(`SELECT list_id, user_id FROM public.rel_user_list WHERE user_id = ${id} AND list_id=${list_id}`)).rows[0]

                if (result) {
                    await pool.query(`UPDATE public.list SET name='${list.name}',description='${list.description}',priority_id=${list.priority_id} WHERE id=${list_id}`)
                    return [200, { mensaje: "Se actualizó la tarea exitosamente" }]
                }else{
                    return[400, {mensaje:"esa tarea no existe"}]
                }

                
            } else {
                return [400, { mensaje: "El token no es valido" }]
            }


        } catch (error) {
            console.log(error)
            return [500, error]
        }

    }

    public async deleteItems(token: any, list_id: any): Promise<any> {
        
        //agregar el que los colaboradores no puedan eliminar una tarea

        try {
            const decoded = jwt.verifyJwt(token)

            

            if (decoded.length > 0) {
                
                const { id } = (await pool.query(`SELECT id FROM public.user WHERE email= '${decoded}'`)).rows[0]
                
                const result = (await pool.query(`SELECT list_id, user_id FROM public.rel_user_list WHERE user_id = ${id} AND list_id=${list_id}`)).rows[0]
                

                if(result) {

                    await pool.query(`DELETE FROM public.list WHERE id = ${list_id}`)
            

                    return [200, { mensaje: "Se eliminó la tarea exitosamente" }]

                }else{
                    return [400, { mensaje: "Esa tarea no existe" }]
                }

                
            } else {
                return [400, { mensaje: "El token no es valido" }]
            }
        } catch (error) {
            return[500,error]
        }
    }

    public async addCollab(token:any,list:any, body:any): Promise<any>{

        try {

            const decoded = jwt.verifyJwt(token)

            if(decoded.length > 0 ){

                const { id } = (await pool.query(`SELECT id FROM public.user WHERE email= '${decoded}'`)).rows[0];

                const {list_name,user_name} = (await pool.query(`SELECT l.name AS list_name, u.name as user_name FROM ((rel_user_list rul
                    INNER JOIN public.user u on u.id = rul.user_id)
                    INNER JOIN public.list l on l.id= rul.list_id) WHERE u.id=${id} AND l.id = ${list} AND rul.rol_id = 4`)).rows[0];
                
                const {user_id} =  (await pool.query(`SELECT id as user_id FROM public.user WHERE email='${body}'`)).rows[0]
                const verify = (await pool.query(`SELECT * FROM public.rel_user_list WHERE user_id = ${user_id} AND list_id = ${list}`)).rows[0]

                if(verify){
                    return[200,{mensaje: "el usuario ya está colaborando"}]
                }

                if(user_name){
                    
                    const description = `${user_name} te ha invitado a colaborar en la siguiente tarea:${list_name}`
                    
                    

                    await pool.query(`INSERT INTO public.notifications (description,list_id,user_id,status_id) VALUES('${description}',${list},${user_id},6) `)

                    

                    return[200,{mensaje:"Se envió la solicitud"}]

                }else{

                    return[400,{mensaje:"Acceso denegado"}]

                }

            }else{
                return [400, { mensaje: "El token no es valido" }]
            }



        } catch (error) {
            return[500,error]
        }
    }

    public async getNotifications(token:any): Promise<any>{
        try {

            const decoded = jwt.verifyJwt(token)

            if(decoded){

                const { id } = (await pool.query(`SELECT id FROM public.user WHERE email= '${decoded}'`)).rows[0];
                
                const result = (await pool.query(`SELECT description FROM public.notifications WHERE user_id=${id} AND status_id=6`)).rows[0]
               
                if(result){
                   
                    return[200,{mensaje:"Tus notificaciones",result}]
                   
                    
                }else{
                    return[200,{mensaje:"No tienes ninguna notificación"}]
                    

                }

            
            }else{

                return[400,{mensaje:"el token no es valido"}]

            }


        } catch (error) {
            console.log(error)

            return [500, error]
        }
    }

    public async updateNotification(token:any,status_id:any,list:any): Promise<any>{
        
        try {

            const decoded = jwt.verifyJwt(token)

            if (decoded) {

                console.log("funciona")

                const { id } = (await pool.query(`SELECT id FROM public.user WHERE email= '${decoded}'`)).rows[0];

                const verify = (await pool.query(`SELECT id FROM public.notifications WHERE user_id=${id} AND list_id=${list}`)).rows[0];

                if(verify) {

                    const statusId = (await pool.query(`UPDATE public.notifications SET status_id=${status_id} WHERE list_id = ${list} RETURNING status_id`)).rows[0].status_id

                    if(statusId === 4){
                        await pool.query(`INSERT INTO public.rel_user_list (list_id, user_id, rol_id) VALUES (${list}, ${id},3) `)
                        return[200,{mensaje:"Se actualizó el estatus"}]
                    }

                    if(statusId === 5){
                        return[200,{mensaje:"Se actualizó el estatus"}]
                    }

                    

                }else{

                    return[400,{mensaje:"ocurrió un error"}]

                }

                
                

            }else{
                return[400,{mensaje:"Token no valido"}]
            }
            
        } catch (error) {
            return[500,error]
        }
    }

    //comentario para que me de otro día activo en github, hoy no hay aninmos de nada
}


export default new UserService()