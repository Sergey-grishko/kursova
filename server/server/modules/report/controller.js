import fs from 'fs';
import Report from './model';
import User from '../user/model';
import Company from '../company/model';
import Jimp from "jimp";

export const add = async (req,res)=>{
    try{
        //Перевірка існування токена й правильності ролі
        if(req.user==null) return res.status(400).json({error:true,message:'Token not found!'});
        if(req.user.status!='user') return res.status(400).json({error:true,message:'This method only for user'});
        let token = req.user;

        let body = Object.assign(req.body);
        const {date,comment}= body;

        //Валідація введених полів
        if(!req.files || !req.files.image) return res.status(400).json({error:true,message:'Picture is missing'});
        if(['image/png', 'image/jpg', 'image/jpeg'].indexOf(req.files.image.mimetype) < 0)
            return res.status(400).json({error:true,message:'Wrong file format use png, jpg or jpeg!'});
        if(!date || date === '')return res.status(400).json({error:true,message:'`date` missing'});

        //Перевірка існування папки images на сервері
        if(!fs.existsSync('./images')) fs.mkdirSync('./images');

        //Формування назви на шляху до файлу
        let dir = 'images/'+token._id;
        let file = Date.now() + req.files.image.name;
        let path = dir+'/' + file;
        //Компанія даного юзера
        let company = await Company.findOne({_id:token.company_id});
        let useSpace = company.useSpace;
        let size = 0;
        if(useSpace >= company.totalSpace) throw new Error('Free disk space has expired. Contact your manager.')

        //Перевірка папки для файлу на сервері
        if(!fs.existsSync(dir)) fs.mkdirSync(dir);
        //Завантаження картинки на сервер та збереження даних в БД
        req.files.image.mv(path, async (e) => {
            if(e) return res.status(400).json({ error: e.message });

            //Зміна якості зображення взалежності від побажань компанії
            if(company.imageQuality !== 'high'){
              Jimp.read(path, function (err, image) {
                  if (err) throw err;

                  switch(company.imageQuality) {
                      case 'medium':
                        image = image.quality(50)
                        break;
                      case 'low':
                        image = image.quality(10)
                        break;
                      default:
                        image = image.quality(10)
                        break;
                  }

                  image.write(path);
              });
            }

            // вес картинки
            const stats = fs.statSync(path);
            useSpace += stats.size / 1000000.0; // bytes to megabytes

            try{
                let createdAt = Date.now();
                let report = {
                    user_id: token._id,
                    comment:comment,
                    image: `${token._id}/${file}`,
                    createdAt:createdAt,
                    date:date,
                    approved:false
                };
                let newReport = new Report(report);
                await Company.update({_id:token.company_id},{useSpace}) // update Company
                newReport.save()
                return res.status(201).json({error:false,message: newReport})
            } catch(e) {
                return res.status(e.status).json({error:true, message:'Error with Report'})
            }
        });


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

        //Вибір всіх користувачів даної компанії
        const users = await User.find({company_id:token._id});

        //Репорти всіх користувачів даної компанії
        let reports=[];
        for(let i = 0; i<users.length; i++){
            let value = await Report.find({user_id:users[i]._id});
            if(value.length!=0) reports = reports.concat(value)
        }

        let params = req.query;
        //Перевірка існування параметрів
        if (Object.keys(params).length != 0) {
            //Фільтер по id користувачу
            if(params.hasOwnProperty('user_id')){
                reports = reports.filter((value)=>{
                    return value.user_id==params.user_id
                })
            }
            //Фільтер по параметрам from й to одночасно
            if(params.hasOwnProperty('from')&&params.hasOwnProperty('to')) {
                reports = reports.filter((value) => {
                    return value.createdAt >= params.from && value.createdAt <= params.to
                })
            }else{
                //Фільтер тільки по from
                if(params.hasOwnProperty('from'))
                    reports = reports.filter((value) => {return value.createdAt >= params.from})
                //Фільтер тільки по to
                if(params.hasOwnProperty('to'))
                    reports = reports.filter((value) => {return value.createdAt <= params.to})
            }
        }
        try{
            return res.status(200).json({error:false,message:reports})
        }catch (e){
            return res.status(e.status).json({error:true, message:'Error with report'})
        }
    }
    catch (e){
        return res.status(400).json({error:true, message: e.message });
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

        const report = await Report.findOne({_id:_id});

        if(!report)return res.status(400).json({error:true,message:'report not exist'});

        //Видалення картинки з сервера
        let path= 'images/'+report.image;
        fs.unlinkSync(path);

        let company = await Company.findOne({ _id: req.user._id })
        const stats = fs.statSync(path);
        company.useSpace -= stats.size / 1000000.0; // convert bytes to megabytes

        try{
            await Report.remove({_id:_id});
            await Company.update({_id:req.user._id},{useSpace: company.useSpace}) // update Company
            return res.status(200).json({error:false,message:'report deleted'})
        }catch (e){
            return res.status(e.status).json({error:true, message:'Error with report'})
        }
    }
    catch (e){
        return res.status(400).json({error:true, message: e.message });
    }
};

export const edit = async (req,res)=>{
    try{
        //Перевірка існування токена й правильності ролі
        if(req.user==null) return res.status(400).json({error:true,message:'Token not found!'});
        if(req.user.status!='company') return res.status(400).json({error:true,message:'This method only for company'});

        //console.log('user', req.user);

        let body = Object.assign(req.body);
        const {_id,category_id, comment,approved}= body;

        //Валідація введених полів
        if(!_id || _id === '') return res.status(400).json({error:true,message:'`id` missing'});
        if(approved === undefined || approved === '') return res.status(400).json({error:true,message:'`approved` missing'});
        if(!comment || comment === '') return res.status(400).json({error:true,message:'`comment` missing'});
        if(!category_id || category_id === '') return res.status(400).json({error:true,message:'`category_id` missing'});

        const report = await Report.findOne({_id:_id});

        if(!report)return res.status(400).json({error:true,message:'report not exist'});

        let editReport={
            approved:approved,
            category_id:category_id,
            comment:comment
        }

        try{
            return res.status(201).json({error:false,message: await Report.update({_id:_id},editReport)})
        }catch (e){
            return res.status(e.status).json({error:true, message:'Error with report'})
        }
    }
    catch (e){
        return res.status(400).json({error:true, message: e.message });
    }
};

export const reps = async (req,res)=>{
    try{
        //Перевірка існування токена й правильності ролі
        if(req.user==null) return res.status(400).json({error:true,message:'Token not found!'});
        if(req.user.status!='company') return res.status(400).json({error:true,message:'This method only for company'});
        let token = req.user;

        const {type} = req.params;

        //Тип експорту
        if(type!='xls' && type!='csv') return res.status(400).json({error:true,message:'Incorrect type!'});

        //Вибір всіх користувачів даної компанії
        const users = await User.find({company_id:token._id});

        //Репорти всіх користувачів даної компанії
        let reports=[];
        for(let i = 0; i<users.length; i++){
            let value = await Report.find({user_id:users[i]._id});
            if(value.length!=0) reports = reports.concat(value)
        }
        if(reports.length==0)return res.status(400).json({error:true,message:'report not exist'});

        let params = req.query;
        //Перевірка існування параметрів
        if (Object.keys(params).length != 0) {
            //Фільтер по id користувачу
            if(params.hasOwnProperty('user_id')){
                reports = reports.filter((value)=>{
                    return value.user_id==params.user_id
                })
            }
            //Фільтер по параметрам from й to одночасно
            if(params.hasOwnProperty('from')&&params.hasOwnProperty('to')) {
                reports = reports.filter((value) => {
                    return value.createdAt >= params.from && value.createdAt <= params.to
                })
            }else{
                //Фільтер тільки по from
                if(params.hasOwnProperty('from'))
                    reports = reports.filter((value) => {return value.createdAt >= params.from})
                //Фільтер тільки по to
                if(params.hasOwnProperty('to'))
                    reports = reports.filter((value) => {return value.createdAt <= params.to})
            }
        }

        //Перевірка існування папки reports на сервері
        if(!fs.existsSync('./reports')) fs.mkdirSync('./reports');

        //Формування назви файлу
        let d = Date.now();
        let fileName='./reports/BidOnLunch_'+d+'.'+type;

        //Формування файлу
        let writeStream = fs.createWriteStream(fileName);
        let data='';
        for (let i = 0; i < reports.length; i++) {
            let user = await User.findOne({_id:reports[i].user_id});
            data+='User:'+'\t'+user.fullName+'\t'+'Email:'+'\t'+user.email+
                '\t'+'ReportId:'+'\t'+reports[i]._id+'\t'+
                'Approved'+'\t'+reports[i].approved+'\n';
        }
        writeStream.write(data);
        writeStream.close();

        try{
            return res.download(fileName);
        }catch (e){
            return res.status(e.status).json({error:true, message:'Error with report'})
        }
    }
    catch (e){
        return res.status(400).json({error:true, message: e.message });
    }
};
