const socket = io();

socket.on("productos", (data) => {
    console.log(data);
    renderProductos(data);
});



const renderProductos= (productos) => {
    const contenedorProductos = document.getElementById("contenedorProductos");
    contenedorProductos.innerHTML = "";

    productos.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
        <p> ${item.id} </p>
        <p> ${item.title} </p>
        <p> ${item.price} </p>
        <button>eliminar</button>`;

        contenedorProductos.appendChild(card);

        card.querySelector("button").addEventListener("click", ()=>{
            eliminarProducto(item.id);
        })
    })
}

const eliminarProducto = (id) => {
    socket.emit("eliminarProducto", id);
}

document.getElementById("btnEnviar").addEventListener("click", () => {
    agregarProducto();
})

const agregarProducto = () => {
    const producto = {
        title: document.getElementById("title").value, 
        description: document.getElementById("description").value, 
        price: document.getElementById("price").value, 
        thumbnail: document.getElementById("thumbnail").value, 
        code: document.getElementById("code").value, 
        stock: document.getElementById("stock").value, 
        category: document.getElementById("category").value,  
    };

    socket.emit("agregarProducto", producto);
}

const renderCarts = (carts) => {
    const contenedorCarts = document.getElementById("contenedorCarts");
    contenedorCarts.innerHTML = "";

    carts.forEach(cart => {
        const cartCard = document.createElement("div");
        cartCard.classList.add("cart-card");

        const productList = document.createElement("ul");
        productList.classList.add("product-list");

        cart.products.forEach(product => {
            const productItem = document.createElement("li");
            productItem.innerHTML = `
                <span>${product.product.title}</span>
                <span>Precio: ${product.product.price}</span>
                <span>Cantidad: ${product.quantity}</span>
            `;
            productList.appendChild(productItem);
        });

        const total = cart.products.reduce((acc, curr) => acc + (curr.product.price * curr.quantity), 0);

        cartCard.innerHTML = `
            <h3>Carrito ID: ${cart._id}</h3>
            <h4>Total: ${total}</h4>
        `;
        cartCard.appendChild(productList);

        contenedorCarts.appendChild(cartCard);
    });
};
