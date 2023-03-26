require("dotenv").config(); 
module.exports = {
  env: {
    PINATA_KEY: process.env.PINATA_KEY,
    PINATE_SECRET: process.env.PINATE_SECRET,
  },
};