const express = require('express'); 
const router = express.Router();
const CartManager = require("../controllers/cartManager.js");
const cartManager = new CartManager();

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
      const newCart = await cartManager.crearCarrito();
      res.json(newCart);
  } catch (error) {
      console.error("Error al crear un nuevo carrito", error);
      res.status(500).json({ error: "Error interno del servidor", details: error.message });
  }
});

// Trae el carrito por el Id
router.get("/:cid", async (req, res) => {
  const cartId = req.params.cid;

  try {
    const cart = await cartManager.getCarritoById(cartId);
    res.json(cart.products);
  } catch (error) {
    console.error("Error al obtener el carrito", error);
    res.status(500).json({ error: "Error interno del servidor", details: error.message });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  let quantity = req.body.quantity || 1;  // Cambio de const a let

  try {
    const actualizarCarrito = await cartManager.agregarProductoAlCarrito(cartId, productId, quantity);
    res.json(actualizarCarrito.products);
  } catch (error) {
    console.error("Error al agregar producto al carrito ", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});


module.exports = router;

