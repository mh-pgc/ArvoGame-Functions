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
    const sasKey = process.env.SAS_KEY;
    
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
      
      // Replace Unity asset URLs to use proxy, but keep the Unity loading logic intact
      content = content
        // Replace Build/ URLs in JavaScript (with and without sasKey)
        .replace(/buildUrl \+ "\/([^"]+)" \+ sasKey/g, `"/.netlify/functions/proxy?${dirPath}/Build/$1"`)
        .replace(/buildUrl \+ "\/([^"]+)"/g, `"/.netlify/functions/proxy?${dirPath}/Build/$1"`)
        
        // Replace TemplateData/ URLs (with and without sasKey)
        .replace(/"TemplateData\/([^"]+)" \+ sasKey/g, `"/.netlify/functions/proxy?${dirPath}/TemplateData/$1"`)
        .replace(/"TemplateData\/([^"]+)"/g, `"/.netlify/functions/proxy?${dirPath}/TemplateData/$1"`)
        
        // Replace the initial favicon and stylesheet URLs in HTML head
        .replace(/href="TemplateData\/([^"]+)"/g, `href="/.netlify/functions/proxy?${dirPath}/TemplateData/$1"`)
        
        // Replace the SAS key initialization to skip the async loading
        .replace(/initializeUnity\(\);/, 'startUnityLoading(); // Skip async key loading, proxy handles it')
        
        // Replace updateResourceUrls calls since proxy handles URLs
        .replace(/updateResourceUrls\(\);/g, '// URLs handled by proxy')
        
        // Replace the SAS key fetching with a simple assignment
        .replace(/const keysLoaded = await loadKeys\(\);/, 'const keysLoaded = true; // Proxy handles keys')
        .replace(/if \(keysLoaded\) \{[\s\S]*?\} else \{[\s\S]*?\}[\s\S]*?startUnityLoading\(\);/, 'startUnityLoading(); // Proxy handles everything');
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