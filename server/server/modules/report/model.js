import  mongoose, {Schema} from 'mongoose';

const ReportsSchema = new Schema({
    user_id: {
        type:String,
        required:true
    },
    comment:{
        type:String,
        default:'',
    },
    image:{
        type:String,
        required:true
    },
    approved: {
        type: Boolean,
        required:true
    },
    createdAt:{
        type:Number,
        required:true
    },
    date:{
        type:Number,
        required:true
    }
},{
    versionKey: false
});

export default mongoose.model('Report',ReportsSchema);
