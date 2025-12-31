const Article = require("../models/Article"); 

async function getOriginalArticles() {
  return Article.find({ version: "original" });
}

module.exports = { getOriginalArticles };