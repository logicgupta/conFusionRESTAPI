
const mongoose=require('mongoose');
const express=require('express');
const session=require('express-session');
const bodyParser=require('body-parser');
const User=require('../model/user');
const passport =require('passport');

var app=express();

var router=express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post('/',(req,res,next)=>{

    res.write("REDIRECT TO LOGIN");
});

router.post('/signup',(req,res)=>{

        console.log("body "+req.body);

    User.register(new User({username:req.body.username}),
    req.body.password,(err,user)=>{
        if(err){
            res.statusCode=500;
            res.setHeader('Content-Type','application/json');
            res.json({'err':err});        
        }
        else{
            passport.authenticate('local')(req,res,()=>{
                res.statusCode=200;
                res.setHeader('Content-Type','application/json');
                res.json({'success':'true','status':'Registration SuccessFull'}); 
            });
        }
        });
    });                  

router.post('/login',passport.authenticate('local'),(req,res)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('You are already Logged In !');
});

router.get('/logout',(req,res,next)=>{
    if(req.session){
        req.session.destroy();
        req.clearCookie('session-id');
        next(err);
    }
});

module.exports=router;