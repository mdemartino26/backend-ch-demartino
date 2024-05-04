const express = require('express');
const router = express.Router();

const ProductManager = require("../controllers/productManager.js");
const productManager = new ProductManager();



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
  const productId = req.params.pid;
  try {
  
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


router.get('/', async (req, res) => {
  try {
    let { limit, page, sort, query } = req.query;

    // Establecer valores por defecto si no se proporcionan en la consulta
    limit = parseInt(limit) || 10;
    page = parseInt(page) || 1;
    sort = sort === 'asc' ? 1 : sort === 'desc' ? -1 : null;
    query = query || {};

    // Realizar la búsqueda de productos según los parámetros
    const products = await productManager.getProducts({
      limit,
      page,
      sort,
      query
    });

    // Calcular el total de páginas
    const totalProducts = await productManager.getProductsCount(query);
    const totalPages = Math.ceil(totalProducts / limit);

    // Construir la respuesta
    const response = {
      status: 'success',
      payload: products,
      totalPages: totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
      page: page,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevLink: page > 1 ? `/?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
      nextLink: page < totalPages ? `/?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null
    };

    res.json(response);
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
    const productId = req.params.pid;
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
    const productId = req.params.pid;
    productManager.deleteProduct(productId);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


  

module.exports = router;