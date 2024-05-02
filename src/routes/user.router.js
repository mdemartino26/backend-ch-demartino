const express = require("express");
const router = express.Router();
const UserModel = require("../models/user.model.js");

router.post("/", async (req, res) => {
  const { first_name, last_name, email, password, age } = req.body;
  console.log(req.body);
  try {
    await UserModel.create({ first_name, last_name, email, password, age });
    res.status(200).send({ message: "Usuario creado con exito" });
  } catch (error) {
    res.status(400).send({ error: "error al crear el usuario" });
  }
});



module.exports = router;
