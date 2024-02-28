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