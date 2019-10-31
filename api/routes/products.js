const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const storage = multer.diskStorage({
    destination : function(req, file, cb){
        cb(null, './uploads/');
    },
    filename : function(req, file, cb){
        cb(null, new Date().toISOString()+ "  "+file.originalname);
    }
})
const fileFilter = (req, file, cb) =>{
    // reject a file
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
    cb(null, true);
    } else {
        cb(null,  false);
    }
    
}
const upload = multer({
    storage : storage, limits : {
    fileSize : 1024*1024*5
    },
    fileFilter : fileFilter
});
router.get('/', (req,res,next) => {
    Product.find()
    .select('name price _id productImage')
    .exec()
    .then( docs => {
        const response = {
            count : docs.length,
            products: docs.map(doc =>{
                return {
                    name : doc.name,
                    price : doc.price,
                    _id : doc._id,
                    productImage: doc.productImage,
                    request : {
                        type : 'GET',
                        url : 'http://localhost:4000/products/' + doc._id
                    } 
                }
            })
        }
        res.status(200).json(response);
        // if(docs.length > 0){
        //     res.status(200).json(docs);
        // } else {
        //     res.status(404).json({
        //         message : 'No Entries Found'
        //     })
        // }
        
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    })
})

router.get('/:id', (req,res,next) => {
    const id = req.params.id;
   Product.findById(id)
   .select('name price _id productImage')
   .exec()
   .then(doc =>{
       console.log(doc);
       if(doc){
        res.status(200).json({
            product : doc,
            request : {
                type : 'GET',
                description : 'GET_ALL_PRODUCTS',
                url: 'http://localhost:4000/products'
            }
        });
       } else {
           res.status(404).json({
               message: 'No Valid Entry Found for Provided Id'
           })
       }
       
   })
   .catch(err =>{
       console.log(err);
       res.status(500).json({
           error: err
       })
   })
 })

router.post('/', checkAuth,  upload.single('productImage'), (req,res,next) => {
    console.log(req.file);
    const product = new Product({
        name : req.body.name,
        price: req.body.price,
        productImage : req.file.path
    });
    product.save().then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Created Product Successfully',
            createdProduct: {
                name : result.name,
                price : result.price,
                _id: result._id,
                productImage : result.productImage,
                request : {
                    type : 'GET',
                    url : 'http://localhost:4000/products/' + result._id
                }
            }
        })
    })
    .catch(err =>{
        console.log(err);
        res.status(400).json({
           error: err
        })
    })
   
})

router.delete('/:productId', checkAuth,  (req,res, next) =>{
    const id = req.params.productId;
    Product.remove({ _id : id})
    .exec()
    .then( result => {
        console.log(result);
        res.status(200).json({
            message : 'Product deleted',
            request : {
                type : 'POST',
                url : 'http://localhost:4000/products',
                body : {name : 'String', price : 'Number' }
            }
        });
    })
    .catch( err =>{
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
})
router.patch("/:productId", checkAuth,  (req,res,next) =>{
    const id = req.params.productId;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Product.update({ _id : id}, { $set : updateOps  })
    .exec()
    .then(result =>{
        console.log(result);
        res.status(200).json({
            message : 'Product Updated',
            request : {
                type : 'GET',
                url : 'http://localhost:4000/products/' +  id
            }
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error : err
        })
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

