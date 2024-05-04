const express = require('express');
const router = express.Router();

const ProductManager = require("../controllers/productManager.js");
const productManager = new ProductManager("./src/models/products.json");

const CartManager = require("../controllers/cartManager.js");
const cartManager = new CartManager("./src/models/carts.json");




router.get("/", async (req, res) => {
 
  if (!req.session.login) {
      res.redirect("/login");
  } else {
      res.redirect("/profile");
  }
});

function checkUserRole(req, res, next) {
  if (req.user && req.user.role === 'usuario') {
    next(); // Si el usuario tiene el rol correcto, continúa con la siguiente función
  } else {
    res.status(403).json({ error: 'No tienes permiso para acceder a esta ruta' }); // Si no, devuelve un error de permiso
  }
}

function checkAdminRole(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    next(); // Si el usuario tiene el rol de admin, continúa con la siguiente función
  } else {
    res.status(403).json({ error: 'No tienes permiso para realizar esta acción' }); // Si no, devuelve un error de permiso
  }
}

router.get("/realtimeproducts", checkUserRole, async (req,res) => {
    try{
      const isAdmin = req.session.user.rol === "Admin";
      res.render("realtimeproducts", { user: req.session.user, isAdmin });
    } catch (error) {
     console.log("error al obtener productos");
     res.status(500).json({ error: "Error interno del servidor"});
    }
 })

 router.get('/profile', (req, res) => { 
  const isAdmin = req.session.user.rol === "admin";
  const isUser = req.session.user.rol === "usuario";
  res.render('profile', { user: req.session.user, isAdmin, isUser });
});



 router.get("/carts/:cid", async (req, res) => {
   const cartId = req.params.cid;
 
   try {
     const cart = await cartManager.getCarritoById(cartId);
     res.render("cartDetail", {cart});
   } catch (error) {
     console.error("Error al obtener el carrito", error);
     res.status(500).json({ error: "Error interno del servidor", details: error.message });
   }
 });

 router.get("/login", (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ error: "Error interno del servidor", details: error.message });
  }
 
});

router.get("/register", (req, res) => {
  try {
    res.render("register");
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ error: "Error interno del servidor", details: error.message });
  }
 
});

module.exports = router;