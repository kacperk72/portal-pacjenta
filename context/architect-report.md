# Raport architektoniczny — moduł 4 (10xArchitect)

> Sumaryczny dwustronicowy raport z modułu 4. Zbudowany **wyłącznie** z czterech artefaktów wytworzonych w lekcjach L2–L5; twierdzenia strukturalne oparte na artefaktach (`plik:linia`), nie na pamięci o kodzie.
> Autor: Kacper Kubit · Data: 2026-06-16

---

## 1. Opisane projekty

Wszystkie cztery artefakty powstały na **jednym** repozytorium — nie mieszam projektów.

| Repo | Stack | Skala (orientacyjnie) | Artefakty |
|---|---|---|---|
| **portal-pacjenta** | Angular (TS, frontend) + Node/Express (JS, CommonJS, backend); Sequelize/MySQL (rdzeń) + Mongoose/MongoDB (ankieta) + OpenAI (czat) | FE ~103 moduły / 148 zależności; BE 32 moduły / 37 zależności; 0 cykli po obu stronach (artifact-2) | L2, L3, L4, L5 |

Projekt pracy magisterskiej, funkcjonalnie zamrożony od 09.2024, solo-deweloperski (bus factor 1).

---

## 2. Mapa projektu (z L2 — `context/map/repo-map.md`)

1. **Struktura jest czysta, ból leży w martwym/zduplikowanym kodzie.** Zero cykli zależności po obu stronach; backend ma poprawną warstwowość `routes → controllers → services → models → config/db.js`. Realny dług: niedokończona migracja mysql2 → Sequelize zostawiła żywą ścieżkę `patient*2` obok martwej `patient*` oraz **3 technologie DB, z czego 2 martwe**.
2. **Strefy ryzyka:** duplikacja `patient*`/migracja DB; osierocone moduły (`patientController.js`, `adminRoutes.js`, `config/dbmongo.js`, `userDataService.js`); `config/db.js` jako globalny singleton (fan-in 7); przeciek warstwy `passportConfig → userModel`; brak testów + bus factor 1.
3. **Lokalne centra (huby):** `frontend/.../services` (najgorętszy obszar, 48 zmian — szew API), `dashboard.component.ts` (najwyższy churn komponentu), `app.routes.ts` (28 obszarów) i `backend/src/app.js` (23) jako huby okablowania.
4. **Entry pointy „pierwszego dnia":** `backend/src/app.js`, `config/db.js`, `app.routes.ts`, `data.service.ts`, żywa ścieżka `patientRoutes → patientController2 → patientModel2`.
5. **Najważniejszy unknown:** **granica FE↔BE jest `unknown` dla grafu importów** — dwa osobne codebase'y, żadna krawędź importu nie przekracza HTTP; kontrakt API odtworzony tylko ze współzmian gita. (Okno 12 mies. było merytorycznie puste → analiza na pełnej historii 2024–2026.)

---

## 3. Analiza ficzera (z L3 — `context/changes/appointment-booking-analysis/research.md`)

**Badany przepływ:** umawianie wizyty (appointment booking) — rdzeniowy przepływ produktu, wskazany przez mapę jako strefa ryzyka (szew FE↔BE = `unknown`) i kandydat „pierwszego dnia" (`visits.component.ts`).

**Feature overview:** przepływ **dwufazowy** na dwóch zasobach BE. Faza A — wyszukanie wolnego terminu: formularz → `POST /doctor/visits` → `DoctorSchedule.findAll` z `AvailableDate >= date` **i `AppointmentID IS NULL`**. Faza B — umówienie: payload składany w `visits.component.ts:106-117` (z `PatientID` z localStorage + `ScheduleID`) → `POST /appointment/add` → **transakcja Sequelige**: `Appointment.create` + `DoctorSchedule.update(AppointmentID=new)` + commit. Sukces = tylko `console.log` (brak feedbacku UI). Odczyt: dashboard → `GET /appointment/patient/:id`.

**Technical debt (3 najważniejsze; ≥1 potwierdzony ast-grep):**
- 🔴 **Szew kontraktu FE↔BE bez bariery** — FE typuje payload jako `any` (`appointment.service.ts:13`), BE przyjmuje surowy `req.body` bez walidacji (✅ ast-grep: zero `validationResult/joi/zod`, `express-validator` nieobecny w całym backendzie). Rozjazd `ScheduleID`: wysyłany przez FE, **nieobecny w `appointmentModel`** (✅ ast-grep: 0 trafień w modelu). Connascence znaczenia na dużym dystansie, bez osłony — zmiana pola wymaga ręcznej edycji w ≥3 miejscach w 2 połówkach repo.
- 🔴 **Brak autoryzacji — systemowy** (✅ doprecyzowane ast-grep: `passport.authenticate` nieużyty jako guard w **żadnym** route; `PatientID` z localStorage klienta → IDOR).
- 🟠 **Brak ochrony przed double-booking** (✅ ast-grep: `createAppointment` nie czyta zajętości slotu przed zapisem; `DoctorSchedule.update` nadpisuje `AppointmentID` bezwarunkowo). Plus: **0% realnego pokrycia testami** (BE bez runnera, FE 4 spec-i = sam scaffolding `toBeTruthy`).

---

## 4. Plan refaktoryzacji (z L4 — ranking `refactor-opportunities` + plan `appointment-contract-types`)

**Co refaktoryzowane (wybrana opcja K2):** typowany **kontrakt na szwie FE↔BE umawiania wizyty**. Docelowy kształt: kanoniczne typy TS na froncie (payload booka + kształt odpowiedzi) eliminujące `any`, oraz lustrzany, ręczny walidator wejścia w backendzie zwracający nazwany `400` zamiast surowego `500`. Cel: zmiana pola wizyty wychwytywana statycznie przez kompilator TS (jedyna dostępna osłona regresji) i odrzucana serwerowo przy złym wejściu.

**Czego świadomie NIE robimy:** repo-wide `any` (tylko szew wizyty); przeniesienia `ScheduleID` do modelu (zostaje polem transportowym); biblioteki walidacji (ręczny guard); auth/interceptora (K3); logiki double-booking (agregat/D1); runnera testów backendu (N1).

**Fazy (1 linia + weryfikacja):**
1. **Definicja kontraktu (typy FE)** — nowy `appointmentTypes.ts` (3 typy). *Auto:* `ng build`. *Ręcznie:* zgodność z `appointmentService.js:34-66`.
2. **Podstawienie typów (FE)** — koniec `any` w serwisie, typowany payload (+koercja `Number(PatientID)`) i odczyt na dashboard. *Auto:* `ng build`, `grep ": any"=0`. *Ręcznie:* umówienie e2e + render dashboardu.
3. **Lekki guard walidacji (BE)** — `validateBookAppointmentBody` w kontrolerze, `400` zamiast `500`. *Auto:* `node --check`, request bez pola → `400`, poprawny → `201`. *Ręcznie:* umówienie z UI.

*(Status: plan zrealizowany i zarchiwizowany — `context/archive/2026-06-15-appointment-contract-types/`.)*

---

## 5. Domena wg DDD (z L5 — `context/domain/`)

**Ubiquitous language (kluczowe pojęcia):** Wizyta (Appointment), Grafik lekarza / Termin (DoctorSchedule, slot wolny = `AppointmentID IS NULL`), Status wizyty (`zaplanowana → zakończona`), Ankieta przedwizytowa (PreAppointmentSurvey), Recepta/Diagnoza/Leczenie.

**Najważniejszy rozjazd model-vs-kod:** model deklaruje **pełen cykl życia wizyty** (status `zakończona`, diagnoza, leczenie, recepta), ale kod go nie egzekwuje ani w większości nie implementuje — `Appointment.update(Status)` = ZERO, `Prescription.create` = ZERO; `'zakończona'` jest tylko odczytywane, nigdy zapisywane (D-B). To klasyczny **anemiczny model**: encje bez zachowania, reguły rozproszone między UI, serwis i schemat.

**Niezmiennik #1 i agregat:** **I1 — jeden slot grafiku ma co najwyżej jedną wizytę (brak double-booking)**, należy do agregatu **Wizyta (Appointment)** jako root. Dziś **ignorowany** (`createAppointment` nadpisuje `AppointmentID` bezwarunkowo, `appointmentService.js:16-24`). Plan (02): `Appointment` jako jedyne miejsce egzekwowania reguł — `book()`/`complete()`, nazwane błędy domenowe (`SlotAlreadyBookedError`…), repozytorium z transakcją + lock wiersza, `UNIQUE` na `DoctorSchedule.AppointmentID`.

**Anti-Corruption Layer:** przecieka **Mongoose** w rdzeniowej (Core) domenie Ankiety — przez **4 warstwy / 5 plików** (`app.js:12,19-30`, `config/dbmongo.js` martwy, `schemas/surveySchema.js`, `services/surveyService.js`; + 3. kształt encji na FE `surveyTypes.ts`). „Model" domenowy JEST schematem biblioteki. Plan (03): framework-free VO `PreAppointmentSurvey` + wąski port `SurveyRepository` + adapter Mongoose jako jedyne miejsce wiedzy o bibliotece; kryterium sukcesu weryfikowalne grepem (`mongoose` tylko w adapterze + bootstrapie).

---

## 6. Decyzje, które należą do mnie

- **Wybór ficzera i kandydata refaktoru.** AI podsunęło ranking możliwości (K1 martwy kod, K2 kontrakt, K3 auth, agregat). Sam wybrałem **przepływ umawiania wizyty** jako rdzeniowy i **K2** do realizacji — bo szew FE↔BE to „cichy" dług dotykający obu połówek repo, a kompilator TS to jedyna dostępna dziś osłona; martwy kod (K1) i auth (K3) świadomie odłożyłem.
- **`ScheduleID` jako pole transportowe, nie pole modelu.** Rozstrzygnąłem, że pełne rozplecenie należy do agregatu Wizyta (osobny tor), a w K2 utrzymuję wąski zakres — to moja decyzja o granicy zmiany, nie sugestia narzędzia.
- **Ręczny guard zamiast biblioteki walidacji.** Świadomie odrzuciłem zod/joi/express-validator: brak runnera testów i zamrożony backend → minimalizuję footprint i nową zależność.
- **Rozjazd typu `PatientID` (string↔number).** Przegląd planu ujawnił, że `localStorage` daje string, a kontrakt chce `number`. To **ja** zdecydowałem o koercji w miejscu budowy payloadu + tolerancyjnym guardzie BE (koercowalność, nie surowy `typeof`), żeby Faza 2 i 3 trzymały jedną umowę — zamiast luzować typ.
- **Co uznałem za dług prawdziwy vs tani.** Odrzuciłem współzmiany z bulk-commitów (rename folderów, upgrade Angulara) jako mechaniczne; za prawdziwy dług uznałem szew FE↔BE i cykl `appointment↔doctorModel` — ta ocena ważności jest moja, oparta na artefaktach, nie na samej liczbie co-zmian.
