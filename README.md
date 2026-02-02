# Netlify Functions for Unity WebGL

Deploy this folder to Netlify to securely serve Unity keys.

## Quick Setup

1. **Deploy**: Drag this folder to netlify.com
2. **Environment Variables**: Add in Site Settings
   - `SAS_KEY` = your full SAS key (starting with `?`)
   - `DEBUG_KEY` = your debug key (optional)
3. **Test**: Visit `/.netlify/functions/getSasKey`

## Files

- `getSasKey.js` - Returns SAS key securely
- `getDebugKey.js` - Returns debug key securely
- `index.html` - Simple landing page

## Usage

These functions are called by your Unity WebGL app to fetch keys without exposing them in URLs or source code.