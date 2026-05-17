import {register, login} from './authService';
import {registerSchema, loginSchema} from './authSchemas';
import {FastifyInstance} from 'fastify';

export default function authRoutes(app: FastifyInstance) {
    app.post('/register',{
     schema: registerSchema
    }, register)

    app.post('/login',{
        schema: loginSchema
       }, login)    
}
        


