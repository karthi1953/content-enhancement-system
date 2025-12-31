 # Content Enhancement System
# Live Demo
Frontend: https://content-enhancement-system.vercel.app
Backend API: https://content-enhancement-system.onrender.com/api/articles

# Project Overview
This is my submission for the Full Stack Web Developer Intern assignment at BeyondChats. The system automatically scrapes, enhances, and displays blog articles.

# What I Built
# ✅ Phase 1: Scraping & Database
*Scrapes the 5 oldest articles from https://beyondchats.com/blogs/
*Stores them in MongoDB as "original" versions
*Created full CRUD API for articles

# ✅ Phase 2: AI Enhancement 
*For each article, searches Google using the article title
*Gets top 2 relevant articles from search results
*Scrapes content from those articles
*Uses Gemini AI to rewrite and improve original article
*Saves enhanced version as "updated" with citations
*Handles errors and blocked domains

# ✅ Phase 3: React Frontend 
*Fetches articles from the backend API
*Displays original and updated versions side-by-side
*Responsive design works on mobile and desktop
*Clean, professional UI

## How to Run Locally

### 1. Clone and Setup
   

git clone https://github.com/karthi1953/content-enhancement-system.git
cd content-enhancement-system
npm install

### 2. Get API Keys
You need these free API keys:

Gemini API Key: https://makersuite.google.com/app/apikey
Serper API Key: https://serper.dev
MongoDB Atlas: https://www.mongodb.com/cloud/atlas (free cluster)

### 3. Create .env file
In the main folder, create .env file:


MONGO_URI=your_mongodb_connection
GEMINI_API_KEY=your_gemini_key
SERPER_API_KEY=your_serper_key
PORT=5000

### 4. Run Backend
   
npm run dev
Backend runs on http://localhost:5000

### 6. Run Frontend

cd frontend
npm install
npm start
Frontend runs on http://localhost:3000

## How It Works - Simple Explanation

1. Server starts → Checks database
2. If empty → Scrapes 5 articles from BeyondChats
3. For each article → Searches Google → Finds 2 similar articles
4. Uses AI to rewrite → Saves improved version
5. Frontend shows both versions

## Files Structure (backend)
backend/
├── index.js                 # Main server file
├── database.js              # MongoDB connection
├── models/Article.js        # Database schema
├── routes/articleRoutes.js  # CRUD API routes
├── utils/                   # Core logic files
│   ├── scrapeAndSaveArticles.js     # Phase 1: Scraping
│   ├── improveArticlesWithAI.js     # Phase 2: AI enhancement
│   └── findOldestArticles.js        # Find 5 oldest articles
├── services/                # External service integrations
│   ├── articleService.js    # Database operations
│   ├── googleSearch.js      # Google Search API
│   ├── rewriteArticle.js    # Gemini AI integration
│   └── scrapeContent.js     # Web scraping
└── package.json

## API Endpoints
GET /api/articles - Get all articles
GET /api/articles/:id - Get specific article
POST /api/articles - Create article
PUT /api/articles/:id - Update article
DELETE /api/articles/:id - Delete article

## Deployment Details

Frontend: Deployed on Vercel
Backend: Deployed on Render
Database: MongoDB Atlas
Cron Jobs: Added to keep server warm (prevents slow first load)

## Challenges Solved

Scraping different websites - Created flexible scraping logic
API rate limits - Implemented error handling and retries
Slow server starts - Added cron jobs to keep server warm
Blocked domains - Filtered out sites like Amazon, YouTube
Content length limits - Truncated text for AI processing
