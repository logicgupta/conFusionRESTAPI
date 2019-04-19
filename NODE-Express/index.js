const express=require('express');
const http =require('http');
const morgan = require('morgan');
const bodyParser=require('body-parser');
const cookieParser=require('cookie-parser');
const dishrouter=require('./router');
const session=require('express-session');
const FileStore=require('session-file-store')(session);
const mongoose = require('mongoose');
const users=require('./users');
const passport=require('passport');
const authenticate=require('./sessions/authenticate');

const hostname="localhost";
const portNumber=3000;
var app=express();
app.use(morgan('dev'));
//app.use(cookieParser("1247-1554-4445-4545"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const Dishes = require('./dishes');

const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url);

connect.then((db) => {
    console.log("Connected correctly to Database"+db);
}, (err) => { console.log(err); });

app.use(session({
    name:'session-id',
    secret:'1524-4645-5646-4545',
    saveUninitialized:false,
    resave:false,
    store:new FileStore()
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + '/public'));

app.use('/',users);

function auth (req, res, next) {
    console.log(req.session);

  if(!req.user) {
      var err = new Error('You are not authenticated  !');
      err.status = 403;
      return next(err);
  }
  else {
    next();
  }
}

app.use(auth);

app.use('/Dishes',dishrouter);

app.use((req,res,next)=>{


    res.statusCode=200;
    //res.setHeader('Content-Type','text/html');
    res.end("<h1>Hello</h1>");
});
var server =http.createServer(app);

server.listen(portNumber,hostname,()=>{
    console.log("Server is runing ");
})
