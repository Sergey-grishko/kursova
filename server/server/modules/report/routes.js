import {Router} from 'express';
import * as ReportController from './controller';
const routes = new Router();

routes.post('/reports',ReportController.add)
    .get('/reports',ReportController.get)
    .delete('/reports',ReportController.del)
    .put('/reports',ReportController.edit);

routes.get('/reports/:type', ReportController.reps);

export default routes;
