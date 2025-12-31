const path = require('path');
require("dotenv").config({ path: path.join(__dirname, '..', '.env') });

const { getOriginalArticles } = require("../services/articleService");
const { searchTopArticles } = require("../services/googleSearch");
const { scrapeText } = require("../services/scrapeContent");
const { rewriteArticle } = require("../services/rewriteArticle");
const Article = require("../models/Article");
const connectDB = require("../database");

// Domains that block scraping
const BLOCKED_DOMAINS = [
  "amazon.",
  "flipkart.",
  "youtube.",
  "linkedin.",
  "quora.",
  "reddit."
];

function isBlocked(url) {
  return BLOCKED_DOMAINS.some(domain => url.includes(domain));
}  

async function runPhase2() {
  try {
    await connectDB();

    const originalArticles = await getOriginalArticles();
  
    for (const article of originalArticles) {
      console.log("\nProcessing article:", article.title);
  
      // Skip if already updated
      const alreadyUpdated = await Article.findOne({
        url: article.url,
        version: "updated"
      });
      if (alreadyUpdated) {
        console.log("Already updated, skipping");
        continue;
      }
  
      // Search for reference articles
      const references = await searchTopArticles(article.title);
      console.log("Raw references:", references);
  
      // Filter blocked domains
      const safeReferences = references.filter(ref => !isBlocked(ref));
  
      if (safeReferences.length < 2) {
        console.log("Skipping (not enough safe references)");
        continue;
      }
  
      try {
        // Scrape reference contents
        let scrapedContents = [];
        let usedReferences = [];
        
        for (const reference of safeReferences) {
          try {
            const text = await scrapeText(reference);
            if (text && text.length > 100) {
              scrapedContents.push(text);
              usedReferences.push(reference);
              console.log(`Successfully scraped: ${reference}`);
            } else {
              console.log(`Skipping ${reference} - insufficient content`);
            }
          } catch (error) {
            console.log(`Failed to scrape ${reference}: ${error.message}`);
          }
          
          if (scrapedContents.length === 2) break;
        }
        
        if (scrapedContents.length < 2) {
          console.log(`Skipping "${article.title}" (could not scrape 2 references)`);
          continue;
        }
        
        const [reference1, reference2] = scrapedContents;
        
        // Rewrite article using LLM
        const updatedContent = await rewriteArticle(
          article.content,
          reference1,
          reference2
        );
  
        console.log("Rewritten content length:", updatedContent.length);
  
        // Save updated version
        await Article.create({
          title: article.title,
          content: updatedContent,
          url: article.url,
          version: "updated",
          references: usedReferences
        });
  
        console.log("Updated article saved:", article.title);
      } catch (error) {
        console.log("Error processing article, skipping:", error.message);
        continue;
      }
    }
  
    console.log("\nPhase 2 processing complete");
  
    
  } catch (error) {
    console.error("Phase 2 failed:", error);
    throw error; 
  }
}

runPhase2().catch(error => {
  console.error("Script failed:", error);
  process.exit(1);
});