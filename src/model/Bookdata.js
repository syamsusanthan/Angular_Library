const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://userone:userone@syamsfile.jor9c.mongodb.net/LIBRARY?retryWrites=true&w=majority',{useNewUrlParser:true, useUnifiedTopology:true});
const Schema = mongoose.Schema;
const BookSchema=new Schema({
    title:String,
    author:String,
    genre:String,
    image:String
});
var Bookdata=mongoose.model('bookdata',BookSchema);
module.exports=Bookdata;