// app.js
const express = require('express');
const app = express();
const PORT = 8080;
const productRouter = require('./routes/products.router.js');
const cartRouter = require('./routes/carts.router.js');




app.use(express.json());
app.use(express.static("public"));

// Configura routes for PM and CM
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
  res.send('Bienvenido a mi aplicación Express');
});