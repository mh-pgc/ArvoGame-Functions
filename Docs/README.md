# WebGL Game Launcher

Clean URLs for Unity WebGL games hosted on Azure Blob Storage. Hides SAS keys from address bar.

## Problem Solved

**Before:** Long URLs with exposed SAS keys
```
https://arvoblobstorage.blob.core.windows.net/explore-by-pgc/Colleges/Production/WebGL/Build/v0.0.1.7/index.html?si=Read-Access&sv=2022-11-02&sr=c&sig=%2BHJy%2BOHUGQAYuwVheu%2FRzWeLQKa9SX7rWLZVbjkPY6M%3D&appName=arvo&gameID=CHM11C10VIRTUALCHEMISTRYLAB
```

**After:** Clean, shareable URLs
```
https://mh-pgc.github.io/ArvoGame-Functions/launcher.html?game=CHM11C10VIRTUALCHEMISTRYLAB&app=arvo
```

## Live Launcher

**URL:** https://mh-pgc.github.io/ArvoGame-Functions/launcher.html

**Examples:**
- Default: https://mh-pgc.github.io/ArvoGame-Functions/launcher.html
- Chemistry Lab: https://mh-pgc.github.io/ArvoGame-Functions/launcher.html?game=CHM11C10VIRTUALCHEMISTRYLAB&app=arvo
- Physics Lab: https://mh-pgc.github.io/ArvoGame-Functions/launcher.html?game=PHY12MECHANICS&app=punjab

## Parameters

| Parameter | Description | Example | Default |
|-----------|-------------|---------|---------|
| `game` | Game/simulation ID | `CHM11C10VIRTUALCHEMISTRYLAB` | _(none)_ |
| `app` | Theme (arvo/punjab/custom) | `arvo` | `punjab` |
| `institution` | Colleges or Schools | `Schools` | `Colleges` |
| `environment` | Production/Development/Staging | `Development` | `Production` |
| `version` | Game version | `v1.2.0` | `v0.0.1.7` |
| `dk` | Debug key for Unity | `debug123` | _(none)_ |
| `eb` | Enable bridging mode | `enabled` | _(none)_ |

## Setup

1. **Configure launcher.html** - Update CONFIG section with your Azure URL and SAS key
2. **Host on GitHub Pages** - Upload launcher.html to your repository
3. **Enable Pages** - Go to Settings → Pages in your GitHub repo

## Themes

- **Arvo** (`app=arvo`): Teal colors, chemistry icon
- **Punjab** (`app=punjab`): Blue colors, education icon  
- **Custom** (`app=anything`): Blue colors, target icon

## Debugging

Open browser console and run:
```javascript
debugLauncher()  // In launcher page
debugGameParams()  // In game page
```

## URL Structure

Launcher builds: `{baseUrl}/{institution}/{environment}/WebGL/Build/{version}/index.html`

Example: `https://arvoblobstorage.blob.core.windows.net/explore-by-pgc/Colleges/Production/WebGL/Build/v0.0.1.7/index.html`