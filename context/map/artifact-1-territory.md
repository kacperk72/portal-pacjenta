---
artifact: "1 — Mapa terytorium (historia gita)"
phase: "Faza 1 — Mapa repozytorium (Lekcja 2)"
created: 2026-06-15
method: git history wide-scan
analysis_window: "deklarowane 12 mies. (od 2025-06-15); FAKTYCZNIE rozszerzone na pełną historię — patrz Ograniczenia"
repo_root: portal-pacjenta
tags: [territory, git-history, exploration]
---

# Artefakt 1 — Mapa terytorium: gdzie projekt żyje

> **Eksploracja, nie implementacja.** Ten dokument opisuje, gdzie kod był realnie dotykany,
> wyłącznie na podstawie historii gita. Żadnych zmian w kodzie.

## ⚠️ Najważniejsze ograniczenie metody (czytaj najpierw)

Zasada przekrojowa #5 mówi: okno analizy = 1 rok. **W tym repo okno 1-roczne jest puste merytorycznie.**

- Repo: **58 commitów**, zakres **2024-01-03 → 2026-06-14**.
- W ostatnich **12 miesiącach (od 2025-06-15): tylko 2 commity**, oba **nie-funkcjonalne**:
  - `70963c0` (2026-06-14) — „10xdevs init" → wyłącznie pliki `.claude/` (prompty + skille) + `frontend/tsconfig.json`.
  - `2cfabdb` (2026-04-12) — „libs upgrade" → tylko `package.json` / `package-lock.json`.
- **Wniosek:** w oknie 1-rocznym nie ma ani jednej zmiany w kodzie aplikacji. Mapa terytorium
  oparta tylko na tym oknie nie powiedziałaby nic o aplikacji.

**Decyzja:** analizę oparto na **pełnej historii** (2024–2026), z jawnym oznaczeniem. Ranking
poniżej dotyczy całego życia repo, nie ostatniego roku. To repo „dojrzałe i zamrożone" —
prawie cała praca hands-on wydarzyła się w 2024 r.

Druga pułapka (też obsłużona poniżej): **2024-10-04 nastąpił rename folderów** — wszystkie
ścieżki z surowej historii pod `frontend/src/app/shared/**` i `frontend/src/app/core/**` **już
nie istnieją** pod tymi nazwami. Zostały przeniesione do `components/**` i `services/**`. Każdy
ranking poniżej jest **znormalizowany do obecnych ścieżek**, żeby nie opierać analizy na plikach,
których już nie ma.

---

## 1. Aktywność — gdzie projekt był realnie dotykany (pełna historia, szum odfiltrowany)

Odfiltrowano: lockfile'y, `node_modules/`, `dist/`, `.claude/`, `package.json`, `tsconfig`,
`angular.json`, `*.json`, `README`, `.gitignore`. Ścieżki znormalizowane: `app/shared/`→`app/components/`,
`app/core/`→`app/services/`.

### a) TOP foldery / moduły

| # | Folder (obecna ścieżka) | Zmiany | Komentarz |
|---|---|---|---|
| 1 | `frontend/src/app/services` | 48 | **Najgorętszy obszar.** Warstwa integracji FE↔API; wchłonęła dawne `core/`. |
| 2 | `frontend/src/app/components/dashboard` | 42 | Centralny ekran pacjenta — najczęściej zmieniany komponent. |
| 3 | `frontend/src/app/components/visits` | 30 | Proces wizyt (kandydat na research, Faza 2). |
| 4 | `frontend/src/app/components/menu` | 29 | Nawigacja — dotykana przy prawie każdej nowej funkcji. |
| 5 | `frontend/src/app/components/ai-doctor` | 29 | Czat AI — duża, ruchliwa funkcja. |
| 6 | `frontend/src/app/components/survey` | 23 | Ankieta przedwizytowa (kandydat na research, Faza 2). |
| 7 | `frontend/src/app/components/login` | 19 | Logowanie / auth UI. |
| 7 | `backend/src/routes` | 19 | Warstwa tras Express. |
| 9 | `frontend/src/app/components/doctor-dashboard` | 18 | Widok lekarza. |
| 9 | `backend/src/controllers` | 18 | Kontrolery Express. |
| 11 | `backend/src/models` | 16 | Modele danych. |
| 12 | `backend/src/services` | 14 | Logika serwerowa. |
| 13 | `backend/src/config` | 12 | Konfiguracja (w tym 3 pliki DB — patrz niżej). |

### b) TOP pliki (znormalizowane)

| # | Plik | Zmiany |
|---|---|---|
| 1 | `frontend/src/app/components/dashboard/dashboard.component.ts` | 17 |
| 2 | `frontend/src/app/components/dashboard/dashboard.component.html` | 14 |
| 3 | `frontend/src/app/components/visits/visits.component.ts` | 11 |
| 3 | `frontend/src/app/components/menu/menu.component.html` | 11 |
| 3 | `frontend/src/app/components/ai-doctor/ai-doctor.component.html` | 11 |
| 6 | `frontend/src/app/components/menu/menu.component.ts` | 10 |
| 7 | `frontend/src/styles.css` | 9 |
| 7 | `frontend/src/app/components/visits/visits.component.html` | 9 |
| 7 | `frontend/src/app/components/ai-doctor/ai-doctor.component.ts` | 9 |
| 10 | `frontend/src/app/services/data.service.ts` | 8 |

> **Wszystkie pliki z TOP istnieją na dysku** pod podanymi (obecnymi) ścieżkami — zweryfikowane
> `git ls-files` + `test -f`. Brak „martwych" pozycji w rankingu.

**Wnioski z aktywności:** ciężar pracy leży na **froncie Angulara** (komponenty + warstwa
`services`), nie na backendzie. Rdzeń produktowy rysuje się jako **dashboard + visits + survey +
ai-doctor**. Backend jest spokojniejszy, ale to klasyczny układ Express (routes/controllers/
models/services) o równomiernej aktywności.

---

## 2. Kwartały — jak przesuwał się nacisk pracy

| Kwartał | Commity | Charakter |
|---|---|---|
| 2024 Q1 | 16 | Start projektu i budowa rdzenia. |
| **2024 Q2** | **22** | **Szczyt aktywności** — główny rozwój funkcji. |
| 2024 Q3 | 9 | Wygaszanie; m.in. rename folderów `shared→components` (2024-10-04 to początek Q4). |
| 2024 Q4 | 6 | Domykanie. |
| 2025 Q1 | 0 | Przerwa. |
| 2025 Q2 | 7 | **Wyłącznie maintenance:** Angular CLI/Material 17→18→19, prettier+eslint, „color fix". Zero funkcji. |
| 2025 Q3–2026 Q1 | 0 | Przerwa. |
| 2026 Q2 | 2 | Bump bibliotek + scaffolding 10xDevs. |

**Wniosek:** typowy projekt solo z jednym intensywnym oknem budowy (2024 H1), potem tylko
sporadyczny maintenance (upgrade'y zależności). Od strony funkcjonalnej kod jest **zamrożony od
końca 2024 r.** — to dobre wejście do refaktoryzacji legacy (nikt równolegle nie zmienia funkcji).

---

## 3. Współzmiany — co zmienia się razem

Pary katalogów najczęściej współwystępujące w jednym commicie (znormalizowane):

| Para | Wspólne commity | Interpretacja |
|---|---|---|
| `backend/controllers` ↔ `backend/routes` | 12 | Trzon backendu: nowy endpoint = trasa + kontroler. |
| `backend/controllers` ↔ `backend/models` | 10 | Kontrolery sięgają wprost do modeli (cienka/brak warstwa serwisowa w części flow). |
| `components/dashboard` ↔ `services` | 9 | Dashboard konsumuje API przez warstwę `services`. |
| `components/dashboard` ↔ `components/menu` | 9 | Dashboard i nawigacja zmieniają się razem. |
| `backend/models` ↔ `backend/routes` | 9 | Zmiana kształtu danych propaguje aż do tras. |
| `backend/controllers` ↔ `frontend/services` | 9 | **Szew kontraktu API** spina obie strony stosu. |
| `backend/routes` ↔ `frontend/services` | 8 | jw. — kontrakt FE↔BE. |
| `backend/models` ↔ `frontend/services` | 8 | jw. |

**Dwa sprzężone „rdzenie zmian":**
- **Backend:** `routes ↔ controllers ↔ models` to ściśle związana trójka — zmiana jednego elementu
  zwykle dotyka pozostałych. Warstwa `services` (backend) jest słabiej wpleciona → część logiki
  prawdopodobnie siedzi w kontrolerach (dług do zbadania w Fazie 2/3).
- **Cross-stack:** `frontend/src/app/services` jest **szwem integracyjnym** — zmiany w backendowych
  `routes/controllers/models` regularnie współwystępują z tą warstwą. To tu żyje kontrakt API.

### „Wspólny mianownik" — pojedyncze pliki spinające wiele obszarów

Pliki współwystępujące z największą liczbą **różnych** obszarów (rozpiętość, nie liczba commitów):

| Plik | Liczba różnych obszarów | Rola |
|---|---|---|
| `frontend/src/app/app.routes.ts` | 28 | **Hub routingu** — każdy nowy komponent dopina trasę. |
| `backend/src/app.js` | 23 | **Entry point backendu** — montaż tras i middleware. |
| `frontend/src/app/services/data.service.ts` | 20 | **Szew integracji FE↔API** (dawniej `core/data.service.ts`). |
| `frontend/src/styles.css` | 19 | Globalne style — zmiany wizualne przez cały front. |

To są naturalne „wspólne mianowniki" repo: dwa pliki-huby okablowania (`app.routes.ts`, `app.js`)
plus jeden szew integracyjny (`data.service.ts`) i globalne style (`styles.css`).

---

## 4. Obserwacje strukturalne potwierdzające podejrzenia z `kroki.md`

Potwierdzone `git ls-files` (istnieją obecnie w repo — to fakt strukturalny, nie jeszcze ocena długu):

- **Duplikacja kontrolerów:** `backend/src/controllers/patientController.js` **oraz** `patientController2.js`.
- **Duplikacja modeli:** `backend/src/models/patientModel.js` **oraz** `patientModel2.js`.
- **Dwa (trzy) silniki/konfiguracje bazy:** `backend/src/config/dbmysql.js`, `dbmongo.js`, `db.js`.
- **Mieszanka języków na backendzie:** w całości JS, ale pojedynczy `backend/src/types/user.entity.ts` (samotny TS).
- **Testy:** komponenty mają domyślne `*.spec.ts` (Angular scaffolding); czy to realne pokrycie —
  do weryfikacji w Fazie 2 (`kroki.md` zakłada „brak warstwy testów"). Tu tylko odnotowane, bez przesądzania.

---

## Notatki o wiarygodności (co jest dowodem, co domysłem)

- **Dowód (git):** rankingi, kwartały, współzmiany, rename z 2024-10-04, istnienie plików.
- **Inferencja:** „logika w kontrolerach zamiast serwisów", „rdzeń = visits/survey/ai-doctor" —
  prawdopodobne z wzorców współzmian, ale **niezweryfikowane strukturalnie**. Weryfikacja:
  dependency-cruiser (1.2) + ast-grep (Faza 2).
- **Unknown (dozwolone):** dlaczego istnieją duplikaty `*2.js` i trzy pliki DB — historia nie
  wyjaśnia intencji. Do zbadania w Fazie 3 (intencjonalność).

## Wejście do następnych kroków

- **1.2 (dependency-cruiser):** sprawdź cykle w `frontend/src/app/{components,services}` oraz
  sprzężenia `backend` routes↔controllers↔models; zweryfikuj, czy `services`/`types` są fundamentem.
- **1.3 (kontrybutorzy):** repo solo-deweloperskie — dwie tożsamości git, ale ta sama osoba
  (`Kacper Kubit <…@gmail.com>` 57 commitów + alias GitHub `kacperk72` 5 commitów). Krok da cienki
  wynik — zaznaczyć jako ograniczenie.
- **Faza 2 (research):** naturalni kandydaci z mapy to **visits (proces wizyty)** i **survey
  (ankieta przedwizytowa)** — oba w TOP aktywności i w rdzeniu produktu.
