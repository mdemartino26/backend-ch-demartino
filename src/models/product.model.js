const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String, 
        required: true
    },
    price: {
        type: Number, 
        required: true
    },
    thumbnail: {
        type: String, 
        required: true
    }, 
    category: {
        type: String, 
        required: true
    }, 
    stock: {
        type: Number, 
        required: true
    }
});

const ProductModel = mongoose.model("products", productSchema);

module.exports = ProductModel;