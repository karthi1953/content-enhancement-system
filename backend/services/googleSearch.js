const path = require('path');
require("dotenv").config({ path: path.join(__dirname, '..', '.env') });

const axios = require("axios");

async function searchTopArticles(query) {
  const response = await axios.post(
    "https://google.serper.dev/search",
    { q: query },
    {
      headers: {
        "X-API-KEY": process.env.SERPER_API_KEY,
        "Content-Type": "application/json"
      }
    }
  );

  // Get first 2 organic results
  return response.data.organic.map(result => result.link);
}

module.exports = { searchTopArticles };