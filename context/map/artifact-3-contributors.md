---
artifact: "3 — Mapa kontrybutorów (git)"
phase: "Faza 1 — Mapa repozytorium (Lekcja 2)"
created: 2026-06-15
inputs: ["context/map/artifact-1-territory.md", "context/map/artifact-2-structure.md"]
method: git authorship analysis
analysis_window: "deklarowane 12 mies.; faktycznie pełna historia — patrz Ograniczenia"
tags: [contributors, git, exploration, solo-project]
---

# Artefakt 3 — Mapa kontrybutorów: kto wie co i o co zapytać

> **Eksploracja, nie implementacja.**

## ⚠️ Ograniczenie nadrzędne (czytaj najpierw): to repo jest solo-deweloperskie

Cała historia (58 commitów) ma **jednego autora-człowieka** występującego pod **dwiema
tożsamościami git** — to ta sama osoba:

| Tożsamość git | Commity | Uwaga |
|---|---|---|
| `Kacper Kubit <kacper.kubit99@gmail.com>` | 57 | główna tożsamość |
| `kacperk72 <…@users.noreply.github.com>` | 5 | alias GitHub (web-commity), ta sama osoba |

- **Botów / agentów AI: ZERO.** Przeszukano autorów pod kątem `bot`, `[bot]`, `claude`, `codex`,
  `copilot`, `github-actions`, `dependabot` — brak trafień. Cały kod ma autorstwo człowieka.
- **Okno 12-mies. jest puste merytorycznie** (jak w artefakcie 1): 2 commity, oba Kacper Kubit,
  oba nie-funkcjonalne (libs upgrade + scaffolding 10xDevs). Atrybucję obszarów oparłem więc na
  **pełnej historii**, z jawnym oznaczeniem.

**Konsekwencja dla „linii wsparcia":** klasyczna mapa „kogo zapytać o obszar X" jest tutaj
zdegenerowana — odpowiedź na każdy obszar to **ta sama osoba (Kacper Kubit)**. Wartość tego kroku
nie leży w rozdziale wiedzy między ludzi, lecz w **bus factor = 1** i w sygnałach o
intencjonalności (patrz niżej).

---

## Sygnał o naturze projektu (ważny dla Fazy 3 — intencjonalność)

Komunikaty commitów zdradzają kontekst: **to projekt pracy magisterskiej.**

- `final changes magisterka` (2024-09-27) — domknięcie zakresu pod obronę.
- `cleaning comments` (2024-09-27) — kosmetyka przed oddaniem, nie refaktor architektury.

**Dlaczego to istotne:** w projekcie magisterskim duplikaty (`patient*` / `patient*2`), porzucony
`dbmongo.js` i niezamontowany `adminRoutes.js` to najpewniej **ślady eksperymentów/iteracji pod
presją terminu**, nie świadome decyzje architektoniczne. To **hipoteza do weryfikacji w Fazie 3**
(historia + intencjonalność), nie werdykt — ale przesuwa prawdopodobieństwo w stronę
„przypadkowa złożoność" niż „świadome ograniczenie".

---

## Top 5 obszarów wymagających „kontaktu z autorem" (z artefaktów 1+2)

Wybrane wg ryzyka i niejasności intencji, nie wg samej aktywności:

| # | Obszar | Dlaczego wymaga wyjaśnienia | Źródło |
|---|---|---|---|
| 1 | **Duplikacja `patient*` + migracja DB** (`controllers`, `models`, `config`) | Żywa ścieżka Sequelize vs martwa ścieżka mysql2 — czy `dbmongo.js`/`patientController.js` można usunąć? | artefakt 2 |
| 2 | **`frontend/src/app/services`** (szew API) | Najgorętszy obszar i „wspólny mianownik"; kontrakt FE↔BE | artefakty 1+2 |
| 3 | **`components/dashboard`** | Najwyższy churn (20 zmian autora); osadza `survey` | artefakty 1+2 |
| 4 | **Przepływy rdzeniowe: `visits` + `survey`** | Kandydaci na research Fazy 2; logika biznesowa wizyty/ankiety | artefakt 1 |
| 5 | **Auth/SSO: `passportConfig → userModel`, `adminRoutes` (martwy)** | Przeciek warstwy config→models; niezamontowana trasa admina | artefakt 2 |

---

## Linia wsparcia — kto pracował przy obszarze (pełna historia)

Wszystkie obszary: **100% Kacper Kubit**. Kolumna „ostatnio dotknięty" pokazuje, jak świeża jest
wiedza autora o danym obszarze (im starsze, tym większe ryzyko, że szczegóły wywietrzały).

| Obszar | Autor (commity) | Ostatnio dotknięty | Charakter ostatniej zmiany |
|---|---|---|---|
| `backend/src/routes` | Kacper Kubit (14) | 2024-09-22 | logika (login/profile) — **najstarszy, ~21 mies. temu** |
| `backend/src/controllers` | Kacper Kubit (14) | 2024-09-27 | `cleaning comments` (kosmetyka) |
| `backend/src/models` | Kacper Kubit (12) | 2024-09-27 | `final changes magisterka` |
| `backend/src/config` | Kacper Kubit (8) | 2024-09-27 | `cleaning comments` |
| `frontend/.../components/dashboard` | Kacper Kubit (20) | 2025-04-06 | tylko maintenance (`app color fix`) |
| `frontend/.../components/visits` | Kacper Kubit (12) | 2025-04-06 | tylko upgrade Angulara |
| `frontend/.../components/survey` | Kacper Kubit (10) | 2025-04-06 | tylko upgrade Angulara |
| `frontend/src/app/services` | Kacper Kubit (1*) | 2024-10-04 | `folder names change` (rename `core→services`) |

\* Zaniżone: katalog `services/` powstał z `core/` dopiero przy renamie 2024-10-04, więc licznik
commitów dotyczy tylko ścieżki po renamie. Autorstwo i tak w 100% Kacper Kubit.

### Pogrupowanie tematyczne (kto czego dotykał — tu: jedna osoba, różne tematy)
- **Backend/dane:** routes, controllers, models, config — domknięte pod magisterkę (wrzesień 2024), od tego czasu **zamrożone**.
- **Frontend/UI:** dashboard, visits, survey, services — żywsze, ale od końca 2024 tylko **maintenance** (upgrade'y, kosmetyka), bez nowych funkcji.

---

## Ryzyka i wnioski

- **Bus factor = 1.** Cała wiedza domenowa i architektoniczna jest u jednej osoby. Brak
  redundancji wiedzy → przy każdej niejasności jedyne źródło to autor (lub dokumentacja, której
  brak) — stąd waga artefaktów `context/` jako pamięci projektu.
- **Wiedza o backendzie jest „stara".** Ostatnie realne zmiany backendu to wrzesień 2024 (~21 mies.
  temu). Szczegóły decyzji (np. po co `dbmongo.js`) mogły się zatrzeć nawet u autora → tym ważniejsza
  weryfikacja narzędziowa (ast-grep/grep) zamiast polegania na pamięci.
- **Brak commitów AI/botów** = historia jest „czysta" do analizy — żadnego szumu z automatów do
  odfiltrowania (czego prompt każe pilnować w repo zespołowych).

## Wejście do następnych kroków
- **1.4 (synteza repo-map):** w sekcji „kogo zapytać" wpisać wprost: **solo, bus factor 1, autor =
  Kacper Kubit**; mapa kontrybutorów nie różnicuje obszarów.
- **Faza 3 (intencjonalność):** hipoteza „dług = ślady projektu magisterskiego pod presją czasu,
  nie świadome decyzje" — zweryfikować na historii konkretnych plików `patient*` / `dbmongo.js`.
