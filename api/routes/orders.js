const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');
router.get('/', (req,res,next) => {
  Order.find()
  .select('product quantity _id')
  .exec()
  .then(docs =>{
      res.status(200).json({
          count : docs.length,
          orders : docs.map(doc =>{
              return {
                  _id: doc._id,
                  product : doc.product,
                  quantity: doc.quantity,
                  request :{
                      type : 'GET',
                      url : 'http://localhost:4000/orders/' + doc._id
                  }

              }
          })
          
      });
  })
  .catch(err =>{
      res.status(500).json({
          error : err
      })
  })
})

router.post('/', (req,res,next) => {
    let id = req.body.productId;
    Product.findById(id)
    .exec()
    .then(product =>{
        const order = new Order({
            product : req.body.productId,
            quantity : req.body.quantity
        });
       return order
       .save()
      
    })
    .then(result =>{
        console.log(result);
        res.status(201).json({
            message : 'Order Stored',
            createdOrder :{
                _id: result._id,
                product : result.product,
                quantity : result.quantity
            },
            request :{
                type : 'GET',
                url : 'http://localhost:4000/orders/' + result._id
            }
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        })
    })

})


module.exports = router;