//imports
import jwt from "jsonwebtoken";

//clase

class Jwt {
  
  public createJwt(body:any) {
    try {
      const token = jwt.sign(
        {
          data: body
        },
        'llave secreta',
        { algorithm: "HS256" }
      );
      

      return token
      
    } catch (error) {
      return error
    }
  }

  public verifyJwt(token:any) {

    try {
      const decoded:any = jwt.verify(token.replace('Bearer ', ''), 'llave secreta');
      console.log(decoded.data.email)
      return decoded.data.email
    } catch (error) {
      return error;
    }
  }
}

export default new Jwt();