const express = require('express'); 
const router = express.Router();
const CartManager = require("../controllers/cartManager.js");
const cartManager = new CartManager();

// Trae todos los carritos
router.get("/", async (req, res) => {
  try {
    const allCarts = await cartManager.getAllCarts();
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

// Trae todos los carritos con productos completos
router.get("/", async (req, res) => {
  try {
    const allCarts = await cartManager.getAllCarts();
    res.json({ carts: carts });
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

// Trae el carrito por el Id con productos completos
router.get("/:cid", async (req, res) => {
  const cartId = req.params.cid;

  try {
    const cart = await cartManager.getCarritoByIdPopulated(cartId);
    res.json(cart.products);
  } catch (error) {
    console.error("Error al obtener el carrito", error);
    res.status(500).json({ error: "Error interno del servidor", details: error.message });
  }
});

// Agrega producto al carrito
router.post("/:cid/product/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  let quantity = req.body.quantity || 1;

  try {
    const actualizarCarrito = await cartManager.agregarProductoAlCarrito(cartId, productId, quantity);
    res.json(actualizarCarrito.products);
  } catch (error) {
    console.error("Error al agregar producto al carrito ", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Elimina producto del carrito
router.delete("/:cid/products/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;

  try {
    const actualizarCarrito = await cartManager.eliminarProductoDelCarrito(cartId, productId);
    res.json(actualizarCarrito.products);
  } catch (error) {
    console.error("Error al eliminar producto del carrito ", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Actualiza el carrito con un arreglo de productos
router.put("/:cid", async (req, res) => {
  const cartId = req.params.cid;
  const products = req.body.products;

  try {
    const actualizarCarrito = await cartManager.actualizarCarrito(cartId, products);
    res.json(actualizarCarrito.products);
  } catch (error) {
    console.error("Error al actualizar el carrito ", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Actualiza la cantidad de ejemplares del producto en el carrito
router.put("/:cid/products/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity;

  try {
    const actualizarCarrito = await cartManager.actualizarCantidadProducto(cartId, productId, quantity);
    res.json(actualizarCarrito.products);
  } catch (error) {
    console.error("Error al actualizar la cantidad de ejemplares del producto ", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Elimina todos los productos del carrito
router.delete("/:cid", async (req, res) => {
  const cartId = req.params.cid;

  try {
    const actualizarCarrito = await cartManager.eliminarTodosLosProductosDelCarrito(cartId);
    res.json(actualizarCarrito.products);
  } catch (error) {
    console.error("Error al eliminar todos los productos del carrito ", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});


module.exports = router;

