// app.js
const express = require('express');
const app = express();
const PORT = 8080;
const exphbs = require("express-handlebars");
const productRouter = require('./routes/products.router.js');
const cartRouter = require('./routes/carts.router.js');
const viewsRouter = require("./routes/views.router.js");
const socket = require("socket.io");



// Configura handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use(express.json());
const path = require('path');
app.use(express.static(path.join(__dirname, 'src', 'public')));

// Configura routes for PM and CM
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

app.use("/", viewsRouter);



const httpServer = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


const ProductManager = require("./controllers/productManager.js")
const productManager = require("./models/products.json");

const io = socket(httpServer);

io.on('connection', () => {
  console.log("un cliente se conectó");
})