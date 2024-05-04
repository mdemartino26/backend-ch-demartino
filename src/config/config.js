require('dotenv').config();

const PUERTO = process.env.PUERTO || 8080;
const MONGO_URL = process.env.MONGO_URL;
const GITHUB_CALLBACK = process.env.GITHUB_CALLBACK;
const GITHUB_CLIENTID = process.env.GITHUB_CLIENTID;
const GITHUB_CLIENTSECRET = process.env.GITHUB_CLIENTSECRET;

module.exports = {
  PUERTO,
  MONGO_URL,
  GITHUB_CALLBACK,
  GITHUB_CLIENTID,
  GITHUB_CLIENTSECRET
};