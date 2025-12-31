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


app.use(express.json());

// Auto initialization 
async function initializeData() {
  try {
    console.log('🔍 Checking if data initialization is needed...');
    
    const Article = require('./models/Article');
    const articleCount = await Article.countDocuments();
    const updatedCount = await Article.countDocuments({ version: 'updated' });
    
    if (articleCount === 0) {
      console.log('🚀 Database empty, running Phase 1 + Phase 2...');
      
      const { scrapeAndSaveArticles } = require('./utils/scrapeAndSaveArticles');
      await scrapeAndSaveArticles();
      
      const { runPhase2 } = require('./utils/improveArticlesWithAI');
      await runPhase2();
      
      console.log('✅ Data initialization complete');
      
    } else if (updatedCount === 0) {
      console.log(`⚠️ Found ${articleCount} original articles but NO updated versions!`);
      console.log('🧠 Running Phase 2 only...');
      
      const { runPhase2 } = require('./utils/improveArticlesWithAI');
      await runPhase2();
      
      console.log('✅ Phase 2 completed');
      
    } else {
      console.log(`📊 Found ${articleCount} total articles (${updatedCount} updated)`);
    }
    
  } catch (error) {
    console.error('❌ Initialization error:', error.message);
  }
}

connectDB().then(() => {
  console.log('✅ MongoDB connected, waiting before auto-init...');
  
  const waitTime = process.env.NODE_ENV === 'production' ? 30000 : 5000;
  
  setTimeout(() => {
    console.log(`🚀 Starting auto-initialization after ${waitTime/1000} seconds...`);
    initializeData().catch(err => {
      console.error('❌ Auto-initialization failed:', err.message);
    });
  }, waitTime);
});
app.use("/api/articles", articleRoutes);

app.get("/", (req, res) => {
  res.send("Backend running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);