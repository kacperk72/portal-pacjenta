// dependency-cruiser config — FRONTEND (Angular/TS)
// Lokalizacja w context/map/ celowa: faza eksploracji nie dotyka kodu projektu.
// Uruchamiać z roota repo:  depcruise frontend/src/app --config context/map/dc-frontend.cjs ...
module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'warn',
      comment: 'Cykl zależności — utrudnia zmianę i testowanie w izolacji.',
      from: {},
      to: { circular: true },
    },
    {
      name: 'services-not-to-components',
      severity: 'error',
      comment: 'services to fundament — nie powinno importować z components.',
      from: { path: '^frontend/src/app/services' },
      to: { path: '^frontend/src/app/components' },
    },
    {
      name: 'types-is-foundation',
      severity: 'error',
      comment: 'types to najniższa warstwa — nie powinno importować components/services.',
      from: { path: '^frontend/src/app/types' },
      to: { path: '^frontend/src/app/(components|services)' },
    },
  ],
  options: {
    doNotFollow: { path: 'node_modules' },
    exclude: { path: '(\\.spec\\.ts$|node_modules)' },
    tsConfig: { fileName: 'frontend/tsconfig.json' },
    tsPreCompilationDeps: true,
  },
};
