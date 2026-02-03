# ArvoGame Launcher - Usage Guide

## 🚀 Quick Start

Your launcher is hosted at: **https://mh-pgc.github.io/ArvoGame-Functions/launcher.html**

### Basic Usage
```
https://mh-pgc.github.io/ArvoGame-Functions/launcher.html
```
Opens the default game without any specific game ID.

### With Specific Game
```
https://mh-pgc.github.io/ArvoGame-Functions/launcher.html?game=CHM11C10VIRTUALCHEMISTRYLAB&app=arvo
```

## 📋 URL Parameters

### Core Parameters

| Parameter | Aliases | Description | Example Values | Default |
|-----------|---------|-------------|----------------|---------|
| `gameID` | `game` | Specific simulation to load | `CHM11C10VIRTUALCHEMISTRYLAB`, `PHY12MECHANICS` | _(none - opens default)_ |
| `appName` | `app` | Theme and branding | `arvo`, `punjab`, `biology` | `punjab` |

### Advanced Parameters

| Parameter | Description | Example Values | Default |
|-----------|-------------|----------------|---------|
| `institution` | Institution type | `Colleges`, `Schools` | `Colleges` |
| `environment` | Deployment environment | `Production`, `Development`, `Staging` | `Production` |
| `version` | Game version | `v0.0.1.7`, `v1.2.0`, `v2.1.5` | `v0.0.1.7` |
| `dk` | Debug key for Unity development | `debug123`, `dev456` | _(none)_ |
| `eb` | Enable bridging mode in Unity | `enabled`, `true`, `1` | _(none)_ |

## 🎨 Theme Examples

### Arvo Theme (Teal Colors)
```
https://mh-pgc.github.io/ArvoGame-Functions/launcher.html?app=arvo
```
- **Primary Color**: Teal (#00A2A0)
- **Icon**: 🧪 (Chemistry/Science)
- **Best For**: Science simulations, chemistry labs

### Punjab Theme (Blue Colors)
```
https://mh-pgc.github.io/ArvoGame-Functions/launcher.html?app=punjab
```
- **Primary Color**: Blue (#2D2D71)
- **Icon**: 📚 (Education)
- **Best For**: Educational content, general learning

### Custom Themes
```
https://mh-pgc.github.io/ArvoGame-Functions/launcher.html?app=mathematics
```
- **Primary Color**: Blue (same as Punjab)
- **Icon**: 🎯 (Target)
- **Title**: Dynamically generated from app name

## 📚 Common Use Cases

### 1. Default Game Launch
**URL:** `https://mh-pgc.github.io/ArvoGame-Functions/launcher.html`
**Result:** Opens the main game interface without loading a specific simulation

### 2. Chemistry Lab (Arvo Theme)
**URL:** `https://mh-pgc.github.io/ArvoGame-Functions/launcher.html?game=CHM11C10VIRTUALCHEMISTRYLAB&app=arvo`
**Result:** Loads chemistry lab with teal Arvo branding

### 3. Physics Simulation (Punjab Theme)
**URL:** `https://mh-pgc.github.io/ArvoGame-Functions/launcher.html?game=PHY12MECHANICS&app=punjab`
**Result:** Loads physics simulation with blue Punjab branding

### 4. School Environment
**URL:** `https://mh-pgc.github.io/ArvoGame-Functions/launcher.html?game=MATHLAB&institution=Schools&app=punjab`
**Result:** Loads from Schools directory instead of Colleges

### 5. Development Testing
**URL:** `https://mh-pgc.github.io/ArvoGame-Functions/launcher.html?game=TESTLAB&environment=Development&dk=debug123&eb=enabled`
**Result:** Loads from Development environment with debug mode and bridging enabled in Unity

### 6. Specific Version
**URL:** `https://mh-pgc.github.io/ArvoGame-Functions/launcher.html?game=NEWLAB&version=v1.2.0&app=arvo`
**Result:** Loads specific version v1.2.0 of the game

## 🔧 URL Structure Generated

Your parameters build this Azure URL structure:
```
https://arvoblobstorage.blob.core.windows.net/explore-by-pgc/
{institution}/{environment}/WebGL/Build/{version}/index.html
```

### Examples:
- **Default**: `Colleges/Production/WebGL/Build/v0.0.1.7/index.html`
- **Schools**: `Schools/Production/WebGL/Build/v0.0.1.7/index.html`
- **Development**: `Colleges/Development/WebGL/Build/v0.0.1.7/index.html`
- **Custom Version**: `Colleges/Production/WebGL/Build/v1.2.0/index.html`

## 🎯 Parameter Combinations

### Minimal URLs
```
# Just open the game
https://mh-pgc.github.io/ArvoGame-Functions/launcher.html

# With theme only
https://mh-pgc.github.io/ArvoGame-Functions/launcher.html?app=arvo

# With game only
https://mh-pgc.github.io/ArvoGame-Functions/launcher.html?game=CHEMISTRY101
```

### Complete URLs
```
# Full configuration
https://mh-pgc.github.io/ArvoGame-Functions/launcher.html?game=BIOLAB&app=biology&institution=Schools&environment=Development&version=v2.0.0&dk=dev123&eb=enabled
```

## 🔄 What Happens When You Use the Launcher

1. **User clicks your clean launcher URL**
2. **Launcher shows loading screen** with appropriate theme
3. **Parameters stored securely** in browser memory
4. **Redirects to Azure game** with SAS key authentication
5. **URL cleaned immediately** - SAS key hidden from address bar
6. **Game loads** with all parameters applied

### User Experience:
- **Sees**: Clean, professional URLs
- **Gets**: Smooth loading experience with branded themes
- **Never sees**: SAS keys or complex Azure URLs

## 🛠️ Troubleshooting

### Game Won't Load
1. Check if the game ID exists in your Azure storage
2. Verify the version number is correct
3. Ensure institution/environment path exists
4. Use `debugGameParams()` to check parameter flow

### Wrong Theme
1. Check the `app` parameter spelling
2. Verify supported theme names: `arvo`, `punjab`, or custom
3. Check Unity receives app name with `debugGameParams()`

### Debug Mode Not Working
1. Ensure `dk` parameter has the correct debug key
2. Check that your Unity game supports debug mode
3. Verify debug key is sent to Unity with `debugGameParams()`

### Bridging Mode Issues
1. Ensure `eb` parameter is set to `enabled` or `true`
2. Check that your Unity game supports bridging mode
3. Verify bridging parameter is sent to Unity

### Console Debugging

**In Launcher Page:**
Open browser console (F12) and run:
```javascript
debugLauncher()
```
Shows parsed parameters, target URL, and all sessionStorage values.

**In Game Page:**
Open browser console (F12) and run:
```javascript
debugGameParams()
```
Shows parameter flow, Unity config, and actual values being used.

**For Complete Testing:**
See [PARAMETER-VERIFICATION.md](PARAMETER-VERIFICATION.md) for comprehensive parameter testing guide.

## 🎮 Unity Integration

The launcher seamlessly integrates with your Unity WebGL game by passing parameters through the `SendMessageToMobileApp` system:

### Parameters Sent to Unity

| Parameter | Unity Method | Purpose |
|-----------|--------------|---------|
| **Game ID** | `AddressableManager.LoadData` | Loads specific simulation/game content |
| **App Name** | `AddressableHandler.CheckAppName` | Sets theme/branding in Unity |
| **Debug Key** | `AddressableHandler.CheckDebugMode` | Enables debug features in Unity |
| **Bridging Mode** | `AddressableHandler.CheckBridging` | Enables special communication modes |

### Unity Lifecycle Events

1. **`unityLoading`** - Triggered when Unity starts loading (cache management)
2. **`unityLoaded`** - Triggered when Unity is ready (parameter sending)
3. **`unityExit`** - Triggered when user exits game (cleanup and UI)

### Debug Integration

Your Unity game can receive and process debug keys for:
- Development mode activation
- Special testing features
- Debug UI display
- Performance monitoring
- Custom development tools

### Bridging Mode

The `eb` parameter enables bridging mode in Unity for:
- Enhanced communication with native apps
- Special rendering modes
- Custom interaction patterns
- Advanced integration features

## 📱 Mobile Support

The launcher works on all devices:
- **Desktop**: Full-screen experience
- **Mobile**: Responsive design with touch support
- **Tablets**: Optimized layout and controls

## 🔒 Security Features

- **Hidden SAS Keys**: Never visible in browser address bar
- **Secure Storage**: Parameters stored in browser session memory
- **Clean URLs**: Professional appearance for sharing
- **No Server Logs**: SAS keys don't appear in web server access logs
- **Unity Integration**: Secure parameter passing to Unity engine
- **Debug Mode Security**: Debug keys only work when Unity supports them

## 📊 Analytics & Tracking

The launcher provides console logging for:
- Parameter extraction and validation
- Theme application
- URL cleaning operations
- Asset loading status

Use browser developer tools to monitor launcher behavior and troubleshoot issues.

---

**Need help?** Check the console logs or use the `debugLauncher()` function for detailed information about parameter parsing and URL generation.