const express = require('express');
const router = express.Router();

const ProductManager = require("../controllers/productManager.js");
const productManager = new ProductManager("./src/models/carts.json");



 // Traer todos lod productos
 router.get('/', async (req, res) => {
  try {
    const limit = req.query.limit;
    const products = await productManager.getProducts();

    if (limit) {
      res.json(products.slice(0, limit));
    } else {
      res.json(products);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// buscar producto por Id
router.get('/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const product = await productManager.getProductById(productId);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


   router.post("/", async (req,res) => {
    const productData = req.body;

    try{
      await productManager.addProduct(productData);
      res.status(201).json({
        message: "producto agregado exitosamente"
      });
    }catch (error){
      console.error("ERROR al agregar el prod", error);
      res.status(500).json({
        error: "error interno del servidor"
      });
    }
   });

// Actualizar producto
router.put('/:pid', (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const updatedFields = req.body;
    productManager.updateProduct(productId, updatedFields);
    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Borrar productos
router.delete('/:pid', (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    productManager.deleteProduct(productId);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


  

module.exports = router;