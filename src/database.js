const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://marian:coderhouse@cluster0.x0bkb26.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0") 
.then(() => console.log("Conexion exitosa"))
.catch(() => console.log("Error en la conexion"))