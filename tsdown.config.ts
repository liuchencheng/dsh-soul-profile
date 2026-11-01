import { defineConfig } from 'tsdown'

export default defineConfig([
  { entry: { index: 'src/index.ts' }, format: 'esm', dts: true, clean: true, outDir: 'lib' },
  // Match the lazy CommonJS factory consumed by Harness's browser module loader.
  //
  // `react` alone is not enough: the automatic JSX runtime imports the subpath
  // `react/jsx-runtime`. Leaving it out inlines a second React copy that reads
  // `process.env.NODE_ENV` at module scope and throws in the browser.
  {
    entry: { client: 'src/client/index.tsx' }, format: 'cjs', dts: true, clean: false, outDir: 'lib',
    external: [/^@deepseek-ai\//, /^react(\/.*)?$/, /^react-dom(\/.*)?$/],
    outExtensions: () => ({ js: '.js' }),
    banner: "window.__ModuleLoader__.load({ id: 'dsh-soul-profile', factory: (require) => { var module = { exports: {} }; var exports = module.exports;",
    footer: 'return module.exports; } });',
  },
])
