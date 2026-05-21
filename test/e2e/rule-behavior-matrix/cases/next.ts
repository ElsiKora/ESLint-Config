import type { IRuleBehaviorCase } from "../types";
import { createCase } from "../case-factory";

export const RULE_BEHAVIOR_NEXT_CASES: Array<IRuleBehaviorCase> = [
	createCase("next", "@next/next/google-font-display", { withNext: true }, "pages/index.jsx", `export default function Page() {\n\treturn <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet" />;\n}\n`),
	createCase("next", "@next/next/google-font-preconnect", { withNext: true }, "pages/_document.jsx", `export default function Document() {\n\treturn <link href="https://fonts.gstatic.com" />;\n}\n`),
	createCase("next", "@next/next/inline-script-id", { withNext: true }, "pages/index.jsx", `import Script from "next/script";\nexport default function Page() {\n\treturn <Script>{\`console.log("x")\`}</Script>;\n}\n`),
	createCase("next", "@next/next/next-script-for-ga", { withNext: true }, "pages/index.jsx", `export default function Page() {\n\treturn <script src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>;\n}\n`),
	createCase("next", "@next/next/no-assign-module-variable", { withNext: true }, "pages/index.jsx", `const module = {};\nexport default module;\n`),
	createCase("next", "@next/next/no-async-client-component", { withNext: true }, "app/page.jsx", `"use client";\nexport default async function Page() {\n\treturn <div />;\n}\n`),
	createCase("next", "@next/next/no-before-interactive-script-outside-document", { withNext: true }, "pages/index.jsx", `import Script from "next/script";\nexport default function Page() {\n\treturn <Script strategy="beforeInteractive" src="/before.js" />;\n}\n`),
	createCase("next", "@next/next/no-css-tags", { withNext: true }, "pages/index.jsx", `export default function Page() {\n\treturn <link rel="stylesheet" href="/style.css" />;\n}\n`),
	createCase("next", "@next/next/no-document-import-in-page", { withNext: true }, "pages/index.jsx", `import Document from "next/document";\nexport default function Page() {\n\treturn <Document />;\n}\n`),
	createCase("next", "@next/next/no-duplicate-head", { withNext: true }, "pages/_document.jsx", `import Document, { Head, Html, Main, NextScript } from "next/document";\nexport default class MyDocument extends Document {\n\trender() {\n\t\treturn <Html><Head /><Head /><body><Main /><NextScript /></body></Html>;\n\t}\n}\n`),
	createCase("next", "@next/next/no-head-element", { withNext: true }, "pages/index.jsx", `export default function Page() {\n\treturn <head><title>Home</title></head>;\n}\n`),
	createCase("next", "@next/next/no-head-import-in-document", { withNext: true }, "pages/_document.jsx", `import Head from "next/head";\nexport default function Document() {\n\treturn <Head />;\n}\n`),
	createCase("next", "@next/next/no-html-link-for-pages", { withNext: true }, "test/e2e/fixture/next/pages/index.jsx", `export default function Page() {\n\treturn <a href="/rule-behavior-matrix-next-page">About</a>;\n}\n`, "reported", { settings: { next: { rootDir: "test/e2e/fixture/next" } } }),
	createCase("next", "@next/next/no-img-element", { withNext: true }, "pages/index.jsx", `export default function Page() {\n\treturn <img src="/logo.png" alt="logo" />;\n}\n`),
	createCase("next", "@next/next/no-page-custom-font", { withNext: true }, "pages/index.jsx", `export default function Page() {\n\treturn <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet" />;\n}\n`),
	createCase("next", "@next/next/no-script-component-in-head", { withNext: true }, "pages/index.jsx", `import Head from "next/head";\nimport Script from "next/script";\nexport default function Page() {\n\treturn <Head><Script src="/script.js" /></Head>;\n}\n`),
	createCase("next", "@next/next/no-styled-jsx-in-document", { withNext: true }, "pages/_document.jsx", `export default function Document() {\n\treturn <style jsx>{\`body { color: red; }\`}</style>;\n}\n`),
	createCase("next", "@next/next/no-sync-scripts", { withNext: true }, "pages/index.jsx", `export default function Page() {\n\treturn <script src="/legacy.js"></script>;\n}\n`),
	createCase("next", "@next/next/no-title-in-document-head", { withNext: true }, "pages/_document.jsx", `import { Head } from "next/document";\nexport default function Document() {\n\treturn <Head><title>Bad</title></Head>;\n}\n`),
	createCase("next", "@next/next/no-typos", { withNext: true }, "pages/index.jsx", `export const getStaticPropss = () => ({ props: {} });\n`),
	createCase("next", "@next/next/no-unwanted-polyfillio", { withNext: true }, "pages/index.jsx", `export default function Page() {\n\treturn <script src="https://polyfill.io/v3/polyfill.min.js?features=Array.prototype.includes"></script>;\n}\n`),
];
