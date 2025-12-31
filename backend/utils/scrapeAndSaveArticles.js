const path = require('path');
require("dotenv").config({ path: path.join(__dirname, '..', '.env') });

const axios = require("axios");
const cheerio = require("cheerio");

const connectDB = require("../database.js");
const Article = require("../models/Article.js");
const { getOldestArticleLinks } = require("./findOldestArticles.js");

async function scrapeAndSaveArticles() {
  try {
    await connectDB();

    const urls = await getOldestArticleLinks();

    for (const url of urls) {
      const exists = await Article.findOne({ url });
      if (exists) {
        console.log("Skipping existing article:", url);
        continue;
      }

      const { data: html } = await axios.get(url);
      const $ = cheerio.load(html);

      const title = $("h1.elementor-heading-title").text().trim();
      const content = $("#content").text().trim();

      await Article.create({
        title,
        content,
        url
      });

      console.log("Saved:", title);
    }

    console.log("All articles processed");
  } catch (error) {
    console.error("Error in scrapeAndSaveArticles:", error);
    process.exit(1); 
  }
}

scrapeAndSaveArticles();