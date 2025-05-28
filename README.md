# FiveM TypeScript NUI Boilerplate

A modern boilerplate for FiveM NUI development using React, TypeScript, Vite, and TailwindCSS.

## Features

- 🚀 React + TypeScript for UI
- ⚡ Vite for fast development and bundling
- 🎨 TailwindCSS for styling
- 🔄 Hot Module Replacement (HMR) for development
- 📝 TypeScript for type safety
- 📦 NUI communication utilities
- 🧩 Example client and server Lua scripts
- 📺 Simple display toggle with F1 key

## Project Structure

```
fivem-nui-boilerplate/
├── client/             # Client-side Lua scripts
│   └── main.lua        # Main client script with NUI handlers
├── server/             # Server-side Lua scripts
│   └── main.lua        # Main server script with event handlers
├── src/                # UI source code (React + TypeScript)
│   ├── context/        # React context for NUI state
│   ├── utils/          # Utility functions for NUI communication
│   ├── App.tsx         # Main React component
│   └── ...             # Other React components and files
├── web/                # Built UI output (generated)
├── fxmanifest.lua      # FiveM resource manifest
└── ...                 # Other configuration files
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer)
- [pnpm](https://pnpm.io/) (recommended) or npm
- [FiveM Server](https://docs.fivem.net/docs/server-manual/setting-up-a-server/) (for testing)

### Installation

1. Clone this repository or download it into your FiveM resources folder
2. Install dependencies:
   ```bash
   pnpm install
   ```

### Development

For UI development in a browser (without FiveM):

```bash
pnpm dev
```

For continuous building while testing in FiveM:

```bash
pnpm watch
```

### Building for Production

```bash
pnpm build
```

This will build the UI to the `web/` directory, which is referenced in the `fxmanifest.lua`.

### Testing in FiveM

1. Ensure the resource is in your FiveM server's resources folder
2. Add `ensure fivem-nui-boilerplate` to your server.cfg
3. Start or restart your FiveM server
4. In-game, press F1 to toggle the NUI interface

## NUI Communication

Dynamic Component System
The boilerplate includes a dynamic component system in `NuiContext.tsx` that allows you to:

- Register, show, and hide UI components independently
- Pass data to specific components
- Control multiple UI interfaces from your Lua code

```tsx
// In your React component:
import { useUiComponent } from './context/NuiContext';

const MyComponent = () => {
  const { isVisible, data, hide } = useUiComponent('componentId');
  
  if (!isVisible) return null;
  
  // Your component UI using the data
};
```

## From UI to Lua (Client)

```tsx
import { fetchNui } from './utils/fetchNui';

// Example: Sending a message to the client script
fetchNui('actionName', { key: 'value' });
```

## From Lua (Client) to UI
```tsx
-- Example: Showing a specific UI component with data
function ShowUIComponent(componentId, data)
    SendNUIMessage({
        type = "component",
        componentId = componentId,
        action = "show",
        data = data
    })
    SetNuiFocus(true, true)
end

-- Example: Hiding a specific UI component
function HideUIComponent(componentId)
    SendNUIMessage({
        type = "component",
        componentId = componentId,
        action = "hide"
    })
    SetNuiFocus(false, false)
end
```

## Acknowledgments

- [FiveM Documentation](https://docs.fivem.net/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
