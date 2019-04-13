const body_parser=require('body-parser');
const express=require('express');

const mongoose=require('mongoose');

const Dishes=require('./dishes');

const url='mongodb://localhost:27017/conFusion';
const connect=mongoose.connect(url);

connect.then((db) => {
        console.log("Connected correctly to server");
    }, (err) => { console.log(err); });

var dishRouter=express.Router();

dishRouter.use(body_parser.json());

dishRouter.route('/')
    .get((req,res,next)=>{

                        Dishes.find({}).then((dishes)=>{
                                console.log(dishes);
                                res.statusCode = 200;
                               // res.setHeader('Content-Type', 'application/json');
                                res.json(dishes);
                                res.end("Will send you dishes!");
                                
                            }, (err) => next(err))
                            .catch((err) => next(err));
         
    })
    .post((req,res,next)=>{

        Dishes.create(req.body).then((dishes)=>{
                
                res.status=200;
                res.end("Dishes are "+`${req.body.name}`);
                res.json(dishes);

        } ,(err)=>{
                console.log("Error Will posting data");
                next(err);

        }).catch((err)=>{
                next(err);

        });
            
    })
    .delete((req,res,next)=>{


        Dishes.remove({}).then((resp)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));

        res.end("Sucessfully Deleted all of the dishes");

    });


    dishRouter.route('/:dishId')
.get((req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/'+ req.params.dishId);
})
.put((req, res, next) => {
    Dishes.findByIdAndUpdate(req.params.dishId, {
        $set: req.body
    }, { new: true })
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) => {
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

    module.exports = dishRouter;
