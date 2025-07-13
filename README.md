# Frontend - React TypeScript Application

A modern React application built with TypeScript, Vite, and strict code quality standards.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd jwt-auth-test/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the application.

## 📝 Available Scripts

| Command                | Description                     |
| ---------------------- | ------------------------------- |
| `npm run dev`          | Start development server        |
| `npm run build`        | Build for production            |
| `npm run preview`      | Preview production build        |
| `npm run lint`         | Run ESLint checks               |
| `npm run lint:fix`     | Fix ESLint issues automatically |
| `npm run format`       | Format all files with Prettier  |
| `npm run format:check` | Check if files are formatted    |
| `npm run check-all`    | Run all checks (format + lint)  |
| `npm run fix-all`      | Fix all issues (format + lint)  |

## 🛠️ Development Setup

### VS Code (Recommended)

1. **Install required extensions:**
   - [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
   - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
   - [TypeScript and JavaScript Language Features](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-next)

2. **VS Code will automatically:**
   - Format code with Prettier on save
   - Fix ESLint issues on save
   - Sort imports automatically
   - Show TypeScript errors inline

### Other Editors

Configure your editor to:

- Use Prettier for formatting
- Run ESLint for linting
- Format on save
- Auto-fix on save

## 📋 Code Quality Standards

### Automatic Formatting & Linting

This project enforces strict code quality standards:

- **Prettier** handles code formatting (spacing, semicolons, quotes, etc.)
- **ESLint** handles code quality and import sorting
- **TypeScript** ensures type safety

### Import Sorting

Imports are automatically sorted by `eslint-plugin-simple-import-sort`:

```typescript
// ✅ Correct order
import React from "react"; // External packages first
import { useState } from "react"; // React hooks
import axios from "axios"; // Other external packages

import { Button } from "../ui"; // Internal components
import { utils } from "../utils"; // Internal utilities

import "./Component.css"; // CSS imports last
```

### Code Style Examples

```typescript
// ✅ Good - Proper TypeScript interfaces
interface User {
  id: number;
  name: string;
  email: string;
}

// ✅ Good - Functional components with TypeScript
const UserProfile: React.FC<{ user: User }> = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="user-profile">
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
};

// ✅ Good - Custom hooks
const useUserData = (userId: number) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Hook logic here

  return { user, loading };
};
```

## 🔧 Before Submitting a Pull Request

### 1. Run Quality Checks

```bash
# Check formatting
npm run format:check

# Check linting
npm run lint

# Run all checks
npm run check-all
```

### 2. Fix Issues Automatically

```bash
# Fix all formatting and linting issues
npm run fix-all
```

### 3. Ensure Build Works

```bash
# Build the project
npm run build
```

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── hooks/         # Custom React hooks
│   ├── utils/         # Utility functions
│   ├── types/         # TypeScript type definitions
│   ├── styles/        # Global styles
│   └── main.tsx       # Application entry point
├── public/            # Static assets
├── .github/           # GitHub Actions workflows
├── .vscode/           # VS Code settings
├── eslint.config.js   # ESLint configuration
├── .prettierrc        # Prettier configuration
├── tsconfig.json      # TypeScript configuration
└── vite.config.ts     # Vite configuration
```

## 📐 Coding Guidelines

### TypeScript

- Use proper TypeScript types for all props and state
- Avoid `any` type - use proper interfaces or types
- Use optional chaining and nullish coalescing when appropriate

```typescript
// ✅ Good
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

// ❌ Bad
const Button = (props: any) => { ... }
```

### React Components

- Use functional components with hooks
- Use descriptive component names
- Keep components small and focused
- Use proper prop destructuring

```typescript
// ✅ Good
const UserCard: React.FC<{ user: User; onEdit: () => void }> = ({
  user,
  onEdit
}) => {
  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <button onClick={onEdit}>Edit</button>
    </div>
  );
};
```

### State Management

- Use `useState` for local component state
- Use `useReducer` for complex state logic
- Consider context for global state

### Error Handling

- Use try-catch blocks for async operations
- Provide user-friendly error messages
- Log errors appropriately

## 🚨 Common Issues & Solutions

### Import Sorting Issues

```bash
# Fix import sorting automatically
npm run lint:fix
```

### Formatting Issues

```bash
# Fix formatting automatically
npm run format
```

### TypeScript Errors

```bash
# Check TypeScript compilation
npx tsc --noEmit
```

### Build Issues

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 🔄 CI/CD Pipeline

Every Pull Request automatically runs:

- ✅ **Prettier formatting check** - Ensures consistent code formatting
- ✅ **ESLint with import sorting** - Ensures code quality and sorted imports
- ✅ **TypeScript compilation** - Ensures no type errors
- ✅ **Build verification** - Ensures project builds successfully

**All checks must pass before merging.**

## 📚 Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **GitHub Actions** - CI/CD pipeline

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes following the code standards**
4. **Run quality checks**: `npm run check-all`
5. **Fix any issues**: `npm run fix-all`
6. **Commit your changes**: `git commit -m 'Add amazing feature'`
7. **Push to the branch**: `git push origin feature/amazing-feature`
8. **Open a Pull Request**

### Pull Request Guidelines

- Provide a clear description of changes
- Include screenshots for UI changes
- Ensure all CI/CD checks pass
- Keep PRs focused and atomic
- Follow the existing code style

## Troubleshooting

### VS Code Not Formatting on Save

1. Check if Prettier extension is installed and enabled
2. Verify `.vscode/settings.json` exists in the project
3. Reload VS Code window

### ESLint Errors in VS Code

1. Check if ESLint extension is installed
2. Reload VS Code window
3. Run `npm run lint:fix` in terminal

### Import Sorting Not Working

1. Ensure `eslint-plugin-simple-import-sort` is installed
2. Check ESLint configuration
3. Run `npm run lint:fix`

## Support

If you encounter any issues:

1. Check this README first
2. Run `npm run fix-all` to fix common issues
3. Check the GitHub Issues page
4. Ask for help in team discussions

---

**Happy coding! 🎉**

_Remember: Quality code is not just about functionality - it's about maintainability, readability, and team collaboration._
