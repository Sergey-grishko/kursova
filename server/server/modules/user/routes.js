import {Router} from 'express';
import * as UserController from './controller';
const routes = new Router();

routes.post('/user',UserController.add)
    .get('/user', UserController.get)
    .delete('/user',UserController.del)
    .put('/user',UserController.edit);

routes.post('/user/login',UserController.auth);
routes.get('/user/current',UserController.cur);


export default routes;
