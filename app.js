const express=require('express');
const port =process.env.PORT || 3000;
const cors=require('cors');
const bodyparser=require('body-parser');
const jwt=require('jsonwebtoken');
const Signupdata=require('./src/model/Signupdata');
const Bookdata=require('./src/model/Bookdata');
const Authordata=require('./src/model/Authordata');
const path = require('path');
const app=express();
app.use(express.static('./dist/Frontend'));
app.use(cors());
app.use(bodyparser.json());

// signup

app.post('/api/signup',async (req,res)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Methods:GET, POST, PUT,DELETE");
       try{
           const user=req.body.user.email;
           
           const username= await Signupdata.findOne({email:user});
           
           if(username){
               res.send({mesg:false})
           }else{
               const pwd=req.body.user.password;
               const paswd= await Signupdata.findOne({password:pwd});
               if(paswd){
                   res.send({mesg:false})
               }else{
                   var item={
                       firstname:req.body.user.firstname,
                       lastname:req.body.user.lastname,
                       email:req.body.user.email,
                       password:req.body.user.password
                   }
                   var sign= Signupdata(item);
                   sign.save();
                   res.send({mesg:true})
               }
           }
           
       }catch(error){
           res.send({mesg:false})
       }
   
   })
   
// login handling

app.post('/api/login',async (req,res)=>{
    user="admin";
    password="1234";
    try {
       
    let userData=req.body;
    
    const use=userData.uname;
    const pas=userData.password;
    if(userData.uname=="admin"&&userData.password=="1234"){
        console.log(userData);
        let payload={subject:user+password}
        let token=jwt.sign(payload,'secretKey');
        console.log(token);
        res.send({mesg:token});
    }
    const username= await Signupdata.findOne({email:use});
    
    if(username.password==pas){
       
        res.send({mesg:"user"});
    }
    else{
        res.send({mesg:"notfound"});
    }
    
}
catch(error){
    res.send({mesg:"notfound"});
   }
})


//  adding new book

app.post('/api/addbook',verifyToken,(req,res)=>{
    
    res.header("Access-Control-Allow-Origin","*");
 res.header("Access-Control-Allow-Methods:GET, POST, PUT,DELETE");
 
 
    var book={
        title:req.body.title,
        author:req.body.author,
        genre:req.body.genre,
        image:req.body.image
    }
    
    var books=new Bookdata(book)
    books.save()
    res.send();
})

// adding new author

app.post('/api/addauther',verifyToken,(req,res)=>{
    
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Methods:GET, POST, PUT,DELETE");
 
 
    var author={
        name:req.body.name,
        country:req.body.country,
        genre:req.body.genre,
        image:req.body.image
    }
   
    var authors=new Authordata(author)
    authors.save()
    res.send();
})
// fetch and send books

app.get('/api/books',(req,res)=>{
    Bookdata.find()
    .then((books)=>{
        res.send(books);
    })
})
//  fetch and send authors
app.get('/api/authors',(req,res)=>{
    Authordata.find()
    .then((authors)=>{
        res.send(authors);
    })
})
//fetching data for updating author
app.get('/api/author/:id',(req,res)=>{
    const id=req.params.id;
    
    Authordata.findOne({"_id":id})
    .then((author)=>{
        res.send(author);
    })
})

// fetching data for updating book

app.get('/api/book/:id',(req,res)=>{
    const id=req.params.id;
    
    Bookdata.findOne({"_id":id})
    .then((book)=>{
        res.send(book);
    })
})

// show single book

app.get('/api/singlebook/:id',(req,res)=>{
    const id=req.params.id;
    Bookdata.findOne({_id:id})
    .then((dbook)=>{
        res.send(dbook);
    })
})

// show single author

app.get('/api/singleauthor/:id',(req,res)=>{
    const id=req.params.id;
    Authordata.findOne({_id:id})
    .then((dauthor)=>{
        res.send(dauthor);
    })
})
// update book

app.put('/api/updatebook',verifyToken,(req,res)=>{
    id=req.body._id;
    Bookdata.findByIdAndUpdate({_id:id},{$set:{
        title:req.body.title,
        author:req.body.author,
        genre:req.body.genre,
        image:req.body.image
    }},{new:true, useFindAndModify:false})
    .then(()=>{
        res.send();
    })
})

// update author

app.put('/api/updateauthor',verifyToken,(req,res)=>{
    id=req.body._id;
    Authordata.findByIdAndUpdate({_id:id},{$set:{
        name:req.body.name,
        country:req.body.country,
        genre:req.body.genre,
        image:req.body.image
    }},{new:true, useFindAndModify:false})
    .then(()=>{
        res.send();
    })
})
// delete book
app.delete('/api/deletebook/:id',verifyToken,(req,res)=>{
    id=req.params.id;
    Bookdata.findByIdAndDelete({_id:id},{new:true, useFindAndModify:false})
    .then(()=>{
        res.send();
    })
})
// delete author
app.delete('/api/deleteauthor/:id',verifyToken,(req,res)=>{
    id=req.params.id;
    Authordata.findByIdAndDelete({_id:id},{new:true, useFindAndModify:false})
    .then(()=>{
        res.send();
    })
})
 function verifyToken(req,res,next){
     if(!req.headers.authorization)
     {
         return res.status(401).send("unauthorized")
     }
     let token=req.headers.authorization.split(' ')[1]
     if(token=='null'){
        return res.status(401).send("unauthorized")
     }
     let payload=jwt.verify(token,'secretKey')
     if(!payload){
        return res.status(401).send("unauthorized")
     }
     next()
 }
 app.get('/*',function(req,res){
     res.sendFile(path.join(__dirname+'/dist/Frontend/index.html'));
 })
 app.listen(port,()=>{console.log("server ready at"+port)});
