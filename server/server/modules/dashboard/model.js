import  mongoose, {Schema} from 'mongoose';

const DashboardSchema = new Schema({
    userCount:{
        type:Number,
        required:true
    },
    reportCount:{
        type:Number,
        required:true
    },
    lastFiveReports:{
        type:Array,
        required:true
    },
    lastTwoWeeksReports:{
        type:Array,
        required:true
    }
},{
    versionKey: false
});

export default mongoose.model('Dashboard',DashboardSchema);
