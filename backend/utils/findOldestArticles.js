const path = require('path');
require("dotenv").config({ path: path.join(__dirname, '..', '.env') });

const axios = require("axios");
const cheerio = require("cheerio");

const BASE_URL = "https://beyondchats.com/blogs/";
const REQUIRED_COUNT = 5;

async function getLastPageNumber() {
  const { data: html } = await axios.get(BASE_URL);
  const $ = cheerio.load(html);

  let lastPage = 1;

  $("a.page-numbers").each((_, el) => {
    const text = $(el).text().trim();
    const num = parseInt(text);

    if (!isNaN(num) && num > lastPage) {
      lastPage = num;
    }
  });

  return lastPage;
}

async function getOldestArticleLinks() {
  const articleLinks = [];
  let currentPage = await getLastPageNumber();

  console.log("Detected last page:", currentPage);

  while (articleLinks.length < REQUIRED_COUNT && currentPage >= 1) {
    const pageUrl = currentPage === 1 ? BASE_URL : `${BASE_URL}page/${currentPage}/`;

    console.log("Scraping:", pageUrl);

    const { data: html } = await axios.get(pageUrl);
    const $ = cheerio.load(html);

    $("article.entry-card").each((_, el) => {
      const link = $(el).find("a.ct-media-container").attr("href");

      if (link && !articleLinks.includes(link)) {
        articleLinks.push(link);
      }
    });

    currentPage--;
  }

  const oldestFive = articleLinks.slice(0, REQUIRED_COUNT);

  console.log("\nOldest 5 article URLs:");
  console.log(oldestFive);

  return oldestFive;
}

module.exports = {getOldestArticleLinks};