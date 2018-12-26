import mongoose from 'mongoose'

export default ()=>{
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/bonappetit', {
      useMongoClient: true});
    mongoose.connection
        .once('open', ()=>console.log('Mongodb running'))
        .on('error',err=>console.error(err))
}
