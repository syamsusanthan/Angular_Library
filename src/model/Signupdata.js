const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://userone:userone@syamsfile.jor9c.mongodb.net/LIBRARY?retryWrites=true&w=majority',{useNewUrlParser:true, useUnifiedTopology:true});
const Schema = mongoose.Schema;
const SignupSchema=new Schema({
    firstname:String,
    lastname:String,
    email:String,
    password:String
});
var Signupdata=mongoose.model('signupdata',SignupSchema);
module.exports=Signupdata;