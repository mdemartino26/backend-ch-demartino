
const bcrypt = require("bcrypt"); 

const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

const isValidPassword = (password, hashedPassword) => bcrypt.compareSync(password, hashedPassword);

module.exports = {createHash, isValidPassword};