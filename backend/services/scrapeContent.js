const path = require('path');
require("dotenv").config({ path: path.join(__dirname, '..', '.env') });
const axios = require("axios");
const cheerio = require("cheerio");

async function scrapeText(url) {
  try {
    const { data: html } = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const $ = cheerio.load(html);
    return $("body").text().replace(/\s+/g, " ").trim().substring(0, 5000);
  } catch (error) {
    throw new Error(`Scraping failed for ${url}: ${error.message}`);
  }
}

module.exports = { scrapeText };