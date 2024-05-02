const express = require('express');
const router = express.Router();

const ProductManager = require("../controllers/productManager.js");
const productManager = new ProductManager("./src/models/products.json");

const CartManager = require("../controllers/cartManager.js");
const cartManager = new CartManager("./src/models/carts.json");



router.get("/", async (req,res) => {
   try{
    const productos = await productManager.getProducts();

    res.render("home", {productos: productos})
   } catch (error) {
    console.log("error al obtener productos");
    res.status(500).json({ error: "Error interno del servidor"});
   }
})

router.get("/realtimeproducts", async (req,res) => {
    try{

      res.render("realtimeproducts", { user: req.session.user });
    } catch (error) {
     console.log("error al obtener productos");
     res.status(500).json({ error: "Error interno del servidor"});
    }
 })


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