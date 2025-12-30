
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./ArticleComparision.css";

const ArticleComparison = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = "http://localhost:5000"; 
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/articles`);
        setArticles(response.data);
        setLoading(false);
      } catch (err) {
        setError(`Failed to load articles from ${API_URL}. Please check if backend is running.`);
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Group articles by URL
  const articleGroups = {};
  articles.forEach(article => {
    if (!articleGroups[article.url]) {
      articleGroups[article.url] = {
        original: null,
        updated: null,
        title: article.title,
        url: article.url
      };
    }
    
    if (article.version === 'original') {
      articleGroups[article.url].original = article;
    } else if (article.version === 'updated') {
      articleGroups[article.url].updated = article;
    }
  });

  const pairedArticles = Object.values(articleGroups);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading articles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (pairedArticles.length === 0) {
    return (
      <div className="empty-state">
        <h2>No Articles Found</h2>
        <p>No articles have been scraped yet. Please run Phase 1 first.</p>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="header">
        <h1>BeyondChats Content Improvement System</h1>
        <p className="subtitle">AI-Powered Article Enhancement Dashboard</p>
        <div className="stats">
          <span className="stat">
            <strong>{pairedArticles.length}</strong> Articles
          </span>
          <span className="stat">
            <strong>{pairedArticles.filter(p => p.updated).length}</strong> Improved
          </span>
          <span className="stat">
            <strong>{pairedArticles.filter(p => !p.updated).length}</strong> Pending
          </span>
        </div>
      </header>

      <main className="main-content">
        {pairedArticles.map((pair, index) => (
          <article key={index} className="article-comparison">
            <div className="article-header">
              <div className="article-title-section">
                <h2>{pair.title}</h2>
                <a href={pair.url} target="_blank" rel="noopener noreferrer" className="original-link">
                  Original Article
                </a>
              </div>
              
              <div className={`status-indicator ${pair.updated ? 'improved' : 'pending'}`}>
                {pair.updated ? ' AI-Improved' : ' Pending Improvement'}
              </div>
            </div>

            <div className="comparison-section">
              {/* Original Article Column */}
              <div className="column original-column">
                <div className="column-header">
                  <h3>Original Content</h3>
                  <span className="badge">Original</span>
                </div>
                <div className="content-card">
                  <div className="content-scroll">
                    {pair.original?.content || 'Content not available'}
                  </div>
                  <div className="metadata">
                    <p><strong>Source:</strong> BeyondChats Blog</p>
                    <p><strong>Scraped:</strong> {pair.original?.createdAt ? new Date(pair.original.createdAt).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Updated Article Column */}
              <div className="column improved-column">
                <div className="column-header">
                  <h3>{pair.updated ? 'AI-Improved Content' : 'Pending Improvement'}</h3>
                  {pair.updated && <span className="badge improved">AI-Enhanced</span>}
                </div>
                
                <div className="content-card">
                  {pair.updated ? (
                    <>
                      <div className="content-scroll">
                        {pair.updated.content}
                      </div>
                      
                      {pair.updated.references && pair.updated.references.length > 0 && (
                        <div className="references-section">
                          <h4>Reference Articles Used:</h4>
                          <p className="reference-description">
                            These sources were used to improve the article's content and formatting:
                          </p>
                          <ul className="reference-list">
                            {pair.updated.references.map((ref, idx) => (
                              <li key={idx}>
                                <a href={ref} target="_blank" rel="noopener noreferrer" className="reference-link">
                                  Source {idx + 1}: {new URL(ref).hostname}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <div className="metadata">
                        <p><strong>Improved:</strong> {new Date(pair.updated.createdAt).toLocaleDateString()}</p>
                        <p><strong>AI Model:</strong> Gemini 2.5 Flash Lite</p>
                        <p><strong>References:</strong> {pair.updated.references?.length || 0} sources</p>
                      </div>
                    </>
                  ) : (
                    <div className="pending-message">
                      <div className="pending-icon"></div>
                      <h4>Article Queued for AI Enhancement</h4>
                      <p>This article will be improved using:</p>
                      <ul>
                        <li>Google Search for top-ranking articles</li>
                        <li>Content analysis of reference materials</li>
                        <li>AI-powered rewriting for better SEO and readability</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </article>
        ))}
      </main>

      <footer className="footer">
        <p>BeyondChats Intern Assignment • Content Improvement System</p>
        <p className="tech-stack">
          Built with: React • Node.js • Express • MongoDB • Gemini AI • Google Search API
        </p>
      </footer>
    </div>
  );
};

export default ArticleComparison;