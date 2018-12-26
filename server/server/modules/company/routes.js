import {Router} from 'express';
import * as CompanyController from './controller';

const routes = new Router();

routes.post('/company', CompanyController.add)
    .put('/company', CompanyController.edit);

routes.post('/company/login', CompanyController.auth);
routes.get('/company/current', CompanyController.cur);
routes.post('/company/logo', CompanyController.logo);

export default routes;
