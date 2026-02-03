# Usage Guide

## Quick Start

**Launcher URL:** https://mh-pgc.github.io/ArvoGame-Functions/launcher.html

### Basic Usage
```
https://mh-pgc.github.io/ArvoGame-Functions/launcher.html
```

### With Parameters
```
https://mh-pgc.github.io/ArvoGame-Functions/launcher.html?game=CHM11C10VIRTUALCHEMISTRYLAB&app=arvo
```

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

## Examples

**Default Game:**
```
https://mh-pgc.github.io/ArvoGame-Functions/launcher.html
```

**Chemistry Lab (Arvo Theme):**
```
https://mh-pgc.github.io/ArvoGame-Functions/launcher.html?game=CHM11C10VIRTUALCHEMISTRYLAB&app=arvo
```

**Physics Lab (Punjab Theme):**
```
https://mh-pgc.github.io/ArvoGame-Functions/launcher.html?game=PHY12MECHANICS&app=punjab
```

**Schools Environment:**
```
https://mh-pgc.github.io/ArvoGame-Functions/launcher.html?game=MATHLAB&institution=Schools
```

**Development with Debug:**
```
https://mh-pgc.github.io/ArvoGame-Functions/launcher.html?game=TESTLAB&environment=Development&dk=debug123&eb=enabled
```

## Themes

- **Arvo** (`app=arvo`): Teal colors, chemistry icon
- **Punjab** (`app=punjab`): Blue colors, education icon
- **Custom** (`app=anything`): Blue colors, target icon

## Troubleshooting

**Game won't load:**
1. Check SAS key expiration with `debugLauncher()` in console
2. Verify game ID exists in Azure storage
3. Check browser console for errors

**Wrong theme:**
1. Verify `app` parameter spelling
2. Supported themes: `arvo`, `punjab`, or any custom name

**Debug Console:**
```javascript
debugLauncher()    // In launcher page
debugGameParams()  // In game page
```

## URL Structure

Launcher builds: `{baseUrl}/{institution}/{environment}/WebGL/Build/{version}/index.html`

Example: `https://arvoblobstorage.blob.core.windows.net/explore-by-pgc/Colleges/Production/WebGL/Build/v0.0.1.7/index.html`