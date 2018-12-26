import {Router} from 'express';
import * as DashboardController from './controller';
const routes = new Router();

routes.get('/dashboard',DashboardController.get);

export default routes;
