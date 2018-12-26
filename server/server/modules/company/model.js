import  mongoose, {Schema} from 'mongoose';

const CompanySchema = new Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    logo:{
        type:String
    },
    imageQuality:{
        type:String,
        required:true
    },
    ownerEmail: {
        type:String,
        required:true
    },
    ownerPassword:{
        type:String,
        required:true
    },
    active: {
        type:Boolean,
        required:true
    },
    createdAt:{
        type:Number,
        required:true
    },
    language:{
        type:String,
        required:true
    },
    totalSpace: {
      type: Number,
      required: true,
    },
    useSpace: {
      type: Number,
      required: true,
    }
},{
    versionKey: false
});

export default mongoose.model('Company',CompanySchema);
