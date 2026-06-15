// dependency-cruiser config — BACKEND (Node/Express, CommonJS)
// Lokalizacja w context/map/ celowa: faza eksploracji nie dotyka kodu projektu.
// Uruchamiać z roota repo:  depcruise backend/src --config context/map/dc-backend.cjs ...
module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'warn',
      comment: 'Cykl zależności w backendzie.',
      from: {},
      to: { circular: true },
    },
    {
      name: 'models-not-upward',
      severity: 'error',
      comment: 'Modele nie powinny importować controllers/routes (odwrócona warstwa).',
      from: { path: '^backend/src/models' },
      to: { path: '^backend/src/(controllers|routes)' },
    },
    {
      name: 'routes-direct-to-models',
      severity: 'info',
      comment: 'Trasa sięga wprost do modelu z pominięciem controller/service.',
      from: { path: '^backend/src/routes' },
      to: { path: '^backend/src/models' },
    },
    {
      name: 'controllers-direct-to-models',
      severity: 'info',
      comment: 'Kontroler sięga wprost do modelu z pominięciem warstwy services.',
      from: { path: '^backend/src/controllers' },
      to: { path: '^backend/src/models' },
    },
  ],
  options: {
    doNotFollow: { path: 'node_modules' },
    exclude: { path: 'node_modules' },
  },
};
