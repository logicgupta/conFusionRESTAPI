
const mongoose=require('mongoose');
const express=require('express');
const session=require('express-session');
const bodyParser=require('body-parser');
const User=require('./user');

var app=express();

var router=express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post('/',(req,res,next)=>{

    res.write("REDIRECT TO LOGIN");
});

router.post('/signup',(req,res,next)=>{

        console.log("body "+req.body);

    User.findOne({username:req.body.username})
            .then((user)=>{

                if(user!=null){
                    console.log('User already exit');
                    err=new Error("User "+req.body.username+"Alreadsy exits");
                    err.status=404;
                    next(err);
                }
                else{
                    console.log(req.body.username);
                    return User.create({
                        username:req.body.username,
                        password:req.body.password,})
                }    
            }).then((user)=>{
                res.statusCode=200;
                res.setHeader('Content-Type','application/json');
                //req.send({status:'Registration Sucessfull',user:user});
        },(err)=>{
            next(err);
        }) .catch((err) => next(err));
});


router.post('/login',(req,res,next)=>{

    if(!req.session.user){

        var authHeaders=req.headers.authorization;
        if(!authHeaders){
            console.log('bjv');
            var err =new Error("You are not Authenticated");
            res.setHeader('WWW-Authenticate','Basic');
            err.status=403;
            return next(err);
        }
            var auth=new Buffer.from(authHeaders.split(' ')[1],'base64')
                        .toString().split(':');
            
            var username=auth[0];
            var password=auth[1];
            
            User.findOne({
                username:username}).then((user)=>{
                    if(user==null){
                        var err=new Error('User '+username+"does not exit");
                        err.status=403;
                        return next(err);
                    }
                    else if(user.password!=password){
                        var err = new Error('Your password is incorrect!');
                        err.status = 403;
                        return next(err);
                        }
                    else if(user.username==username && user.password==password){
                        console.log('Hi');
                        req.session.user='authenticated';
                        res.statusCode=200;
                        res.setHeader('Content-Type','Basic');
                        res.end('You are authenticated');
                    }
                    }).catch((err)=>next(err));             
    }
    else{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('You are already authenticated!');
    }
});

router.get('/logout',(req,res,next)=>{
    if(req.session){
        req.session.destroy();
        req.clearCookie('session-id');
        next(err);
    }
});

module.exports=router;