import jwt from 'jsonwebtoken';
import sha1 from 'sha1';
import config from '../../config/jwtSecret';
import gmail from '../../config/gmail';
import User from './model';
import Company from '../company/model';
import nodemailer from 'nodemailer';

export const auth = async (req,res)=>{
    try{
        let body = Object.assign(req.body);
        const {email, password}= body;

        //Валідація введених полів
        if(!email || email === '') return res.status(400).json({error:true,message:'Field `email` missing'});
        if(!password || password === '') return res.status(400).json({error:true,message:'Field `password` missing'});

        // password hash
        let hashPassword = sha1(password);

        const user = await User.findOne({email:email,password:hashPassword});
        console.log(user)
        if(!user) return res.status(400).json({error:true,message:'User not exist'});

        try{
            //Генерація токена
            let token = jwt.sign({ _id: user._id, status:'user', company_id:user.company_id }, config.jwtSecret);

            return res.status(200).json({error:false,message:{token:token,user: user}})
        }catch(e){
            return res.status(400).json({error:true,message:'Cannot fetch user'})
        }
    } catch(e) {
        return res.status(400).json({error:true, message: e.message });
    }
};

export const add = async (req,res)=>{
    try{
        //Перевірка існування токена й правильності ролі
        if(req.user==null) return res.status(400).json({error:true,message:'Token not found!'});
        if(req.user.status!='company') return res.status(400).json({error:true,message:'This method only for company'});
        let token = req.user;

        let body = Object.assign(req.body);

        const {fullName, email, password}= body;

        //Валідація введених полів
        if(!fullName || fullName === '') return res.status(400).json({error:true,message:'Field `name` missing'});
        if(!email || email === '') return res.status(400).json({error:true,message:'Field `email` missing'});
        if(!password || password === '') return res.status(400).json({error:true,message:'Field `password` missing'});

        //Перевірка коректності емейлу
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!re.test(email))return res.status(400).json({error:true,message:"Email is incorrect!"});

        //Перевірка унікальності користувача
        let uniqueUser = true;
        await User.findOne({email:email,company_id:token._id}, (err,obj)=> {
            if(typeof obj != null) uniqueUser=false;
            if(obj == null) uniqueUser=true; //for the first user
        });
        if(!uniqueUser) return res.status(400).json({error:true,message:'This `email` already used'});

        //Відправка листа користувачу
        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: gmail.email,
                pass: gmail.password
            }
        });

        // setup email data with unicode symbols
        let mailOptions = {
            from:  gmail.email, // sender address
            to:email, // list of receivers
            subject: 'Lunch ✔', // Subject line
            html: '' +
            '<b>Привіт </b>'+ fullName + '<b>!</b>'+'<br>'+
            '<b>Вас добавлено в програму Lunch!!!</b>'+'<br>'+
            '<b>Email:</b>'+email+'<br>'+
            '<b>Password:</b>'+password
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
        });

        // password hash
        let hashPassword = sha1(password);

        let createdAt = Date.now();
        const newUser = new User({fullName, email, password:hashPassword, company_id:token._id, createdAt:createdAt, active:true});

        try{
            return res.status(201).json({error:false,message: await newUser.save()})
        }catch(e){
            return res.status(e.status).json({error:true, message:'Error with User'})
        }

    } catch(e) {
        return res.status(400).json({error:true, message: e.message });
    }
};

export const get = async (req,res)=>{
    try{
        //Перевірка існування токена й правильності ролі
        if(req.user==null) return res.status(400).json({error:true,message:'Token not found!'});
        if(req.user.status!='company') return res.status(400).json({error:true,message:'This method only for company'});
        let token = req.user;

        let users = await User.find({company_id:token._id});

        try{
            return res.status(200).json({error:false,message:users})
        }catch (e){
            return res.status(e.status).json({error:true, message:'Error with User'})
        }
    }
    catch(e){
        return res.status(e.status).json({error:true, message:e.message})
    }

};

export const del = async (req,res)=>{
    try{
        //Перевірка існування токена й правильності ролі
        if(req.user==null) return res.status(400).json({error:true,message:'Token not found!'});
        if(req.user.status!='company') return res.status(400).json({error:true,message:'This method only for company'});

        let body = Object.assign(req.body);

        const {_id}= body;

        //Валідація введених полів
        if(!_id || _id === '') return res.status(400).json({error:true,message:'`id` missing'});

        //Перевірка існування користувача в БД
        let user = await User.findOne({_id:_id});
        if(user==null)  return res.status(400).json({error:true, message:'User not exist!'})

        try{
            //Користувач стає неактивним
            return res.status(201).json({error:false,message: await User.update({_id:_id},{active:false})})
        }catch(e){
            return res.status(e.status).json({error:true, message:'Error with User'})
        }

    } catch(e) {
        return res.status(400).json({error:true, message: e.message });
    }
};

export const cur = async (req,res)=>{
    try{
        //Перевірка існування токена
        if(req.user==null) return res.status(400).json({error:true,message:'Token not defined'});
        let token = req.user;

        //Пошук даного юзера
        let currentUser = await User.findOne({_id:token._id});
        let curUser = currentUser.toObject();
        //Пошук компанії даного юзера
        let userCompany = await Company.findOne({_id:currentUser.company_id});
        let curCompany =userCompany.toObject();

        //Видалення поля company_id в інформації юзера
        delete curUser.company_id;

        //Видалення поля ownerPassword в інформації компанії
        delete curCompany.ownerPassword;

        //Інформація даного користувача з інформацією його компанії без пароля компанії
        curUser.company= curCompany;
        try{
            return res.status(201).json({error:false,message: curUser})
        }catch(e){
            return res.status(e.status).json({error:true, message:'Error with User'})
        }

    } catch(e) {
        return res.status(400).json({error:true, message: e.message });
    }
};

export const edit = async (req,res)=> {
    try {
        //Перевірка існування токена й правильності ролі
        if(req.user==null) return res.status(400).json({error:true,message:'Token not found!'});
        if(req.user.status!='company') return res.status(400).json({error:true,message:'This method only for company'});

        let body = Object.assign(req.body);
        const {_id, fullName, email, password, active}= body;

        //Валідація введених полів
        if (!_id || _id === '') return res.status(400).json({error: true, message: '`_id` missing'});
        if (!fullName || fullName === '') return res.status(400).json({error: true, message: '`fullName` missing'});
        if (!email || email === '') return res.status(400).json({error: true, message: '`email` missing'});
        if (active === undefined || active === '') return res.status(400).json({error: true, message: '`active` missing'});

        //Перевірка існування користувача
        const user = await User.findOne({_id: _id});
        if (!user)return res.status(400).json({error: true, message: 'User not exist'});

        let edit={};

        //Якщо пароль не змінюється залишаємо пароль користувача
        if (!password || password === '') edit = {fullName, email, active, password:user.password};
        else {
            //Хешування пароля
            let hashPassword = sha1(password);
            edit = {fullName, email, active, password:hashPassword};
        }

        try {
            return res.status(201).json({error: false, message: await User.update({_id: _id}, edit)})
        } catch (e) {
            return res.status(e.status).json({error: true, message: 'Error with User'})
        }
    } catch(e) {
        return res.status(400).json({error:true, message: e.message });
    }
};
