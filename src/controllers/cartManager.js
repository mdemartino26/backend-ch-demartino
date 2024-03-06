const CartModel = require("../models/cart.model.js");

class CartManager {

    async crearCarrito(){
        try{
            const nuevoCarrito = new CartModel({products: []});
            await nuevoCarrito.save();
            return nuevoCarrito;
        } catch (error){
            console.log("Error al crear carrito nuevo ", error);
            throw error; 
        }
    }

    async getCarritoById(cartId) {
        try {
            const carrito = await CartModel.findById(cartId);

            if (!carrito) {
                console.log("no hay carrito con ese ID");
                return null;
            }

            return carrito;

        } catch (error) {
            console.log("Eror al obtener carrito por ID ", error);
            throw error; 
        }
    }

    async agregarProductoAlCarrito(cartId, productId, quantity = 1 ){
        try {
            const carrito = await this.getCarritoById(cartId);
            const existeProducto = carrito.products.find(item => item.product.toString() === productId);

            if(existeProducto){
                existeProducto.quantity += quantity;
            }else{
                carrito.products.push({ product: productId, quantity});
            }

            carrito.markModified("products");

            await carrito.save();
            return carrito;
        } catch (error) {
            console.log("error al agregar producto ", error);
            throw error;
        }
    }

    async getAllCarts() {
        try {
            const carts = await CartModel.find().populate('products.product');
            return carts;
        } catch (error) {
            console.error("Error al obtener todos los carritos: ", error);
            throw error;
        }
    }

}

module.exports = CartManager;