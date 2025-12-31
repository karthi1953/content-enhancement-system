# Content Enhancement System

## Live Demo
Frontend: https://content-enhancement-system.vercel.app  
Backend API: https://content-enhancement-system.onrender.com/api/articles  

---

## Project Overview
This project is my submission for the Full Stack Web Developer Intern assignment at BeyondChats.  
The system automatically scrapes, enhances, and displays blog articles.

---

## What I Built

### Phase 1: Scraping and Database
- Scrapes the 5 oldest articles from https://beyondchats.com/blogs/
- Stores them in MongoDB as original versions
- Implements a full CRUD API for articles

---

### Phase 2: AI Enhancement
- Searches Google using the article title
- Fetches the top 2 relevant articles from search results
- Scrapes content from those articles
- Uses Gemini AI to rewrite and improve the original article
- Saves the enhanced version as updated with citations
- Handles blocked domains and scraping errors

---

### Phase 3: React Frontend
- Fetches articles from the backend API
- Displays original and updated versions side by side
- Responsive design for mobile and desktop
- Clean and professional UI

---

## How to Run Locally

### 1. Clone and Setup
```bash
git clone https://github.com/karthi1953/content-enhancement-system.git
cd content-enhancement-system
npm install
```

---

### 2. Get API Keys
Gemini API Key: https://makersuite.google.com/app/apikey  
Serper API Key: https://serper.dev  
MongoDB Atlas: https://www.mongodb.com/cloud/atlas  

---

### 3. Create .env File
Create a `.env` file in the root folder:

```env
MONGO_URI=your_mongodb_connection
GEMINI_API_KEY=your_gemini_key
SERPER_API_KEY=your_serper_key
PORT=5000
```

---

### 4. Run Backend
```bash
npm run dev
```
Backend runs on:
http://localhost:5000

---

### 5. Run Frontend
```bash
cd frontend
npm install
npm start
```
Frontend runs on:
http://localhost:3000

---

## How It Works
1. Server starts and checks the database
2. If the database is empty, it scrapes 5 articles from BeyondChats
3. For each article, it searches Google and finds 2 similar articles
4. AI rewrites and improves the content and saves the updated version
5. The frontend displays both versions

---

## Backend File Structure
```
backend/
├── index.js
├── database.js
├── models/
│   └── Article.js
├── routes/
│   └── articleRoutes.js
├── utils/
│   ├── scrapeAndSaveArticles.js
│   ├── improveArticlesWithAI.js
│   └── findOldestArticles.js
├── services/
│   ├── articleService.js
│   ├── googleSearch.js
│   ├── rewriteArticle.js
│   └── scrapeContent.js
└── package.json
```

---

## API Endpoints
- GET /api/articles
- GET /api/articles/:id
- POST /api/articles
- PUT /api/articles/:id
- DELETE /api/articles/:id

---

## Deployment Details
Frontend: Vercel  
Backend: Render  
Database: MongoDB Atlas  
Cron Jobs: Used to keep the server warm and avoid cold starts

---

## Challenges Solved
- Implemented flexible scraping logic for different websites
- Handled API rate limits using retries and error handling
- Reduced cold start delays using cron jobs
- Filtered blocked domains such as Amazon and YouTube
- Truncated content to fit AI processing limits
