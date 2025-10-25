# 10M Exit Planner

A strategic command center for achieving your 10M exit. Track milestones, financial metrics, and stay investor-ready with an intuitive dashboard built for founders.

## 🚀 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) with persist middleware
- **UI Components**: [Headless UI](https://headlessui.com/)
- **Icons**: [Heroicons](https://heroicons.com/)
- **Forms**: [React Hook Form](https://react-hook-form.com/)
- **Drag & Drop**: [@dnd-kit](https://dndkit.com/)
- **Date/Time**: [date-fns](https://date-fns.org/)
- **Math**: [decimal.js](https://mikemcl.github.io/decimal.js/)
- **Testing**: [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/)
- **Linting & Formatting**: [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/)
- **CI/CD**: GitHub Actions + Vercel

## 📋 Prerequisites

- Node.js 18.x or 20.x (LTS versions)
- npm (comes with Node.js)
- Git

## 🛠️ Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd 10m-exit-planner
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 📜 Available Scripts

| Command                 | Description                                         |
| ----------------------- | --------------------------------------------------- |
| `npm run dev`           | Start the development server                        |
| `npm run build`         | Build the production application                    |
| `npm run start`         | Start the production server (requires build first)  |
| `npm run preview`       | Alias for `npm run start`                           |
| `npm run lint`          | Run ESLint to check for code issues                 |
| `npm run test`          | Run unit tests once                                 |
| `npm run test:watch`    | Run tests in watch mode                             |
| `npm run test:coverage` | Run tests with coverage report                      |
| `npm run typecheck`     | Run TypeScript type checking without emitting files |
| `npm run format`        | Format code with Prettier                           |
| `npm run format:check`  | Check if code is formatted correctly                |

## 📁 Project Structure

```
/
├── .github/
│   └── workflows/         # GitHub Actions CI/CD workflows
├── public/                # Static assets
├── src/
│   ├── __tests__/         # Test files and setup
│   ├── app/               # Next.js 14 App Router pages
│   ├── components/        # React components
│   │   └── layout/        # Layout components (Sidebar, Shell, etc.)
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions and helpers
│   ├── store/             # Zustand state management
│   ├── styles/            # Global styles (if needed beyond Tailwind)
│   └── types/             # TypeScript type definitions
├── .eslintignore          # ESLint ignore patterns
├── .prettierignore        # Prettier ignore patterns
├── .prettierrc            # Prettier configuration
├── eslint.config.mjs      # ESLint configuration
├── next.config.ts         # Next.js configuration
├── package.json           # Project dependencies and scripts
├── postcss.config.mjs     # PostCSS configuration
├── tailwind.config.ts     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── vitest.config.ts       # Vitest testing configuration
```

## 🎨 Customizing the Theme

The project uses Tailwind CSS with custom theme tokens. You can customize colors, spacing, and other design tokens in `tailwind.config.ts`.

Key color palettes:

- **Primary**: Main brand colors for CTAs and highlights
- **Secondary**: Neutral grays for text and backgrounds
- **Success/Warning/Error**: Semantic colors for status feedback

## 🧪 Testing

Tests are written using Vitest and Testing Library. Test files are located in `src/__tests__/`.

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🚢 Deployment

### Vercel (Recommended)

This project is optimized for deployment on [Vercel](https://vercel.com/).

#### Automatic Deployment via GitHub Actions

The repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically deploys to Vercel when code is pushed to the `main` branch.

**Required GitHub Secrets:**

You need to add the following secrets to your GitHub repository settings (Settings → Secrets and variables → Actions):

1. **`VERCEL_TOKEN`**: Your Vercel authentication token
   - Generate at: https://vercel.com/account/tokens

2. **`VERCEL_ORG_ID`**: Your Vercel organization/team ID
   - Find in your Vercel project settings

3. **`VERCEL_PROJECT_ID`**: Your Vercel project ID
   - Find in your Vercel project settings

**Steps to set up:**

1. Create a new project on [Vercel](https://vercel.com/)
2. Link it to your GitHub repository
3. Copy the `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` from Vercel project settings
4. Generate a `VERCEL_TOKEN` from your Vercel account settings
5. Add all three secrets to your GitHub repository
6. Push to the `main` branch to trigger automatic deployment

#### Manual Deployment

If you prefer to deploy manually:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Other Platforms

The application can be deployed to any platform that supports Next.js:

- **Netlify**: Use the Netlify CLI or Git integration
- **AWS Amplify**: Connect your repository and configure build settings
- **Self-hosted**: Run `npm run build` then `npm run start`

## 🔒 Environment Variables

Create a `.env.local` file in the root directory for local environment variables:

```bash
# Add your environment variables here
# NEXT_PUBLIC_API_URL=https://api.example.com
```

Note: Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser.

## 🤝 Contributing

1. Create a new branch for your feature or bugfix
2. Make your changes
3. Ensure all tests pass: `npm run test`
4. Ensure code is formatted: `npm run format`
5. Ensure linting passes: `npm run lint`
6. Commit your changes with a descriptive message
7. Push to your branch and create a Pull Request

## 📝 Code Quality

This project maintains high code quality standards:

- **TypeScript** for type safety
- **ESLint** for code linting with rules for React Hooks, accessibility, and import sorting
- **Prettier** for consistent code formatting
- **Vitest** for unit testing
- **GitHub Actions** for automated CI/CD

## 📄 License

This project is private and proprietary.

## 🆘 Support

For questions or issues, please open an issue in the repository.

---

Built with ❤️ for founders building the next big thing.
