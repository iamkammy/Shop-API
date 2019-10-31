const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

router.post('/signup', (req,res,next)=>{
    User.find({email: req.body.email})
    .exec()
    .then(user =>{
        if(user.length >= 1){
            return res.status(409).json({
                message: 'Mail Already Exists'
            });
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash)=>{
                if(err){
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    const user = new User({
                        email: req.body.email,
                        password: hash
                    })
                    user.save()
                    .then(result =>{
                        console.log(result);
                         res.status(201).json({
                             message: 'User Created'
                         })
                    })
                    .catch(err =>{
                        console.log(err);
                        res.status(500).json({
                            error: err
                        })
                    });
                }
            })
        }
    })
 

    
});

router.post('/login', (req,res,next)=>{
    let email = req.body.email;
    let password = req.body.password;
    User.find({email: email})
    .exec()
    .then(user => {
        if(user.length < 1){
            return res.status(401).json({
                message : 'Auth failed'
            })
        }
        bcrypt.compare(password, user[0].password , (err, hal)=>{
            if(err){
                return res.status(401).json({
                    message : 'Auth failed'
                })
            }
            if(hal){
             const token  = jwt.sign({
                    email: user[0].email,
                    userId : user[0]._id
                }, process.env.JWT_KEY,
                    {
                        expiresIn : "1h"
                    }
                 );
                return res.status(200).json({
                    message : 'Auth Successfull',
                    token : token
                })
            }
            res.status(401).json({
                message : 'Auth failed'
            })
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error : err
        });
    })
});

router.delete('/:userId', (req,res,next) => {
    let id = req.params.userId;
    User.remove({ _id : id})
    .exec()
    .then(result =>{
        res.status(200).json({
            message : 'User Deleted'
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error :err
        })
    })
})

module.exports = router;