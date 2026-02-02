exports.handler = async (event, context) => {
  try {
    // Get the path from query string (everything after the function name)
    const queryString = event.rawQuery || '';
    
    if (!queryString) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'text/html' },
        body: `
          <h1>Azure Blob Proxy</h1>
          <p>Usage: <code>/.netlify/functions/proxy?path/to/file.html&param=value</code></p>
          <p>Example: <a href="/.netlify/functions/proxy?Colleges/Production/WebGL/Build/v0.0.1.7/index.html&appName=arvo">Load Unity Game</a></p>
        `
      };
    }
    
    // Split query string to get path and parameters
    const parts = queryString.split('&');
    const filePath = parts[0]; // First part is the file path
    const additionalParams = parts.slice(1); // Rest are additional parameters
    
    // Your Azure base URL and SAS key
    const azureBaseUrl = 'https://arvoblobstorage.blob.core.windows.net/explore-by-pgc';
    const sasKey = process.env.SAS_KEY; // Should be like: si=Read-Access&sv=2022-11-02&sr=c&sig=...
    
    if (!sasKey) {
      return {
        statusCode: 500,
        body: 'SAS_KEY environment variable not configured'
      };
    }
    
    // Build the full Azure URL
    let fullUrl = `${azureBaseUrl}/${filePath}?${sasKey}`;
    
    // Add additional parameters if they exist
    if (additionalParams.length > 0) {
      fullUrl += '&' + additionalParams.join('&');
    }
    
    console.log(`Proxying path: ${filePath}`);
    console.log(`Full Azure URL: ${fullUrl}`);
    
    // Fetch the content from Azure
    const response = await fetch(fullUrl);
    
    if (!response.ok) {
      return {
        statusCode: response.status,
        body: `Error fetching content: ${response.statusText} - ${fullUrl}`
      };
    }
    
    // Get content and content type
    let content = await response.text();
    const contentType = response.headers.get('content-type') || 'text/html';
    
    // If it's HTML, modify it to route Unity assets through proxy
    if (contentType.includes('text/html')) {
      // Get the directory path for relative URLs
      const dirPath = filePath.substring(0, filePath.lastIndexOf('/'));
      
      // Replace Unity build URLs
      content = content
        // Replace Build/ URLs in JavaScript
        .replace(/buildUrl \+ "\/([^"]+)"/g, (match, filename) => {
          return `"/.netlify/functions/proxy?${dirPath}/Build/${filename}"`;
        })
        // Replace TemplateData/ URLs
        .replace(/"TemplateData\/([^"]+)"/g, (match, filename) => {
          return `"/.netlify/functions/proxy?${dirPath}/TemplateData/${filename}"`;
        })
        // Replace relative src and href attributes
        .replace(/(src|href)="([^"]+)"/g, (match, attr, url) => {
          if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('#') || url.startsWith('/.netlify')) {
            return match; // Don't modify absolute URLs, data URLs, or already proxied URLs
          }
          return `${attr}="/.netlify/functions/proxy?${dirPath}/${url}"`;
        });
    }
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Cache-Control': contentType.includes('text/html') ? 'no-cache' : 'public, max-age=3600'
      },
      body: content
    };
    
  } catch (error) {
    console.error('Proxy error:', error);
    return {
      statusCode: 500,
      body: `Proxy error: ${error.message}`
    };
  }
};