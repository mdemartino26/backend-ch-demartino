const express = require("express");
const router = express.Router();
const UserModel = require("../models/user.model.js");
const { createHash, isValidPassword } = require("../utils/utils.js");
const passport = require("passport");

//Login

router.post("/register", async (req,res) => {
    const {email, password} = req.body;
    let rol = "usuario"; // Establecer rol predeterminado como "usuario"

    if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
        rol = "admin"; // Establecer rol como "admin" para el usuario administrador
    }
    
    try {
        // Valida si el usuario es el administrador
        if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
            // Crear un objeto de usuario con el rol de administrador
            const adminUser = {
                email: "adminCoder@coder.com",
                password: "adminCod3r123",
                rol: "admin"
            };
            // Establece la sesión del usuario administraor
            req.session.login = true;
            req.session.user = adminUser;
            res.redirect("/realtimeproducts");
        } else {
            // Busca al usuario en la base de datos
            const usuario = await UserModel.findOne({email: email});
            if(usuario){
                if(isValidPassword(password, usuario.password)) {
                    req.session.login = true;
                    req.session.user = usuario;
                    res.redirect("/realtimeproducts");
                } else {
                    res.status(401).send({error: "Contraseña no válida"});
                }
            } else {
                res.status(404).send({error: "Usuario no encontrado"});
            }
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
            password: createHash(password),
            age,
            rol: "usuario"
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

router.get("/github", passport.authenticate("github", {scope: ["user:email"]}), (req,res) => {
})

router.get("/githubcallback", passport.authenticate("github", {failureRedirect: "/login"}), async (req, res) => {
    req.session.user = req.user;
    req.session.login = true;
    res.redirect("/realtimeproducts")
})

module.exports = router;