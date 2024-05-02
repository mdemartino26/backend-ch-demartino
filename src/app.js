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
const MongoStore = require("connect-mongo");
const session = require('express-session'); 
const userRouter = require("./routes/user.router.js");
const sessionRouter = require("./routes/sessions.router.js");
const UserModel = require("./models/user.model.js");


// Configura handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("./src/public"));
app.use(session({
  secret: "secretcoder",
  resave: true,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: "mongodb+srv://marian:coderhouse@cluster0.x0bkb26.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0",
    ttl: 100
  })
}));

// Configura routes for PM and CM
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

app.use("/", viewsRouter);

app.get("/login", (req,res) =>{
  let usuario = req.query.usuario;

  req.session.usuario = usuario;
  res.send("Guardamos el usuario por medio de query");
})

app.get("/usuario", (req, res) => {
  if(req.session.usuario) {
    return res.send(`El usuario registrado es el siguiente: ${req.session.usuario}`);
  }
})

app.use("/api/users", userRouter);
app.use("/api/sessions", sessionRouter);



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
    io.socket.emit('carts', carts);
  })

  socket.on("agregarProducto", async (producto) => {
    await productManager.addProduct(producto);
    io.sockets.emit("productos", await productManager.getProducts());
  })
})

