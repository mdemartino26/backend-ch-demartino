// app.js
const express = require('express');
const app = express();
const PORT = 8080;
const exphbs = require("express-handlebars");
const productRouter = require('./routes/products.router.js');
const cartRouter = require('./routes/carts.router.js');
const viewsRouter = require("./routes/views.router.js");
const socket = require("socket.io");
require("./database.js");


// Configura handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use(express.json());

//Middleware
app.use(express.static("./src/public"));

// Configura routes for PM and CM
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

app.use("/", viewsRouter);



const httpServer = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


const ProductManager = require("./controllers/productManager.js");
const productManager = new ProductManager("./src/models/products.json");

const io = socket(httpServer);

io.on('connection', async(socket) => {
  console.log("un cliente se conectó");
  
  const products = await productManager.getProducts();
  socket.emit("productos", products);

  socket.on("eliminarProducto", async (id) => {
    await productManager.deleteProduct(id);

    io.sockets.emit("productos", await productManager.getProducts());
    io.socket.emit("carts", carts);
  })

  socket.on("agregarProducto", async (producto) => {
    await productManager.addProduct(producto);
    io.sockets.emit("productos", await productManager.getProducts());
  })
})

