const mongoose = require("mongoose");
const config = require('../src/config/config.js');

const ProductSchema = require('./models/product.model');

mongoose.connect(config.MONGO_URL) 
.then(() => console.log("Conexion exitosa"))
.catch(() => console.log("Error en la conexion"))