const fs = require('fs');

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
        this.products = [];
        this.loadProductsFromFile();
    }

    loadProductsFromFile() {
        try {
            const data = fs.readFileSync(this.path, 'utf-8');
            this.products = JSON.parse(data);
        } catch (error) {
            this.products = [];
        }
    }

    saveProductsToFile() {
        const data = JSON.stringify(this.products, null, 2);
        fs.writeFileSync(this.path, data, 'utf-8');
    }

    addProduct(productData) {
        // Como me fijo si se completaron todos los campos
        if (!productData.title || !productData.description || !productData.price || !productData.code || !productData.stock || !productData.category) {
            console.error("Todos los campos son obligatorios.");
            return;
        }
    
        // Verifica que no se repita el Id
        if (this.products.some(product => product.code === productData.code)) {
            console.error("Ya existe un producto con el mismo código.");
            return;
        }
    
        // Obtener el último ID y generar el siguiente
        const lastProductId = this.products.length > 0 ? this.products[this.products.length - 1].id : 0;
        
        // Generar un nuevo ID único sumando 1
        let newProductId = lastProductId + 1;
        while (this.products.some(product => product.id === newProductId)) {
            newProductId++; // Incrementar hasta encontrar un ID único
        }
    
        // Crear el nuevo producto con los datos proporcionados
        const newProduct = {
            id: newProductId,
            ...productData,
            price: parseFloat(productData.price),
            stock: parseInt(productData.stock),
            thumbnail: productData.thumbnail || [],
        };
    
        // Agregar el nuevo producto
        this.products.push(newProduct);
    
        // Guardar en el archivo
        this.saveProductsToFile();
    
        console.log("Producto agregado:", newProduct);
    }
  
    async getProducts() {
      try {
        return this.products;
      } catch (error) {
        console.log("Error al leer el archivo", error);
        throw error;
      }
    }
  
    getProductById(id) {
      const product = this.products.find(product => product.id === id);
  
      if (product) {
        return product;
      } else {
        console.error("Producto no encontrado.");
      }
    }
  
    updateProduct(id, updatedFields) {
      const index = this.products.findIndex(product => product.id === id);
  
      if (index !== -1) {
        //actualiza el producto con los campos que se necesiten actualizar
        this.products[index] = {
          ...this.products[index],
          ...updatedFields,
          id: this.products[index].id, //no cambia el ID
        };
  
        this.saveProductsToFile();
        console.log("Producto actualizado:", this.products[index]);
      } else {
        console.error("Producto no encontrado.");
      }
    }
  
    deleteProduct(id) {
      const index = this.products.findIndex(product => product.id === id);
  
      if (index !== -1) {
        const deletedProduct = this.products.splice(index, 1)[0];
        this.saveProductsToFile();
        console.log("Producto eliminado:", deletedProduct);
      } else {
        console.error("Producto no encontrado.");
      }
    }
  }

  module.exports = ProductManager;