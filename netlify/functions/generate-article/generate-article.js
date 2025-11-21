// netlify/functions/generate-article.js
const fetch = require("node-fetch");

exports.handler = async (event, context) => {
  const path = event.path;
  const articleId = path
    .split("/")
    .pop()
    .replace(".html", "")
    .replace("article-", "");

  if (!articleId) {
    return serveDefaultTemplate();
  }

  try {
    // Fetch article from Firebase
    const article = await fetchArticleFromFirebase(articleId);

    if (article) {
      return serveArticleTemplate(article, articleId);
    } else {
      return serveDefaultTemplate();
    }
  } catch (error) {
    console.error("Error fetching article:", error);
    return serveDefaultTemplate();
  }
};

async function fetchArticleFromFirebase(articleId) {
  const url = `https://firestore.googleapis.com/v1/projects/nguvuza-uvira/databases/(default)/documents/news/${articleId}`;

  const response = await fetch(url);
  if (!response.ok) return null;

  const data = await response.json();
  return data;
}

function serveArticleTemplate(articleData, articleId) {
  const fields = articleData.fields || {};

  const title = fields.title?.stringValue || "Article - Nguvu Za Uvira Radio";
  const content = fields.content?.stringValue || "";
  const excerpt = content.substring(0, 160) + "...";

  // Get image (prioritize first image from images array, then single image)
  let image = "";
  const images = fields.images?.arrayValue?.values || [];
  if (images.length > 0) {
    image = images[0].stringValue || "";
  } else {
    image = fields.image?.stringValue || "";
  }

  // Fallback to default OG image
  if (!image) {
    image = "https://nguvuza-uvira.com/images/og-thumbnail.jpg";
  }

  const baseUrl = "https://nguvuza-uvira.com";
  const articleUrl = `${baseUrl}/articles/article-${articleId}.html`;
  const redirectUrl = `${baseUrl}?article=${articleId}`;

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <title>${escapeHtml(title)} - Nguvu Za Uvira Radio</title>
    <meta name="description" content="${escapeHtml(excerpt)}">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(excerpt)}">
    <meta property="og:image" content="${escapeHtml(image)}">
    <meta property="og:url" content="${articleUrl}">
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="Nguvu Za Uvira Radio">
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(title)}">
    <meta name="twitter:description" content="${escapeHtml(excerpt)}">
    <meta name="twitter:image" content="${escapeHtml(image)}">
    
    <!-- Redirect to Main App -->
    <meta http-equiv="refresh" content="0;url=${redirectUrl}">
</head>
<body>
    <noscript>
        <p>Redirecting to <a href="${redirectUrl}">${escapeHtml(title)}</a></p>
    </noscript>
    
    <script>
        window.location.href = "${redirectUrl}";
    </script>
</body>
</html>`;

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
    body: html,
  };
}

function serveDefaultTemplate() {
  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nguvu Za Uvira Radio</title>
    <meta property="og:title" content="Nguvu Za Uvira Radio">
    <meta property="og:description" content="Votre radio communautaire à Uvira. 107.0 MHz">
    <meta property="og:image" content="https://nguvuza-uvira.com/images/og-thumbnail.jpg">
    <meta property="og:url" content="https://nguvuza-uvira.com">
    <meta http-equiv="refresh" content="0;url=https://nguvuza-uvira.com">
</head>
<body>
    <script>window.location.href = "https://nguvuza-uvira.com";</script>
</body>
</html>`;

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
    body: html,
  };
}

function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
