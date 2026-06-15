---
date: 2026-06-15T20:40:00+0200
researcher: Kacper Kubit (via Claude Code, 3 równoległe sub-agenty)
git_commit: 70963c0b8db719665822193b82591a0266328ae2
branch: master
repository: portal-pacjenta
topic: "Refactor opportunities — które problemy długu naprawić, w jakim kształcie i kolejności"
tags: [research, refactor-opportunities, ranking, exploration, m4l4]
status: complete
last_updated: 2026-06-15
phase: "Faza 3 — Refactor opportunities (Lekcja 4)"
inputs:
  - context/changes/appointment-booking-analysis/research.md
  - context/map/repo-map.md
  - context/map/artifact-2-structure.md
  - context/map/artifact-1-territory.md
---

# Refactor opportunities — research

> **Twarde granice (przestrzegane):** zero zmian w kodzie, żaden refaktor, żadna decyzja.
> Dowody przed interpretacją. Docelowy kształt nazwany jednym zdaniem (bez projektowania
> architektury). Gdzie naprawa = przeprojektowanie pojęć biznesowych → przekazane do Fazy 4.
> Rygor: [E]vidence / [I]nference / [U]nknown. Ranking to **propozycja dla sesji planowania**, nie decyzja.

Wejście to zebrane dowody z `appointment-booking-analysis/research.md` (zweryfikowane ast-grep)
oraz mapy repo. Nie wyprowadzam ich na nowo — buduję na nich.

## Lista problemów i klasyfikacja (audyt)

| ID | Problem | Klasyfikacja |
|---|---|---|
| **K1** | Martwy kod + niedokończona migracja DB (`patientController.js`, `patientModel.js`, `dbmysql.js`, `dbmongo.js`, `adminRoutes.js`, `userDataService.js`) | **KANDYDAT** (usunięcie zmienia strukturę) |
| **K2** | Szew kontraktu FE↔BE bez bariery (`any`, brak DTO/walidacji, rozjazd `ScheduleID`) | **KANDYDAT** |
| **K3** | Brak egzekwowanej warstwy auth (systemowy) | **KANDYDAT** |
| **K4** | Sprzężenie `appointment ↔ doctorModel` (4× `require`, dwukierunkowe asocjacje) | **KANDYDAT** |
| **K5** | Podwójny eksport `getPatientAppointments` | **KANDYDAT** (mikro) |
| N1 | Zero realnego pokrycia testami | nie-kandydat (brak osłony, nie zmiana struktury) → wejście do wykonalności |
| N2 | Brak feedbacku UX po sukcesie booka | nie-kandydat (zachowanie/UX) |
| N3 | Hardcoded creds (`db.js`, `dbmysql.js`) + sekret sesji (`app.js:35`) | nie-kandydat (konfiguracja/sekrety) |
| **D1** | Brak ochrony przed double-booking + przejścia statusu wizyty | **GRANICA DDD** → Faza 4, nie ten etap |

---

## Ustalenia per kandydat (obecny kształt · intencjonalność · wykonalność)

### Kontekst nadrzędny dla WSZYSTKICH kandydatów: zero siatki bezpieczeństwa
[E] Brak `.github/workflows`, brak husky/git-hooks (tylko `*.sample`), backend bez runnera
(`backend/package.json:8` placeholder), frontend ma Karma/Jasmine ale 4 spec-i to tylko
`toBeTruthy()`. **Jedyny działający strażnik regresji to kompilator TS** (`ng build`/`tsc`) — i to
tylko po stronie frontu. To determinuje kolejność: najpierw to, co potwierdzalne statycznie.

### K1 — Martwy kod + niedokończona migracja DB
- **Obecny kształt [E]:** `patientController.js` **zakomentowany** w `patientRoutes.js:3` (żywa linia 4 = `patientController2`); `patientModel.js` importowany tylko przez martwego rodzica; `dbmysql.js` (surowy mysql2) tylko przez `patientModel.js`; `dbmongo.js` **0 importerów** (Mongo żyje przez inline `mongoose.connect` w `app.js:19-30` — martwy jest sam plik, nie technologia); `adminRoutes.js` **urodzony pusty** (blob `e69de29`), niezamontowany; `userDataService.js` 0 importerów. Grep po referencjach dynamicznych/string: brak (potwierdzone drugim narzędziem).
- **Intencjonalność [E]:** **świadoma migracja → porzucona**. Oryginały (mysql2) ze stycznia 2024; pivot na Sequelize w jednym commicie `44317d1 "backend good structure init"` (2024-02-25), który przełączył `patientRoutes` na `patientController2` i zostawił stary blok martwy. Werdykt: nośna decyzja w momencie podjęcia, ale **martwy ogon nigdy nie sprzątnięty** (presja magisterki, brak testów/lintera) → dziś przypadkowa złożoność.
- **Wykonalność [E/I]:** najłatwiejsza. Istniejąca abstrakcja wystarcza (to czyste usuwanie). Blast radius ~zero (0 żywych importerów). Odwracalność trywialna (`git revert`). Brak osłon akceptowalny — bezpieczeństwo daje graf statyczny.
- **Pierwszy krok-prerekwizyt [I]:** drugi, niezależny przebieg „zero referencji" obejmujący referencje **string/dynamiczne** dla każdego z 6 plików; dopiero potem usunąć martwy blok patient-DB jednym odwracalnym commitem.

### K2 — Szew kontraktu FE↔BE bez bariery
- **Obecny kształt [E]:** `appointment.service.ts:13` `bookAppointment(appointmentData: any): Observable<any>`, URL hardcoded (`:9`); wzorzec `any` szerszy (`data.service.ts:30,34,38`, `doctor.service.ts:13`). `frontend/src/app/types/surveyTypes.ts` istnieje, ale **nie ma typu `Appointment`**. Backend: **żadnej biblioteki walidacji** (`package.json` bez express-validator/joi/zod/class-validator). Rozjazd `ScheduleID` (FE+service, brak w modelu).
- **Intencjonalność [E/I]:** **przypadkowa złożoność**. Plik urodzony z `any` w `cdfa721` (2024-05-26); `git log -S "interface Appointment"` = 0 — typu nigdy nie było. `any` to domyślny styl FE, nie świadoma decyzja o luźnym szwie.
- **Wykonalność [E/I]:** wymaga **nowej** abstrakcji (typ + walidator), ale addytywnej i odwracalnej. Katalog `types/` już istnieje (wzorzec jest). **Kluczowe:** typowanie to nie tylko jakość — to *jedyna dostępna* osłona regresji (kompilator). Blast radius średni (≥3 miejsca w 2 połówkach).
- **Pierwszy krok-prerekwizyt [I]:** zdefiniować kanoniczny `interface Appointment` (TS) i podstawić pod `any` w `appointment.service.ts`; przy okazji rozstrzygnąć status `ScheduleID` (meta-pole transportowe vs pole modelu). Walidacja BE jako krok kolejny.

### K3 — Brak egzekwowanej warstwy auth
- **Obecny kształt [E]:** passport skonfigurowany (`passportConfig.js`, LocalStrategy) i zainicjowany globalnie (`app.js:41-42`), ale `passport.authenticate` **nieużyty jako guard w żadnym route**; `jsonwebtoken` w deps, niewpięty; FE `app.config.ts:28` `provideHttpClient()` bez interceptora. `PatientID` z localStorage, niezweryfikowany (IDOR).
- **Intencjonalność [E]:** **świadoma regresja**. Auth był na `/login` (passport), **usunięty** w `58405e3 "book visit changes"` (2024-03-03); guardów zasobów (`git log -S isAuthenticated/ensureAuth`) **nigdy nie było**. Konsekwentny, świadomy stan całego backendu.
- **Wykonalność [I]:** **najwyższy, systemowy blast radius**, najtrudniej odwracalna behawioralnie (włączenie guarda bez interceptora FE = 401 wszędzie). Zero osłon = najgroźniejsza zmiana przy 0% pokrycia.
- **Pierwszy krok-prerekwizyt [I]:** **najpierw** interceptor FE dołączający token (`withInterceptors`), **potem** guard na JEDNEJ trasie (kanarek), nie globalnie. Idealnie poprzedzone testami integracyjnymi.

### K4 — Sprzężenie appointment ↔ doctorModel
- **Obecny kształt [E]:** `appointmentService.js:2-5` — **4 osobne `require("../models/doctorModel")`**; `doctorModel.js:3` `require("./appointmentModel")` (dwukierunkowo); wszystkie asocjacje Sequelize zdefiniowane w `doctorModel.js:107-128` (hub rejestracji dla obu domen).
- **Intencjonalność [E/I]:** **przypadkowa**, narastała inkrementalnie `baa7343`→`abea320`→`d3155b4` (kolejna funkcja = kolejna linia `require` zamiast scalenia).
- **Wykonalność [I]:** dzieli się na dwie części. (a) Konsolidacja 4× `require` → jeden import: **mechaniczna, zerowe ryzyko, odwracalna** (`node --check`). (b) Zmiana **kierunku asocjacji** (rozplątanie cyklu): ryzykowna — `include`/`DoctorSchedule.update` to żywi konsumenci, bez testów trudno potwierdzić poprawność.
- **Pierwszy krok-prerekwizyt [I]:** zacząć **tylko** od konsolidacji `require`; rozplątanie cyklu odłożyć do czasu smoke-testu zapytań `include`.

### K5 — Podwójny eksport `getPatientAppointments`
- **Obecny kształt [E]:** `appointmentService.js:70-71` — klucz wymieniony 2× (no-op, ostatni nadpisuje).
- **Intencjonalność [E]:** **przypadkowa** — copy-paste w `d3155b4 "visit prescriptions added"` (nie merge: jeden rodzic). Przeżył do `final changes magisterka` bo brak lintera (`no-dupe-keys`)/testów.
- **Wykonalność [E]:** trywialna, no-op semantyczny, brak prerekwizytu. Kandydat „warm-up".

---

## 🏆 Refactor opportunities (ranked)

> Ranking wg **koszt długu vs koszt zmiany** przy realnym ograniczeniu: jedyna osłona to kompilator
> TS. Filozofia: najpierw zbuduj/odzyskaj bezpieczeństwo i klarowność, dopiero potem rusz to ryzykowne.
> Poprzedzone dwoma „warm-upami" zerowego ryzyka (K5, K4a) — patrz niżej.

### #1 — K1: Usunięcie martwego kodu i domknięcie migracji DB
- **Obecny → docelowy:** sześć martwych modułów + dwa porzucone connectory → jedna ścieżka pacjenta na Sequelize/`db.js`.
- **Czemu #1:** najwyższy stosunek wartości do ryzyka. Koszt długu **wysoki** (martwy kod + 3 pliki DB to główne źródło dezorientacji wg mapy — łatwo edytować zły plik), koszt zmiany **minimalny** (blast radius ~zero, odwracalne). Odblokowuje klarowność dla pozostałych prac.
- **Blast radius:** ~zero (0 żywych importerów; potwierdzone graf + grep).
- **Szkic ścieżki:** (1) weryfikacja string/dynamic-refs dla 6 plików; (2) usunięcie martwego bloku patient-DB jednym commitem; (3) usunięcie `dbmongo.js`/`adminRoutes.js`/`userDataService.js` osobnym commitem.
- **Pierwszy krok-prerekwizyt:** niezależny przebieg „zero referencji" obejmujący string/dynamic.

### #2 — K2: Współdzielony typ/DTO + walidacja na szwie FE↔BE
- **Obecny → docelowy:** `any` + niejawny rozjazd pól → kanoniczny `interface Appointment` (FE) + walidacja wejścia (BE), eliminujące cichy rozjazd kontraktu.
- **Czemu #2:** najwyższy koszt długu z całego zestawu (cichy rozjazd FE↔BE to #1 ryzyko z analizy appointment) i — kluczowo — **ta zmiana BUDUJE osłonę** (typ = jedyny dostępny strażnik regresji). Robi resztę bezpieczniejszą.
- **Blast radius:** średni (≥3 miejsca w 2 połówkach; rozjazd `ScheduleID`).
- **Szkic ścieżki:** (1) `interface Appointment` w `types/` + podstawienie pod `any` w `appointment.service.ts` (osłona kompilatora); (2) rozstrzygnięcie `ScheduleID`; (3) walidacja BE (dodanie biblioteki + guard w controllerze, zachowując zachowanie przy poprawnym wejściu).
- **Pierwszy krok-prerekwizyt:** definicja kanonicznego kształtu payloadu jako TS interface.

### #3 — K3: Egzekwowana warstwa autoryzacji
- **Obecny → docelowy:** otwarte endpointy + tożsamość z localStorage → middleware auth na chronionych trasach + interceptor FE + serwerowe wyprowadzanie `PatientID` z tożsamości.
- **Czemu #3:** najwyższa **waga** (dziura bezpieczeństwa/IDOR), ale najwyższy koszt i ryzyko zmiany (systemowy blast radius, behawioralnie trudna, zero osłon). Zasługuje na osobny, ostrożny plan — nie „przy okazji".
- **Blast radius:** wysoki, systemowy (każda chroniona trasa).
- **Szkic ścieżki:** (1) interceptor FE dołączający token; (2) guard na jednej trasie (kanarek); (3) stopniowe rozszerzanie + serwerowe `PatientID`. Idealnie po wprowadzeniu testów integracyjnych.
- **Pierwszy krok-prerekwizyt:** interceptor FE (`withInterceptors`) PRZED jakimkolwiek guardem BE.

---

## Warm-upy (zerowe ryzyko, poprzedzają top-3)
- **K5** — usunięcie zduplikowanego klucza eksportu (`appointmentService.js:70-71`). No-op, bez prerekwizytu. Dobry pierwszy commit „rozgrzewkowy".
- **K4a** — konsolidacja 4× `require("../models/doctorModel")` w jeden destrukturyzowany import. Mechaniczne, odwracalne, potwierdzalne `node --check`.

## Rozważone i odrzucone / przekierowane
- **K4b (kierunek asocjacji / rozplątanie cyklu)** — odłożone: żywi konsumenci `include` bez osłony testowej; ryzyko > wartość, dopóki nie ma smoke-testów.
- **N1 (testy)** — nie-kandydat strukturalny, ale **prerekwizyt jakości** dla K3 i bezpieczeństwa K2/K4b; naturalne wejście do osobnego planu testów.
- **N2 (feedback UX)** — zmiana zachowania/UX, nie struktury; drobny backlog produktowy.
- **N3 (sekrety/creds)** — konfiguracja/secret management (env, rotacja); ważne dla bezpieczeństwa, ale to nie refaktor struktury kodu.
- **D1 (double-booking + przejścia statusu wizyty)** — **GRANICA DDD.** Prawdziwa naprawa to egzekwowanie **niezmiennika biznesowego** (slot zajęty; legalne przejścia statusu), nie przemeblowanie struktury kodu. Zgodnie z twardą granicą promptu: **zatrzymuję się** — to materiał na Fazę 4 (agregat-strażnik niezmiennika), nie na ten ranking.

---

## Uwaga dla sesji planowania
Naturalna sekwencja wynikająca z dowodów: **K5 → K4a (warm-up) → K1 (klarowność, ~zero ryzyka) →
K2 (buduje osłonę typową) → K3 (po osłonach/testach)**. D1 i N1 to osobne tory (Faza 4 / plan testów).
Decyzja, co realizujemy, należy do `/10x-plan` — ten dokument jest tylko propozycją popartą dowodami.
