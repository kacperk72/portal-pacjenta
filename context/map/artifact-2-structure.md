---
artifact: "2 — Mapa strukturalna (dependency-cruiser)"
phase: "Faza 1 — Mapa repozytorium (Lekcja 2)"
created: 2026-06-15
tool: "dependency-cruiser 17.4.3"
inputs: ["context/map/artifact-1-territory.md"]
configs: ["context/map/dc-frontend.cjs", "context/map/dc-backend.cjs"]
scope:
  frontend: "frontend/src/app/**/*.ts (103 modułów, 148 zależności)"
  backend:  "backend/src/**/*.js (32 moduły, 37 zależności)"
tags: [structure, dependency-graph, exploration]
---

# Artefakt 2 — Mapa strukturalna: jak to jest zbudowane

> **Eksploracja, nie implementacja.** Wnioski z grafu zależności (dependency-cruiser). Żadnych zmian w kodzie.
> SVG/DOT **świadomie nie renderowany** na tym etapie (zgodnie z promptem; Graphviz i tak nieobecny — patrz koniec).

## Adaptacja ścieżek (prompt kursowy → portal-pacjenta)

Prompt mówi o `channels/src`, `platform/client`, `platform/types`. W tym repo (wg `kroki.md`):
warstwy frontu to `frontend/src/app/{components,services,types,pipes}`; backend to
`backend/src/{routes,controllers,services,models,config}`. Configi narzędzia trzymam w
`context/map/` (faza eksploracji nie dotyka plików projektu) i podaję przez `--config`.

> **Uwaga metodyczna o oknie czasowym:** z artefaktu 1 wynika, że kod jest funkcjonalnie
> zamrożony od końca 2024 r. Graf poniżej to **stan obecny struktury**, nie aktywność —
> i właśnie dlatego dobrze uzupełnia mapę terytorium.

---

## 3–5 najważniejszych obserwacji

1. **Front jest strukturalnie czysty.** 0 cykli zależności, granice warstw respektowane:
   `types`/`services` to fundament, `services` nie importuje z `components`. To zaskakująco
   dobry wynik jak na obszar o największym churnie (dashboard/visits/menu/ai-doctor z artefaktu 1).
2. **Backend ma poprawną warstwowość Express** — `app.js → routes → controllers → services →
   models → config(db.js)`. 0 cykli, 0 importów „w górę" z modeli. To **nie** jest spaghetti.
3. **Prawdziwy dług to martwy/zduplikowany kod, nie cykle.** Duplikacja `patient*` /
   `patient*2` to ślad **niedokończonej migracji bazy** (surowy `mysql2` → ORM Sequelize):
   wariant bez „2" jest **osierocony**, wariant „2" jest żywy.
4. **Trzy technologie bazodanowe w `config/`, z czego dwie martwe.** `db.js` (Sequelize/MySQL)
   żyje (fan-in 7); `dbmysql.js` (surowy mysql2) trzyma przy życiu tylko martwy `patientModel.js`;
   `dbmongo.js` (Mongoose) jest **całkowicie nieużywany**.
5. **Cztery osierocone moduły backendu** (nikt ich statycznie nie importuje): `patientController.js`,
   `config/dbmongo.js`, `routes/adminRoutes.js`, `services/userDataService.js`. To główni kandydaci
   do usunięcia — ale weryfikacja dynamicznych referencji należy do Fazy 2 (ast-grep/grep).

---

## Cykle w aktywnych obszarach

| Obszar | Co znalazłem | Dowód z dependency-cruiser | Dlaczego ważne przy zmianie | Związek z artefaktem 1 | Co sprawdzić dalej |
|---|---|---|---|---|---|
| `frontend/src/app/**` | **Brak cykli** | `no-circular`: 0 naruszeń, 103 moduły / 148 zależności | Zmiany w komponentach nie wciągają niespodziewanych pętli zwrotnych | Najwyższy churn (dashboard/visits/menu/ai-doctor) — mimo to bez cykli | — (czysto) |
| `backend/src/**` | **Brak cykli** | `no-circular`: 0 naruszeń, 32 moduły / 37 zależności | Warstwy nie zapętlają się — refactor jednej warstwy jest lokalny | Sprzężona trójka routes↔controllers↔models z artefaktu 1 jest **kierunkowa**, nie cykliczna | — (czysto) |
| `components/dashboard` | Komponent importuje inny komponent (`survey`) | `dashboard.component.ts → ../survey/survey.component` | Dashboard osadza survey → zmiana survey może dotknąć dashboardu | Pokrywa współzmianę `dashboard ↔ survey` (8) z artefaktu 1 | Czy to świadoma kompozycja, czy przeciek odpowiedzialności (Faza 3) |

> **Wniosek:** w tym repo cykle **nie są** problemem. Dług leży gdzie indziej (martwy kod, duplikacja, granice technologiczne).

---

## Granice warstw

| Sprawdzana granica | Wynik | Dowód z dependency-cruiser | Dlaczego ważne przy zmianie | Związek z artefaktem 1 | Co sprawdzić dalej |
|---|---|---|---|---|---|
| FE: `types` jako fundament | ✅ respektowana | reguła `types-is-foundation`: 0 naruszeń | `types` można zmieniać bez ryzyka pętli do UI | `types/` mały (1 plik `surveyTypes.ts`) | Czy typy pokrywają realne kontrakty API (Faza 2) |
| FE: `services` poniżej `components` | ✅ respektowana | reguła `services-not-to-components`: 0 naruszeń | `services` testowalne w izolacji od UI | `services` = najgorętszy obszar (48 zmian) i szew API | Mockowalność HttpClient (sekcja testów) |
| FE: kierunek `components → services` | ✅ zgodny | `dashboard.component.ts → services/{appointment,data,user}.service` | Standardowy wzorzec Angulara — przewidywalny | `data.service.ts` = „wspólny mianownik" z artefaktu 1 | — |
| BE: modele nie importują „w górę" | ✅ respektowana | reguła `models-not-upward`: 0 naruszeń | Modele są liśćmi — bezpieczne do zmiany od dołu | — | — |
| BE: `controllers → services → models` | ⚠️ głównie tak, 1 wyjątek | `controllers-direct-to-models` (info): `patientController.js → patientModel.js` | Pominięcie warstwy `services` = logika rozjeżdża się po kontrolerze | patientController.js to **orphan** (martwy) | Potwierdzić, że to martwa ścieżka, nie żywy bypass (Faza 2) |
| BE: `config` jako fundament | ❌ **przeciek w górę** | `passportConfig.js → models/userModel.js` | Konfiguracja auth sięga do warstwy danych → trudniej wydzielić auth | passport/SSO to wg `kroki.md` subdomena Generic | Czy to uzasadnione (passport potrzebuje modelu User) — Faza 3/4 (ACL) |

---

## Ryzyka testowalności

### Podsumowanie
Front jest **strukturalnie testowalny** (brak cykli, czyste warstwy) — ryzyko leży w
zależności od `HttpClient` w warstwie `services`. Backend jest **trudny do testów jednostkowych
w izolacji**, bo modele wiążą się z **singletonem połączenia DB w czasie importu** (`config/db.js`,
fan-in 7) — to globalny stan ładowany przy `require`.

### Lista ryzyk testowych
- **`config/db.js` jako globalny singleton (fan-in 7).** Każdy model robi `require("../config/db")`
  i tworzy instancję Sequelize przy załadowaniu modułu. Test jednostkowy modelu/serwisu wciąga realne
  połączenie → trzeba mockować moduł `db` albo iść w **test integracyjny** na bazie testowej.
- **`controllers` mieszają HTTP (`req`/`res`) z logiką.** Testy kontrolerów wymagają mocków
  `req`/`res` lub **testu integracyjnego** przez warstwę tras (supertest na `app.js`).
- **FE `services` zależą od `HttpClient`.** Naturalnie mockowalne `HttpTestingController` (test
  jednostkowy), ale to wciąż zależność do zaślepienia w każdym teście serwisu.
- **FE `dashboard` osadza wiele serwisów + komponent `survey`.** Dużo zależności do podstawienia →
  jeśli test ma sprawdzać przepływ end-to-end (np. umówienie wizyty), kandydat na **e2e (Playwright)**,
  nie test jednostkowy.

### Najbardziej podejrzane moduły
| Moduł | Dlaczego trudny / podejrzany | Rekomendowany poziom testu |
|---|---|---|
| `backend/src/config/db.js` | globalny singleton połączenia (fan-in 7), efekt uboczny przy imporcie | integracyjny (baza testowa) |
| `backend/src/controllers/*` | HTTP + logika w jednym; `patientController.js` martwy | integracyjny (supertest) |
| `frontend/.../dashboard.component.ts` | najwyższy churn, wiele serwisów + osadzony survey | e2e dla przepływu, jednostkowy dla logiki |
| `frontend/.../services/data.service.ts` | szew API, „wspólny mianownik" | jednostkowy z `HttpTestingController` |

---

## Martwy / zduplikowany kod (dowody strukturalne)

Osierocone moduły backendu (0 statycznych importerów; **wymaga potwierdzenia grep/ast-grep w Fazie 2** — graf nie łapie referencji dynamicznych):

| Moduł | Status | Dowód |
|---|---|---|
| `controllers/patientController.js` | orphan; importuje `patientModel.js` | nikt go nie `require`; `patientRoutes.js` używa `patientController2.js` |
| `models/patientModel.js` | quasi-martwy | importowany **tylko** przez orphana `patientController.js`; używa `config/dbmysql.js` |
| `config/dbmysql.js` | quasi-martwy (surowy mysql2) | używany tylko przez `patientModel.js` |
| `config/dbmongo.js` | **martwy** (Mongoose/MongoDB) | 0 importerów w całym repo |
| `routes/adminRoutes.js` | **niezamontowany** | brak referencji w `app.js` (sprawdzone grepem) |
| `services/userDataService.js` | orphan | importuje `patientModel2.js`, ale żaden kontroler go nie woła |

**Żywa ścieżka „patient":** `patientRoutes.js → patientController2.js → patientService.js →
patientModel2.js → config/db.js (Sequelize)`.
**Martwa ścieżka „patient":** `patientController.js → patientModel.js → config/dbmysql.js (raw mysql2)`.

> **Inferencja (do werdyktu w Fazie 3):** duplikaty `*`/`*2` + trzy configi DB to ślad
> **niedokończonej migracji** z surowego `mysql2` na Sequelize, z dodatkowym porzuconym
> eksperymentem MongoDB. Fakty (orphany, kto kogo importuje, jakiego connektora używa model) są
> dowodem; narracja „migracja" jest interpretacją.

---

## Co sprawdzić dalej (wejście do Fazy 2)

- **Potwierdzić martwy kod ast-grep/grep:** czy `patientController.js`, `adminRoutes.js`,
  `dbmongo.js`, `userDataService.js` mają **jakiekolwiek** referencje (też dynamiczne/string).
  Każde „zero importerów" potwierdzić drugim narzędziem (zasada przekrojowa #1).
- **Research przepływu (Faza 2):** naturalni kandydaci to **visits/appointment** i **survey** —
  oba w rdzeniu produktu i z czytelną, żywą ścieżką przez warstwy.
- **Granica `passportConfig → userModel`** — materiał na Anti-Corruption Layer / subdomenę Generic (Faza 4).

## Opcjonalny kolejny krok: graf

SVG **nie wygenerowany** — świadomie (prompt: render dopiero po selekcji) i technicznie
(**Graphviz/`dot` nieobecny** w systemie — patrz `kroki.md` 0.3). Gdy będzie potrzebny, najbardziej
wartościowy podgraf do renderu odpowiada na jedno pytanie — **„żywa vs martwa ścieżka patient"**:

```
depcruise "backend/src/**/*.js" --config context/map/dc-backend.cjs \
  --include-only "^backend/src/(routes|controllers|services|models|config)/(patient|db)" \
  --output-type dot | dot -T svg > context/map/patient-paths.svg
```

(wymaga instalacji Graphviz: `winget install graphviz`).
