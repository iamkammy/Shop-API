const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const mongoose = require('mongoose');
router.get('/', (req,res,next) => {
    res.status(200).json({
        message: 'Handling Get requests to /products',
        alert: 'Welcome to json format'
    })
})

router.post('/', (req,res,next) => {
    
    const product = new Product({
        _id : new mongoose.Schema.Types.ObjectId(),
        name : req.body.name,
        price: req.body.price
    });
    product.save().then(result => {
        console.log(result);
    })
    .catch(err =>{
        console.log(err);
    })
    res.status(200).json({
        message: 'Handling Get requests to /products',
        createdProduct: product
    })
})

router.get('/:id', (req,res,next) => {
   const id = req.params.id;
   if( id === '20'){
       res.status(200).json({   
           message : 'You discovered the special id'
       })
   }
   else{
       res.status(200).json({
           message : 'You pass normal id'
       })
   }
})


router.post('/', (req,res,next) => {
    res.status(200).json({
     message: 'Handling Post requests to /products'
    })
})


module.exports = router;





// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://<username>:<password>@node-shop-api-j1kc0.mongodb.net/admin?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

