const express = require('express'); 
const router = express.Router();
const CartManager = require("../controllers/cartManager.js");
const cartManager = new CartManager("./src/models/carts.json");

// Trae todos los carritos
router.get("/", (req, res) => {
  try {
    const allCarts = cartManager.getAllCarts();
    res.json(allCarts);
  } catch (error) {
    console.error("Error al obtener todos los carritos", error);
    res.status(500).json({ error: "Error interno del servidor", details: error.message });
  }
});

// Crea nuevo carrito
router.post("/", async (req, res) => {
  try {
      const newCart = await cartManager.createCarts();
      res.json(newCart);
  } catch (error) {
      console.error("Error al crear un nuevo carrito", error);
      res.status(500).json({ error: "Error interno del servidor", details: error.message });
  }
});

// Trae el carrito por el Id
router.get("/:cid", async (req, res) => {
  const cartId = parseInt(req.params.cid);

  try {
    const cart = await cartManager.getCartById(cartId);
    res.json(cart.products);
  } catch (error) {
    console.error("Error al obtener el carrito", error);
    res.status(500).json({ error: "Error interno del servidor", details: error.message });
  }
});


module.exports = router;
