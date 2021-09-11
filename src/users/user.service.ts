//imports
import pool from "../database/pstg"

//clase con los metodos

class UserService {
    
    
    public async createUser(email:string,password:string,name:string,age:number,gender:string,bio:string):Promise<any>{
        try {
            const result = (await pool.query(`INSERT INTO users VALUES (default,'${email}','${password}','${name}',${age},'${gender}','${bio}')`)).rows
            return[200,{mensaje:"se agregó un nuevo usuario"}]
        } catch (error) {
            return[500,error]
        }
    }

}


export default new UserService()