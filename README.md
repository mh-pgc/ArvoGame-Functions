# WebGL Game Launcher for Azure Blob Storage

A clean, secure launcher for Unity WebGL games hosted on Azure Blob Storage with SAS key authentication. This launcher hides SAS keys from URLs and provides a professional loading experience.

## 🎯 Problem Solved

**Before:** Ugly, long URLs with exposed SAS keys
```
https://arvoblobstorage.blob.core.windows.net/explore-by-pgc/Colleges/Production/WebGL/Build/v0.0.1.7/index.html?si=Read-Access&sv=2022-11-02&sr=c&sig=%2BHJy%2BOHUGQAYuwVheu%2FRzWeLQKa9SX7rWLZVbjkPY6M%3D&appName=arvo&gameID=CHM11C10VIRTUALCHEMISTRYLAB
```

**After:** Clean, shareable URLs
```
https://yourusername.github.io/game-launcher/launcher.html?game=CHM11C10VIRTUALCHEMISTRYLAB&app=arvo
```

## 🚀 Features

- **Clean URLs**: Hide SAS keys completely from address bar
- **Flexible Parameters**: Support both short and long parameter formats
- **Smart Theming**: Automatic theme switching based on app type
- **Error Handling**: Connection testing with retry functionality
- **Mobile Friendly**: Responsive design with smooth animations
- **Debug Support**: Built-in debugging tools for troubleshooting
- **Session Storage**: Secure parameter passing to your game

## 📁 File Structure

```
your-github-repo/
├── launcher.html          # Main launcher file (host on GitHub Pages)
├── README.md             # This documentation
└── index.html            # Your Unity WebGL game (stays on Azure)
```

## 🛠️ Setup Instructions

### Step 1: Configure the Launcher

Edit `launcher.html` and update the configuration section:

```javascript
const CONFIG = {
    // Your Azure blob storage base URL
    baseUrl: 'https://yourblobstorage.blob.core.windows.net/your-container',
    
    // Your SAS key (update when it expires)
    sasKey: 'si=Read-Access&sv=2022-11-02&sr=c&sig=YOUR_SAS_KEY_HERE',
    
    // Default values
    defaults: {
        institution: 'Colleges',  // or 'Schools'
        environment: 'Production',
        version: 'v0.0.1.7',
        appName: 'punjab'
    }
};
```

### Step 2: Host on GitHub Pages

1. Create a new GitHub repository
2. Upload `launcher.html` to the repository
3. Go to repository Settings → Pages
4. Enable GitHub Pages from main branch
5. Your launcher will be available at: `https://yourusername.github.io/repository-name/launcher.html`

### Step 3: Update Your Game (Optional)

Add this to the beginning of your `index.html` script section to read from session storage:

```javascript
// Get parameters from session storage (from launcher) or URL fallback
var sasKey = sessionStorage.getItem('saskey') ? '?' + sessionStorage.getItem('saskey') : 
             "?si=Read-Access&sv=2022-11-02&sr=c&sig=YOUR_FALLBACK_SAS_KEY";

var appName = sessionStorage.getItem('appName') || getUrlParameter("appName");
var gameID = sessionStorage.getItem('gameID') || getUrlParameter("gameID");
var debugKey = sessionStorage.getItem('dk') || getUrlParameter("dk");
var bridgeMode = sessionStorage.getItem('eb') || getUrlParameter("eb");
```

## 📖 Usage Examples

### Basic Game Launch
```
https://yourusername.github.io/game-launcher/launcher.html?game=CHM11C10VIRTUALCHEMISTRYLAB&app=arvo
```

### Multiple Parameters
```
https://yourusername.github.io/game-launcher/launcher.html?game=PHY12MECHANICS&app=punjab&dk=debug123&eb=enabled
```

### Custom Institution/Environment
```
https://yourusername.github.io/game-launcher/launcher.html?game=MATHLAB&institution=Schools&environment=Development&version=v1.2.0
```

### No Parameters (Uses Defaults)
```
https://yourusername.github.io/game-launcher/launcher.html
```

## 🔧 Supported Parameters

| Parameter | Aliases | Description | Example | Default |
|-----------|---------|-------------|---------|---------|
| `gameID` | `game` | Simulation/game identifier | `CHM11C10VIRTUALCHEMISTRYLAB` | _(empty)_ |
| `appName` | `app` | Theme/app type | `arvo`, `punjab`, `custom` | `punjab` |
| `dk` | - | Debug key for development | `debug123` | _(empty)_ |
| `eb` | - | Enable bridging mode | `enabled`, `true` | _(empty)_ |
| `institution` | - | Institution type | `Colleges`, `Schools` | `Colleges` |
| `environment` | - | Environment type | `Production`, `Development` | `Production` |
| `version` | - | Game version | `v0.0.1.7`, `v1.2.0` | `v0.0.1.7` |
| `baseUrl` | - | Override base URL | Full Azure URL | _(config default)_ |

## 🎨 Themes

The launcher automatically applies themes based on the `appName` parameter:

### Arvo Theme (`app=arvo`)
- **Colors**: Teal accent (#00A2A0)
- **Icon**: 🧪 (Chemistry/Science)
- **Title**: "Loading Arvo Simulation"

### Punjab Theme (`app=punjab`)
- **Colors**: Blue accent (#2D2D71)
- **Icon**: 📚 (Education)
- **Title**: "Loading Punjab Simulation"

### Custom Theme (`app=anything-else`)
- **Colors**: Blue accent (Punjab theme)
- **Icon**: 🎯 (Target)
- **Title**: "Loading [AppName] Simulation"

## 🐛 Debugging

### Console Debug Function
Open browser console and run:
```javascript
debugLauncher()
```

This will show:
- Parsed parameters
- Generated target URL
- Session storage contents

### Common Issues

**Game won't load:**
1. Check if SAS key is expired: `debugLauncher()` in console
2. Verify Azure blob URL structure matches your setup
3. Check browser console for error messages

**Wrong theme/colors:**
1. Verify `appName` parameter is correct
2. Check if custom app name is intended

**Parameters not working:**
1. Use `debugLauncher()` to see parsed parameters
2. Verify parameter names match supported list
3. Check URL encoding for special characters

## 🔄 Updating SAS Keys

When your SAS key expires:

### Method 1: Update Launcher Config
Edit `launcher.html` and update the `sasKey` value in the CONFIG section.

### Method 2: URL Parameter Override
Add `saskey` parameter to your URLs (temporary solution):
```
launcher.html?game=MYLAB&saskey=NEW_SAS_KEY_HERE
```

## 🌐 URL Structure Generated

The launcher builds URLs in this format:
```
{baseUrl}/{institution}/{environment}/WebGL/Build/{version}/index.html
```

**Example:**
```
https://arvoblobstorage.blob.core.windows.net/explore-by-pgc/Colleges/Production/WebGL/Build/v0.0.1.7/index.html
```

## 📱 Mobile Support

The launcher is fully responsive and includes:
- Touch-friendly interface
- Proper viewport settings
- Optimized loading animations
- Error handling for mobile networks

## 🔒 Security Benefits

- **Hidden SAS Keys**: Never visible in browser address bar
- **Session Storage**: Parameters stored securely in browser memory
- **No Server Logs**: SAS keys don't appear in web server access logs
- **Clean Sharing**: URLs can be shared without exposing credentials

## 📄 License

This launcher is provided as-is for educational and commercial use. Modify as needed for your specific requirements.

## 🤝 Support

For issues or questions:
1. Check the debugging section above
2. Use `debugLauncher()` console function
3. Verify your Azure blob storage configuration
4. Ensure SAS key has proper permissions (Read access to container)

---

**Made with ❤️ for clean, secure WebGL game sharing**