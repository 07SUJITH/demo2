# Frontend - React TypeScript Application

A modern React application built with TypeScript, Vite, and strict code quality standards.

---

## 🚀 Quick Start

1. **Clone the repository**

   ```bash
   git clone <repository-url> frontend
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Build for production**

   ```bash
   npm run build
   ```

5. **Preview production build**

   ```bash
   npm run preview
   ```

---

## 🛡️ Code Quality & Workflow

This project enforces code quality with **Prettier**, **ESLint**, **TypeScript**, **Husky**, **lint-staged**, and **GitHub Actions**.

### GitHub Workflow

On every push and pull request to `main`, the following checks are run automatically:

- TypeScript compilation (`npx tsc --noEmit`)
- Formatting (`npm run format:check`)
- Linting with auto import sort enforced (`npm run lint -- --max-warnings 0`)

### Local Commit Checks (Husky + lint-staged)

Before you commit, **Husky** runs:

- Prettier formatting (`npm run format`)
- ESLint auto-fix **including import sorting** (`npm run lint:fix`)

on staged files. If the checks fail, your commit will be blocked until you fix the issues.

#### Auto Import Sort

Import statements are **automatically sorted** using the [eslint-plugin-simple-import-sort](https://github.com/lydell/eslint-plugin-simple-import-sort) plugin.  
This is enforced both locally (during commits) and in CI.

---

## 💻 Recommended Editor Setup

### VS Code Extensions

- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- TypeScript and JavaScript Language Features (built in)

**VS Code will automatically:**

- Format code with Prettier on save
- Fix ESLint issues (including import sorting) on save
- Show TypeScript errors inline

### Other Editors

Configure your editor to:

- Use Prettier for formatting
- Run ESLint for linting and import sorting
- Format on save
- Auto-fix on save

---

## 📝 Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run preview` — Preview production build
- `npm run lint` — Run ESLint (including import sort)
- `npm run lint:fix` — ESLint with auto-fix (including import sort)
- `npm run format` — Format code with Prettier
- `npm run format:check` — Check formatting only
- `npm run check-all` — Run all code quality checks
- `npm run fix-all` — Apply all auto-fixes

---

## 🤝 Contributing

1. **Fork & clone** the repository.
2. **Create a new branch** for your feature or fix.
3. **Write code & commit** (Husky will check code quality).
4. **Push & open a pull request** to `main`.

All pull requests must pass code quality checks before merging.

---

## 📦 Tech Stack

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [ESLint](https://eslint.org/) + [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react), [eslint-plugin-react-hooks](https://github.com/facebook/react), [eslint-plugin-simple-import-sort](https://github.com/lydell/eslint-plugin-simple-import-sort)
- [Prettier](https://prettier.io/)
- [Husky](https://typicode.github.io/husky/)
- [lint-staged](https://github.com/okonet/lint-staged)
