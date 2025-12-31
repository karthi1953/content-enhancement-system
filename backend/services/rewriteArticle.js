const path = require('path');
require("dotenv").config({ path: path.join(__dirname, '..', '.env') });

const axios = require("axios");

async function rewriteArticle(original, ref1, ref2) {
  // Truncate content to stay within token limits
  const truncatedOriginal = original.substring(0, 3000);
  const truncatedRef1 = ref1.substring(0, 2000);
  const truncatedRef2 = ref2.substring(0, 2000);
  
  const prompt = `
You are an expert article rewriter. Rewrite the original article using insights from the two reference articles.

ORIGINAL ARTICLE:
${truncatedOriginal}

REFERENCE 1:
${truncatedRef1}

REFERENCE 2:
${truncatedRef2}

INSTRUCTIONS:
1. Keep the core message and main points
2. Improve clarity, flow, and readability
3. Incorporate relevant insights from the references
4. Maintain similar length and structure
5. Output ONLY the rewritten article text, no explanations or markdown
`;

  const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`;
  
  console.log("Calling Gemini 2.5 Flash Lite...");
  console.log(`Prompt length: ${prompt.length} chars`);
  
  try {
    const response = await axios.post(
      apiUrl,
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000,
        }
      },
      {
        timeout: 30000,
        headers: { 'Content-Type': 'application/json' }
      }
    );

    const result = response.data.candidates[0].content.parts[0].text;
    console.log(`Rewrite successful! Length: ${result.length} chars`);
    return result;
    
  } catch (error) {
    console.error("Gemini API Error:");
    console.error(`Status: ${error.response?.status}`);
    console.error(`Error: ${error.response?.data?.error?.message || error.message}`);
    
    throw new Error(`Gemini rewrite failed: ${error.response?.data?.error?.message || error.message}`);
  }
}

module.exports = { rewriteArticle };