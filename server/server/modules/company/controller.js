import jwt from 'jsonwebtoken';
import sha1 from 'sha1';
import config from '../../config/jwtSecret';
import Company from './model';
import fs from 'fs';

export const auth = async (req, res) => {
    try {
        let body = Object.assign(req.body);

        const {ownerEmail, ownerPassword} = body;

        //Валідація введених полів
        if (!ownerEmail || ownerEmail === '') return res.status(400).json({
            error: true,
            message: 'Field `email` missing'
        });
        if (!ownerPassword || ownerPassword === '') return res.status(400).json({
            error: true,
            message: 'Field `password` missing'
        });

        //Хешування пароля
        let hashPassword = sha1(ownerPassword);

        const company = await Company.findOne({ownerEmail: ownerEmail, ownerPassword: hashPassword});

        //Перевірка існування компанії
        if (!company) return res.status(400).json({error: true, message: 'Company not exist'});

        try {
            //Генерація токена
            let token = jwt.sign({_id: company._id, status: 'company'}, config.jwtSecret);
            return res.status(200).json({error: false, message: {token: token, company: company}})
        } catch (e) {
            return res.status(400).json({error: true, message: 'Cannot fetch user'})
        }
    } catch (e) {
        return res.status(400).json({error: true, message: e.message});
    }
}

export const add = async (req, res) => {
    try {
        let body = Object.assign(req.body);
        const {name, description, logo, imageQuality, ownerEmail, ownerPassword, active, language} = body;

        //Валідація введених полів
        if (!name || name === '') return res.status(400).json({error: true, message: 'Field `name` missing'});
        if (!description || description === '') return res.status(400).json({
            error: true,
            message: 'Field `description` missing'
        });
        if (!logo || logo === '') return res.status(400).json({error: true, message: 'Field `logo` missing'});
        if (!imageQuality || imageQuality === '') return res.status(400).json({
            error: true,
            message: 'Field `imageQuality` missing'
        });
        if (!ownerEmail || ownerEmail === '') return res.status(400).json({
            error: true,
            message: 'Field `email` missing'
        });
        if (!ownerPassword || ownerPassword === '') return res.status(400).json({
            error: true,
            message: 'Field `password` missing'
        });
        if (!active || active === '') return res.status(400).json({error: true, message: 'Field `active` missing'});
        if (!language || language === '') return res.status(400).json({
            error: true,
            message: 'Field `language` missing'
        });

        //Перевірка коректності imageQuality
        if (!['high', 'medium', 'low'].includes(imageQuality))
            return res.status(400).json({
                error: true,
                message: 'Field `imageQuality` not correct (high, medium or low)'
            });

        //Перевірка коректності емейлу
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(ownerEmail)) return res.status(400).json({error: true, message: "Email is incorrect!"});

        //Перевірка унікальності компанії по емейлу
        let uniqueCompany = true;
        await Company.findOne({ownerEmail: ownerEmail}, (err, obj) => {
            if (typeof obj != null) uniqueCompany = false;
            if (obj == null) uniqueCompany = true; //for the first company
        });
        if (!uniqueCompany) return res.status(400).json({error: true, message: 'This `email` already used'});

        //Хешування пароля
        let hashPassword = sha1(ownerPassword);

        let createdAt = Date.now();
        const newCompany = new Company({
            name,
            ownerEmail,
            ownerPassword: hashPassword,
            description,
            logo,
            imageQuality,
            active,
            createdAt: createdAt,
            language,
            totalSpace: 256,
            useSpace: 0
        });

        try {
            return res.status(201).json({error: false, message: await newCompany.save()})
        } catch (e) {
            return res.status(e.status).json({error: true, message: 'Error with Company'})
        }

    } catch (e) {
        return res.status(400).json({error: true, message: e.message});
    }
};


export const cur = async (req, res) => {
    try {
        //Перевірка існування токена й правильності ролі
        if (req.user == null) return res.status(400).json({error: true, message: 'Token not found!'});
        if (req.user.status != 'company') return res.status(400).json({
            error: true,
            message: 'This method only for company'
        });
        let token = req.user;

        let currentCompany = await Company.findOne({_id: token._id});
        let curCompany = currentCompany.toObject();

        try {
            return res.status(201).json({error: false, message: curCompany})
        } catch (e) {
            return res.status(e.status).json({error: true, message: 'Error with Company'})
        }

    } catch (e) {
        return res.status(400).json({error: true, message: e.message});
    }
};

export const edit = async (req, res) => {
    try {
        //Перевірка існування токена й правильності ролі
        console.log(req.user);
        if (req.user == null) return res.status(400).json({error: true, message: 'Token not found!'});
        if (req.user.status !== 'company') return res.status(400).json({
            error: true,
            message: 'This method only for company'
        });

        let body = Object.assign(req.body);

        const {_id, name, description, logo, imageQuality, ownerEmail, ownerPassword, active} = body;

        //Валідація введених полів
        if (!_id || _id === '') return res.status(400).json({error: true, message: '`_id` missing'});
        if (!name || name === '') return res.status(400).json({error: true, message: '`name` missing'});
        if (!description || description === '') return res.status(400).json({
            error: true,
            message: '`description` missing'
        });
        if (!logo || logo === '') return res.status(400).json({error: true, message: '`logo` missing'});
        if (!imageQuality || imageQuality === '') return res.status(400).json({
            error: true,
            message: '`imageQuality` missing'
        });
        if (!ownerEmail || ownerEmail === '') return res.status(400).json({
            error: true,
            message: '`ownerEmail` missing'
        });
        if (!active || active === '') return res.status(400).json({error: true, message: '`active` missing'});

        let edit = {name, description, logo, imageQuality, ownerEmail, ownerPassword, active};

        if (!ownerPassword || ownerPassword === '') {
            delete edit.ownerPassword;
        } else {
            edit.ownerPassword = sha1(edit.ownerPassword);
        }

        const company = await Company.findOne({_id: _id});
        if (!company) return res.status(400).json({error: true, message: 'Company not exist'});

        try {
            return res.status(201).json({error: false, message: await Company.update({_id: _id}, edit)})
        } catch (e) {
            return res.status(e.status).json({error: true, message: 'Error with Company'})
        }
    }
    catch (e) {
        return res.status(400).json({error: true, message: e.message});
    }
};

export const logo = async (req, res) => {
    try {
        //Перевірка існування токена й правильності ролі
        if (req.user == null) return res.status(400).json({error: true, message: 'Token not found!'});
        if (req.user.status != 'company') return res.status(400).json({
            error: true,
            message: 'This method only for company'
        });

        let body = Object.assign(req.body);
        const {_id} = body;

        //Валідація введених полів
        if (!_id || _id === '') return res.status(400).json({error: true, message: '`_id` missing'});
        if (!req.files || !req.files.logo) return res.status(400).json({error: true, message: 'Picture is missing'});
        if (['image/png', 'image/jpg', 'image/jpeg'].indexOf(req.files.logo.mimetype) < 0)
            return res.status(400).json({error: true, message: 'Wrong file format use png, jpg or jpeg!'});

        //Перевірка існування компанії
        const company = await Company.findOne({_id: _id});
        if (!company) return res.status(400).json({error: true, message: 'Company not exist'});

        //Перевірка існування папки logo на сервері
        if (!fs.existsSync('./logo')) fs.mkdirSync('./logo');

        //Формування назви на шляху до файлу
        let dir = 'logo/' + _id;
        let file = Date.now() + req.files.logo.name;
        let path = dir + '/' + file;

        //Перевірка папки для файлу на сервері
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);

        //Завантаження logo на сервер та збереження даних в БД
        req.files.logo.mv(path, async (e) => {
            if (e) return res.status(400).json({error: e.message});

            try {
                return res.status(201).json({error: false, message: await Company.update({_id: _id}, {logo: path})})
            } catch (e) {
                return res.status(e.status).json({error: true, message: 'Error with Company'})
            }
        });
    }
    catch (e) {
        return res.status(400).json({error: true, message: e.message});
    }
};
