const mongoose=require('mongoose');
const Passport=require('passport');
const PassportLocalMongoose=require('passport-local-mongoose');
const Schema=mongoose.Schema;

const Users=new Schema({
    admin:{
        type:Boolean,
        default:false

    }
});
Users.plugin(PassportLocalMongoose);

module.exports = mongoose.model('User',Users);