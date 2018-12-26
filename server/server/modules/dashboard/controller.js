import User from '../user/model';
import Report from '../report/model';

export const get = async (req,res)=>{
    try{
        //Перевірка існування токена й правильності ролі
        if(req.user==null) return res.status(400).json({error:true,message:'Token not found!'});
        if(req.user.status!='company') return res.status(400).json({error:true,message:'This method only for company'});
        let token = req.user;

        let userCount = await User.count({company_id:token._id});

        //Вибір всіх користувачів даної компанії
        const users = await User.find({company_id:token._id});

        //Репорти всіх користувачів даної компанії
        let reports=[];
        for(let i = 0; i<users.length; i++){
            let value = await Report.find({user_id:users[i]._id});
            if(value.length!=0) reports = reports.concat(value)
        }

        //Кількість репортів даної компанії
        let reportCount = reports.length;

        //Сортування репортів
        reports.sort((a,b)=> {return (a.createdAt < b.createdAt) ? 1 : ((b.createdAt < a.createdAt) ? -1 : 0)});

        //Останні 5 репорті в даній компанії
        let lastFiveReports =[reports[0],reports[1],reports[2],reports[3],reports[4]];

        let days = 1000 * 60 * 60 * 24;
        let dayNow = Math.round(Date.now()/days);
        let dateNow = Date.now();
        let lastTwoWeeksReports=[];
        let reps=[], approved=[];

        for(let i=0;i<14;i++){
            reps = reports.filter((a)=>Math.round(a.createdAt/days)==dayNow);
            approved= reps.filter((a)=>a.approved==true);

            lastTwoWeeksReports.push({
                date:dateNow,
                total:reps.length,
                approved:approved.length
            });

            dateNow-=1440000;
            dayNow--;
        }

        let dashboard={
            userCount:userCount,
            reportCount:reportCount,
            lastFiveReports:lastFiveReports,
            lastTwoWeeksReports:lastTwoWeeksReports
        };

        try{
            return res.status(201).json({error:false,message: dashboard})
        }catch(e){
            return res.status(e.status).json({error:true, message:'Error with dashboard'})
        }

    } catch(e) {
        return res.status(400).json({error:true, message: e.message });
    }
};