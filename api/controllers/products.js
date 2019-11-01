const Product = require('../models/product');

exports.get_all_products = (req,res,next) => {
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
}

exports.get_product = (req,res,next) => {
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
 }

exports.create_product = (req,res,next) => {
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
   
}

exports.delete_product = (req,res, next) =>{
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
}

exports.update_product = (req,res,next) =>{
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
}