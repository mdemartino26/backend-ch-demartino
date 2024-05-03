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
const passport = require("passport");
const GitHubStrategy = require('passport-github2').Strategy;
const initializePassport = require('./config/passport.config.js');
const User = require("./models/user.model.js");
const { generateToken, verifyToken } = require("./utils/jwt.js");


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
  const user = { id: 1, username: "usuario" };
  const token = generateToken(user);
  res.json({ token });
})

app.get("/usuario", (req, res) => {
  if(req.session.usuario) {
    return res.send(`El usuario registrado es el siguiente: ${req.session.usuario}`);
  }
  const user = { id: 1, username: "usuario" };
  const token = generateToken(user);
  res.json({ token });
})

app.get("/realtimeproducts", verifyToken, (req, res) => {
  // La ruta solo es accesible si el token es válido
  res.json({ message: "Acceso autorizado" });
});

app.use("/api/users", userRouter);
app.use("/api/sessions", sessionRouter);

app.use(passport.initialize());
app.use(passport.session());

// Configurar estrategia de autenticación de Passport para GitHub

app.use(session({
  clientID: "Iv23li3YKCih451lxMbY",
  clientSecret: "8b09b6d8159421a3def9e8a9dba6bdc4c2b7d1c6",
  callbackURL: "http://localhost:8080/api/sessions/githubcallback"
}));
app.use(passport.initialize());
app.use(passport.session());

// Configurar las rutas de autenticación
app.get('/auth/github', passport.authenticate('github'));

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Autenticación exitosa, redirigir a la página principal o donde corresponda
    res.redirect('/');
  });


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

initializePassport(passport);