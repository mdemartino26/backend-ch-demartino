const fs = require("fs").promises;

class CartManager {
    constructor(path){
        this.carts = [];
        this.path = path;
        this.lastId= 0;

        this.loadCarts(); }
    

        async loadCarts() {
            try {
                const data = await fs.readFile(this.path, "utf8");
                this.carts = JSON.parse(data);
                if (this.carts.length > 0) {
                    this.lastId = Math.max(...this.carts.map(cart => cart.id));
                }
            } catch (error) {
                if (error.code === 'ENOENT') {
                    // El archivo no existe, crea uno vacío
                    await this.saveCarts();
                } else {
                    console.error("Error al cargar carritos ", error);
                }
            }
        }

    async saveCarts() {
        await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
    }

    async createCarts() {
        try {
            const newCart = {
                id: ++this.lastId,
                products: []
            };
    
            this.carts.push(newCart);
    
            await this.saveCarts();
            return newCart;
        } catch (error) {
            console.error("Error al crear carrito", error);
            throw error; 
        }
    }

    async getCartById(cartId) {
        try{
            const cart = this.carts.find( c => c.id === cartId);

            if(!cart) {
                throw new Error(`No Existe el carrito con el id ${cartId}`);
            }
            return cart;
        }catch(error){
            console.error("Error al obtener carrito por ID ", error);
            throw error;
        }
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        const cart = await this.getCartById(cartId);
        const productExists = cart.products.find(p => p.product === productId);
    
        if (productExists) {
            productExists.quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }
    
        await this.saveCarts();
        return cart;
    }

    
    getAllCarts() {
        return this.carts;
    }

}

module.exports = CartManager;
   

