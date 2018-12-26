import  mongoose, {Schema} from 'mongoose';

const UserSchema = new Schema({
    fullName:{
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    company_id: {
        type:String,
        required:true
    },
    createdAt:{
        type:Number,
        required:true
    },
    active: {
        type: Boolean,
        required:true
    }
},{
    versionKey: false
});

export default mongoose.model('User',UserSchema);
