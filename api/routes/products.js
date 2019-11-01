const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
// product controller
const ProductController = require('../controllers/products');

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

router.get('/', ProductController.get_all_products);

router.get('/:id', ProductController.get_product);

router.post('/', checkAuth,  upload.single('productImage'), ProductController.create_product);

router.delete('/:productId', checkAuth, ProductController.delete_product);

router.patch("/:productId",  checkAuth, ProductController.update_product);

module.exports = router;

// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://<username>:<password>@node-shop-api-j1kc0.mongodb.net/admin?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

