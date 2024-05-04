const dotenv = require("dotenv");
const program = require("../utils/commander.js");

dotenv.config({
    path: program.mode === "produccion" ? "./.env.produccion" : "./.env.desarrollo"
});

const config = {
    MONGO_URL: process.env.MONGO_URL,
    PUERTO: process.env.PUERTO || 8080,
    GITHUB_CALLBACK: process.env.GITHUB_CALLBACK,
    GITHUB_CLIENTID: process.env.GITHUB_CLIENTID,
    GITHUB_CLIENTSECRET: process.env.GITHUB_CLIENTSECRET
};

module.exports = config;

