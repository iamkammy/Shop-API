const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name : String,
    price : Number,
    additional : {}
});

module.exports = mongoose.model('Product', productSchema);