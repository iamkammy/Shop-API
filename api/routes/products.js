const express = require('express');
const router = express.Router();


router.get('/', (req,res,next) => {
    res.status(200).json({
        message: 'Handling Get requests to /products',
        alert: 'Welcome to json format'
    })
})

router.post('/', (req,res,next) => {
    const product = {
        name: req.body.name,
        price : req.body.price
    }
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