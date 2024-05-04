const ProductModel = require("../models/product.model.js");

class ProductManager {
  async addProduct({
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
    category,
  }) {
    try {
      if (
        !title ||
        !description ||
        !price ||
        !thumbnail ||
        !code ||
        !stock ||
        !category
      ) {
        console.log("todos los campos son obligatorios");
        return;
      }

      const existeProducto = await ProductModel.findOne({ code: code });

      if (existeProducto) {
        console.log("El codigo debe ser unico");
        return;
      }

      const nuevoProducto = new ProductModel({
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        category,
      });

      await nuevoProducto.save();
    } catch (error) {
      console.error("error al agregar un producto ", error);
      throw error;
    }
  }

  async getProducts() {
    try {
      const productos = await ProductModel.find();
      return productos; 
    } catch (error) {
      console.error("error al buscar un producto ", error);
      throw error;
    }
  }

  async getProductById(id) {
    try {
      const producto = await ProductModel.findById(id);
      if (!producto) {
        console.log("Producto no encontrado");
        return null;
      }
      return producto; 
    } catch (error) {
      console.error("error al buscar un producto por id ", error);
      throw error;
    }
  }

  async updateProduct(id, productoActualizado){
    try {
      const updateProduct = await ProductModel.findByIdAndUpdate(id, productoActualizado);

      if (!updateProduct) {
        console.log("Producto no encontrado");
        return null;
      }

      console.log("producto Actualizado");
      return updateProduct;

    } catch (error) {
       console.error("error al actualizar producto ", error);
      throw error;
    }
  }

  async deleteProduct(id) {
    console.log(id);
    try {
      const deleteProduct = await ProductModel.findByIdAndDelete(id);

      if(!deleteProduct){
        console.log("Producto no eliminado");
        return null; 
      }

      console.log("producto eliminado");
      return deleteProduct;
    } catch (error) {
      console.error("error al eliminar producto ", error);
      throw error;
    }
  }
}


module.exports = ProductManager;