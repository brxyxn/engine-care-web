# Engine Care Web Application

## Getting Started

### Requirements

- Node.js v24

PNPM v10

If using Corepack to manage your package manager versions, enable PNPM with:

```bash
corepack enable pnpm
```

Then set PNPM to version 10.20.0:

```bash
corepack use pnpm@10.20.0
```

If you don't have Corepack installed, refer to the [Corepack documentation](https://nodejs.org/api/corepack.html) for
installation instructions.

If you don't want to use Corepack:

```bash
npm install -g pnpm@10.20.0
```

<details>

<summary>Teck Stack</summary>

- Next.js 16 with the App Router
- TypeScript
- Redux Toolkit for state management
- Tailwind CSS for styling
- PNPM as the package manager
- Turbopack for fast builds
- ESLint for code quality
- React Compiler for optimized React performance
- Import aliases for cleaner imports
- Prettier for code formatting
- Husky for Git hooks
- Lint-staged for pre-commit linting
- Commitlint for commit message linting [todo]
- Testing with Jest and React Testing Library [todo]

</details>

Install dependencies:

```bash
pnpm install
```

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

<details>

<summary>Project initialization</summary>

This project was initialized with:

```bash
npx create-next-app@latest --use-pnpm --src-dir --eslint --tailwind --ts --react-compiler --app --turbopack --import-alias="@/*" .
```

</details>

### Available Scripts

Add a new slice:

```bash
pnpm addSlice <slice-name>
```

This command generates a new Redux slice with actions, reducers, selectors, thunks, types, and initial state files
in the `redux` directory within its own folder. You will need to include the slice in the `slices.ts` file to register
it with the store.
