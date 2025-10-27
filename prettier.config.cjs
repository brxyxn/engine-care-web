/** @type {import("prettier").Config} */
module.exports = {
    singleQuote: false,
    tabWidth: 2,
    trailingComma: "es5",
    semi: false,
    printWidth: 80,
    jsxSingleQuote: false,
    overrides: [
        {
            files: ["*.md", "*.mdx"],
            options: {
                parser: "markdown",
                tabWidth: 4,
            },
        },
        {
            files: ["*.yaml", "*.yml"],
            options: {
                parser: "yaml",
                tabWidth: 4,
            },
        },
        {
            files: ["*.css", "*.scss", "*.less"],
            options: {
                parser: "css",
                tabWidth: 4,
            },
        },
        {
            files: ["*.test.ts", "*.test.tsx", "*.spec.ts", "*.spec.tsx"],
            options: {
                tabWidth: 2,
                semi: true,
            },
        },
        {
            files: ["*.html"],
            options: {
                parser: "html",
                tabWidth: 4,
            },
        },
        {
            files: ["eslint.config.mjs", "prettier.config.cjs", "postcss.config.mjs"],
            options: {
                tabWidth: 2,
                semi: true,
            },
        },
    ],
    importOrder: [
        "^@testing-library/(.*)$",
        "^@jest",
        "^react",
        "^react/(.*)$",
        "^next",
        "^next/(.*)$",
        "^@next",
        "<THIRD_PARTY_MODULES>",
        "^@ui/(.*)$",
        "^@components/(.*)$",
        "^@/*",
        "^@repo/(.*)$",
        "^lucide-react",
        "^@icons*",
        "^[./]",
    ],
    plugins: [
        "prettier-plugin-tailwindcss",
        "@trivago/prettier-plugin-sort-imports",
    ],
};
