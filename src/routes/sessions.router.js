const express = require("express");
const router = express.Router();
const UserModel = require("../models/user.model.js");

//Login

router.post("/register", async (req,res) => {
    const {email, password} = req.body;
    try {
        const usuario = await UserModel.findOne({email: email});

        if(usuario){
            if(usuario.password === password) {
                req.session.login = true;
                req.session.user = usuario;
                res.redirect("/realtimeproducts");
            } else {
                res.status(401).send({error: "Contraseña no válida"});
            }
        } else {
            res.status(404).send({error: "Usuario no encontrado"});
        }
    } catch (error) {
        res.status(400).send({error: "Error en el login"});
    }
})



//Logout

router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error al destruir la sesión:", err);
      }
      res.redirect("/login");
    });
  });

// Registro
router.post("/login", async (req, res) => {
    const { first_name, last_name, email, password, age } = req.body;
    try {
        const newUser = new UserModel({
            first_name,
            last_name,
            email,
            password,
            age
        });

        await newUser.save();
        req.session.login = true;
        req.session.user = newUser;
        // Redirigir al usuario antes de enviar cualquier otra respuesta
        res.redirect("/realtimeproducts");

    } catch (error) {
        console.error("Error al registrar usuario:", error);
        res.status(500).send({ error: "Error interno del servidor" });
    }
});


module.exports = router;