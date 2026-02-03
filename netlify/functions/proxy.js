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
    
    // Extract SAS key from parameters or use environment variable
    let sasKey = process.env.SAS_KEY;
    let cleanAdditionalParams = [];
    
    // Check if SAS key is provided in URL parameters
    for (const param of additionalParams) {
      if (param.startsWith('sasKey=')) {
        sasKey = decodeURIComponent(param.substring(7)); // Extract SAS key
        // Don't include sasKey in additional params
      } else {
        cleanAdditionalParams.push(param);
      }
    }
    
    // Your Azure base URL
    const azureBaseUrl = 'https://arvoblobstorage.blob.core.windows.net/explore-by-pgc';
    
    if (!sasKey) {
      console.error('SAS_KEY environment variable not configured');
      return {
        statusCode: 500,
        body: 'SAS_KEY environment variable not configured'
      };
    }
    
    // Ensure SAS key doesn't start with ? if we're adding it after ?
    const cleanSasKey = sasKey.startsWith('?') ? sasKey.substring(1) : sasKey;
    
    // Build the full Azure URL
    let fullUrl = `${azureBaseUrl}/${filePath}?${cleanSasKey}`;
    
    // Add additional parameters if they exist (excluding sasKey)
    if (cleanAdditionalParams.length > 0) {
      fullUrl += '&' + cleanAdditionalParams.join('&');
    }
    
    console.log(`Proxying path: ${filePath}`);
    console.log(`Constructed URL: ${fullUrl}`);
    
    // Fetch the content from Azure with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    let response;
    try {
      response = await fetch(fullUrl, { 
        signal: controller.signal,
        headers: {
          'User-Agent': 'Netlify-Proxy/1.0'
        }
      });
      clearTimeout(timeoutId);
    } catch (error) {
      clearTimeout(timeoutId);
      console.error(`Fetch error for ${filePath}:`, error.message);
      return {
        statusCode: 502,
        body: `Proxy fetch error: ${error.message} - Path: ${filePath}`
      };
    }
    
    if (!response.ok) {
      console.error(`Azure fetch failed: ${response.status} ${response.statusText} for ${fullUrl}`);
      return {
        statusCode: response.status,
        body: `Error fetching content: ${response.statusText} - URL: ${fullUrl}`
      };
    }
    
    // Get content and content type
    let contentType = response.headers.get('content-type');
    let contentEncoding = response.headers.get('content-encoding');
    
    // If no content type from Azure, determine it from file extension
    if (!contentType) {
      if (filePath.endsWith('.html')) contentType = 'text/html';
      else if (filePath.endsWith('.js')) contentType = 'application/javascript';
      else if (filePath.endsWith('.css')) contentType = 'text/css';
      else if (filePath.endsWith('.png')) contentType = 'image/png';
      else if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) contentType = 'image/jpeg';
      else if (filePath.endsWith('.ico')) contentType = 'image/x-icon';
      else if (filePath.endsWith('.wasm')) contentType = 'application/wasm';
      else if (filePath.endsWith('.ttf')) contentType = 'font/ttf';
      else if (filePath.endsWith('.br')) {
        // For .br files, determine the original content type
        if (filePath.includes('.js.br')) contentType = 'application/javascript';
        else if (filePath.includes('.wasm.br')) contentType = 'application/wasm';
        else if (filePath.includes('.data.br')) contentType = 'application/octet-stream';
        else contentType = 'application/octet-stream';
        contentEncoding = 'br'; // Set Brotli encoding
      }
      else contentType = 'application/octet-stream';
    }
    
    // Handle binary files differently from text files
    let content;
    let isBase64 = false;
    
    // For compressed .br files, we need to pass them through as-is without decompression
    if (filePath.endsWith('.br')) {
      // Pass compressed files as binary without setting Content-Encoding
      // Let the browser handle decompression based on file extension
      const buffer = await response.arrayBuffer();
      content = Buffer.from(buffer).toString('base64');
      isBase64 = true;
      // Don't set contentEncoding for .br files - let browser handle it
      contentEncoding = null;
    } else if (contentType.includes('text/') || (contentType.includes('application/javascript') && !filePath.endsWith('.br'))) {
      // Handle text files (but not compressed JS files)
      content = await response.text();
    } else {
      // Handle other binary files (images, wasm, etc.)
      const buffer = await response.arrayBuffer();
      content = Buffer.from(buffer).toString('base64');
      isBase64 = true;
    }
    
    // If it's HTML, modify it to route Unity assets through proxy
    if (contentType.includes('text/html')) {
      // Get the directory path for relative URLs
      const dirPath = filePath.substring(0, filePath.lastIndexOf('/'));
      
      // Replace Unity asset URLs to use proxy - be more aggressive
      content = content
        // Replace Build/ URLs in JavaScript (with and without sasKey)
        .replace(/buildUrl \+ "\/([^"]+)" \+ sasKey/g, `"/.netlify/functions/proxy?${dirPath}/Build/$1"`)
        .replace(/buildUrl \+ "\/([^"]+)"/g, `"/.netlify/functions/proxy?${dirPath}/Build/$1"`)
        
        // Replace TemplateData/ URLs (with and without sasKey) - more comprehensive
        .replace(/"TemplateData\/([^"]+)" \+ sasKey/g, `"/.netlify/functions/proxy?${dirPath}/TemplateData/$1"`)
        .replace(/"TemplateData\/([^"]+)"/g, `"/.netlify/functions/proxy?${dirPath}/TemplateData/$1"`)
        .replace(/TemplateData\/([^"'\s]+)/g, `/.netlify/functions/proxy?${dirPath}/TemplateData/$1`)
        
        // Replace the initial favicon and stylesheet URLs in HTML head
        .replace(/href="TemplateData\/([^"]+)"/g, `href="/.netlify/functions/proxy?${dirPath}/TemplateData/$1"`)
        .replace(/src="TemplateData\/([^"]+)"/g, `src="/.netlify/functions/proxy?${dirPath}/TemplateData/$1"`)
        
        // Replace any remaining asset URLs that might be constructed dynamically
        .replace(/url\('TemplateData\/([^']+)'\)/g, `url('/.netlify/functions/proxy?${dirPath}/TemplateData/$1')`)
        .replace(/url\("TemplateData\/([^"]+)"\)/g, `url("/.netlify/functions/proxy?${dirPath}/TemplateData/$1")`)
        
        // Replace background image URLs in CSS/JS
        .replace(/background:\s*url\(([^)]*TemplateData\/[^)]+)\)/g, (match, url) => {
          const cleanUrl = url.replace(/['"]/g, '');
          return `background: url('/.netlify/functions/proxy?${dirPath}/${cleanUrl}')`;
        })
        
        // Replace any direct asset references
        .replace(/(src|href)="([^"]+\.(png|jpg|jpeg|ico|ttf|woff|woff2|css))"/g, (match, attr, url, ext) => {
          if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('#') || url.startsWith('/.netlify')) {
            return match; // Don't modify absolute URLs, data URLs, or already proxied URLs
          }
          return `${attr}="/.netlify/functions/proxy?${dirPath}/${url}"`;
        })
        
        // Replace the SAS key initialization to skip the async loading
        .replace(/initializeUnity\(\);/, 'startUnityLoading(); // Skip async key loading, proxy handles it')
        
        // Replace updateResourceUrls calls since proxy handles URLs
        .replace(/updateResourceUrls\(\);/g, '// URLs handled by proxy')
        
        // Replace the SAS key fetching with a simple assignment
        .replace(/const keysLoaded = await loadKeys\(\);/, 'const keysLoaded = true; // Proxy handles keys')
        .replace(/if \(keysLoaded\) \{[\s\S]*?\} else \{[\s\S]*?\}[\s\S]*?startUnityLoading\(\);/, 'startUnityLoading(); // Proxy handles everything')
        
        // Remove any remaining SAS key concatenations
        .replace(/\+ sasKey/g, '// SAS key handled by proxy');
    }
    
    // Build response headers
    const responseHeaders = {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Cache-Control': contentType.includes('text/html') ? 'no-cache' : 'public, max-age=3600'
    };
    
    // Add Content-Encoding header for compressed files
    if (contentEncoding) {
      responseHeaders['Content-Encoding'] = contentEncoding;
    }
    
    return {
      statusCode: 200,
      headers: responseHeaders,
      body: content,
      isBase64Encoded: isBase64
    };
    
  } catch (error) {
    console.error('Proxy error:', error);
    return {
      statusCode: 500,
      body: `Proxy error: ${error.message}`
    };
  }
};