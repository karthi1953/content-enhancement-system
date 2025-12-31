require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./database");
const articleRoutes = require("./routes/articleRoutes");

const app = express();

app.use(cors({
  origin: "*",  
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.options('*', cors());

app.use(express.json());

// Auto initialization 
async function initializeData() {
  try {
    console.log('Checking if data initialization is needed...');
    
    const Article = require('./models/Article');
    const articleCount = await Article.countDocuments();
    
    if (articleCount === 0) {
      console.log('Running Phase 1: Article scraping...');
      
      const { scrapeAndSaveArticles } = require('./utils/scrapeAndSaveArticles');
      await scrapeAndSaveArticles();
      
      console.log('Running Phase 2: AI enhancement...');
      
      const { runPhase2 } = require('./utils/improveArticlesWithAI');
      await runPhase2();
      
      console.log('Data initialization complete');
    } else {
      console.log(`Found ${articleCount} articles, skipping initialization`);
    }
  } catch (error) {
    console.error('Initialization error:', error.message);
  }
}

connectDB().then(() => {
  if (process.env.NODE_ENV === 'production') {
    setTimeout(initializeData, 10000);
  }
});
app.use("/api/articles", articleRoutes);

app.get("/", (req, res) => {
  res.send("Backend running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);