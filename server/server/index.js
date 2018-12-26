import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import jwt from 'express-jwt';
import config from './config/jwtSecret';
import {
    CompanyRoutes,
    UserRoutes, ReportRoutes,
    DashboardRoutes
} from './modules';
import dbConfig from './config/db';

const fileUpload = require('express-fileupload');
import * as middlewares from './config/middlewares';

const app = express();

dbConfig();

app.use(cors());
app.use(fileUpload());
app.use('/images', express.static(__dirname + '/../images'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan('dev'));
app.use(middlewares.verify);
app.use(
    [
        CompanyRoutes,
        UserRoutes, ReportRoutes,
        DashboardRoutes
    ]);
app.use(middlewares.error404);
app.use(jwt({secret: config.jwtSecret}));

const PORT = process.env.PORT || 65059;

app.listen(PORT, err => {
    if (err) {
        console.error(err);
    } else {
        console.log('App listen to port: ' + PORT)
    }
});
