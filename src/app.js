// app.js
const express = require('express');
const app = express();
const PORT = 8080;
const exphbs = require("express-handlebars");
const productRouter = require('./routes/products.router.js');
const cartRouter = require('./routes/carts.router.js');


// Configura handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use(express.json());
app.use(express.static("public"));

// Configura routes for PM and CM
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
  res.render('index', {title: "hola"});
});

//const socket = require("socket.io");

//const io = socket(PORT);

//io.on("connection", (socket) => {
 // console.log("un cliente se conectó conmigo");

//  socket.on("mensaje", (data) => {
//    console.log(data);
//  })
//})