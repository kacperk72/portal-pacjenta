# Typy/DTO i walidacja na szwie FE↔BE umawiania wizyty (K2) — Implementation Plan

## Overview

Wprowadzamy **typowany kontrakt** dla szwu umawiania wizyty: kanoniczne typy TS na froncie
(payload booka + kształt odpowiedzi) eliminujące `any`, oraz **lekki, ręczny walidator wejścia** w
backendzie (bez nowej zależności) zwracający nazwany błąd `400` zamiast surowego `500`. Cel: zmiana
pola wizyty jest wychwytywana statycznie przez kompilator TS (jedyna dostępna osłona regresji) oraz
odrzucana po stronie serwera przy niepoprawnym wejściu.

## Current State Analysis

- `appointment.service.ts:13` — `bookAppointment(appointmentData: any): Observable<any>`; `:17`
  `getPatientAppointments(patientId: string): Observable<any>`; URL hardcoded (`:9`).
- `visits.component.ts:106-117` — ręcznie składany payload: `PatientID, DoctorID, AppointmentDate,
  Status:'zaplanowana', Diagnosis|null, Treatment|null, SurveyID:null, ScheduleID`.
- `appointmentController.js:3-13` — surowy `req.body` → `Appointment.create`, **zero walidacji**;
  ścieżka błędu zwraca surowy `500 error.message`.
- `dashboard.component.ts` — konsumuje odpowiedź `getPatientAppointments` nietypowaną: czyta
  `Status`, `Diagnosis`, `Treatment`, `Doctor?.Specialization`, `DoctorSchedule?.AvailableDate`.
- `appointmentService.js:34-66` — kształt odpowiedzi: `Appointment` + include `Doctor` (z
  `DoctorProfile` {FirstName, LastName}), `DoctorSchedule` {AvailableDate, TimeSlotFrom, TimeSlotTill},
  `Prescription` {Medicine, Dosage, Instructions}.
- `frontend/src/app/types/surveyTypes.ts` — istniejący wzorzec katalogu typów (do naśladowania).
- **Brak runnera testów backendu** (`backend/package.json:8` placeholder); `express-validator`/zod/joi
  nieobecne. Jedyna automatyczna osłona regresji to **kompilator TS** (front).

### Key Discoveries:
- `ScheduleID` jest wysyłany przez FE i używany do `DoctorSchedule.update`, **nie istnieje** w
  `appointmentModel.js` — decyzja: zostaje **polem meta-transportowym** w typie payloadu (jawnie
  oznaczonym), pełne rozplecenie należy do agregatu (plan `context/domain/02-...`).
- Backend to CommonJS JS — **nie da się literalnie współdzielić** typu TS; FE dostaje typ, BE dostaje
  niezależny ręczny walidator (mirror kontraktu).
- `userLocalStorageData.id` jest typu `string` (`user.service.ts:5,17`), a dziś `visits.component.ts:109`
  wysyła `PatientID` jako string. Decyzja (F1): koercujemy do `number` w miejscu budowy payloadu, a guard
  BE sprawdza **koercowalność**, nie surowy `typeof` — Faza 2 i 3 muszą trzymać tę samą umowę.

## Desired End State

`appointment.service.ts` nie zawiera `any` na ścieżce wizyty; payload booka i kształt odpowiedzi mają
nazwane typy TS; `visits.component.ts` i `dashboard.component.ts` używają tych typów (kompilator
wychwytuje rozjazd pól). Backend odrzuca niepoprawny payload booka kodem `400` z czytelnym
komunikatem; dla poprawnego wejścia zachowanie bez zmian (`201`). `ng build` przechodzi.

## What We're NOT Doing

- Nie ruszamy repo-wide wzorca `any` (data.service.ts, doctor.service.ts, chat.service.ts) — tylko szew wizyty.
- Nie przenosimy `ScheduleID` do modelu ani nie wyprowadzamy danych serwerowo (to agregat, plan 02).
- Nie dodajemy biblioteki walidacji (zod/joi/express-validator) — ręczny guard, bez nowej zależności.
- Nie dodajemy auth/interceptora (to K3) ani nie zmieniamy logiki double-booking (to agregat/D1).
- Nie ruszamy podwójnego eksportu `getPatientAppointments` w `appointmentService.js:70-71` (F3/K5) — leży
  w szwie, ale to osobny kandydat; przy edycji backendu w Fazie 3 nie „przy okazji" go naprawiamy.
- Nie wprowadzamy runnera testów backendu w tej zmianie (osobny tor — N1).
- Nie typujemy strony wyszukiwania (`bookVisit(visit: any)`, `getVisits` → `any`) — osobny krok. Skutek
  (F2): w Fazie 2 kompilator realnie sprawdza tylko `PatientID` i literał `Status`; `DoctorID`/`ScheduleID`/
  `AppointmentDate` lecą z `any` i nie są weryfikowane statycznie. Pełna osłona payloadu wymaga otypowania źródła `visit`.

## Implementation Approach

Trzy fazy, każda samodzielnie weryfikowalna `ng build`-em. Najpierw definicja typów (czysto
addytywna), potem podstawienie (kompilator zaczyna pilnować), na końcu lustrzany guard w backendzie.
Kolejność daje osłonę kompilatora zanim dotkniemy backendu.

## Phase 1: Definicja kontraktu (typy FE)

### Overview
Czysto addytywne wprowadzenie typów — nic nie konsumuje ich jeszcze, więc zero ryzyka regresji.

### Changes Required:

#### 1. Nowy plik typów wizyty
**File**: `frontend/src/app/types/appointmentTypes.ts`
**Intent**: Jedno kanoniczne źródło kształtu payloadu booka i odpowiedzi odczytu wizyt; naśladuje
wzorzec `surveyTypes.ts`. `ScheduleID` jawnie udokumentowany jako pole transportowe (nie część encji).
**Contract**: Eksportuje:
- `AppointmentStatus = 'zaplanowana' | 'zakończona'`
- `BookAppointmentPayload` — `PatientID:number; DoctorID:number; AppointmentDate:string;
  Status:AppointmentStatus; Diagnosis:string|null; Treatment:string|null; SurveyID:string|null;
  ScheduleID:number /* transport-only: zajęcie slotu, nie pole encji Appointment */`
- `PatientAppointment` — kształt odpowiedzi: `AppointmentID:number; PatientID:number; DoctorID:number;
  AppointmentDate:string; Status:AppointmentStatus; Diagnosis:string|null; Treatment:string|null;
  Doctor?: { Specialization:string; DoctorProfile?: { FirstName:string; LastName:string } };
  DoctorSchedule?: { AvailableDate:string; TimeSlotFrom:string; TimeSlotTill:string } | null;
  Prescriptions?: { Medicine:string; Dosage:string; Instructions:string }[] }`

### Success Criteria:
#### Automated Verification:
- `cd frontend && npm run build` przechodzi (nowy plik kompiluje się)
- Plik `frontend/src/app/types/appointmentTypes.ts` istnieje i eksportuje 3 nazwane typy
#### Manual Verification:
- Pola typu odpowiadają realnemu kształtowi z `appointmentService.js:34-66` (Doctor/DoctorProfile/DoctorSchedule/Prescription)

---

## Phase 2: Podstawienie typów (FE)

### Overview
Wpięcie typów w serwis i konsumentów; tu kompilator zaczyna pilnować kontraktu i wychwytuje rozjazdy.

### Changes Required:

#### 1. Serwis wizyt
**File**: `frontend/src/app/services/appointment.service.ts`
**Intent**: Zastąpić `any` typami z Fazy 1; sygnatury niosą kontrakt.
**Contract**: `bookAppointment(payload: BookAppointmentPayload): Observable<PatientAppointment>`;
`getPatientAppointments(patientId: string): Observable<PatientAppointment[]>`. Import z `../types/appointmentTypes`.

#### 2. Budowa payloadu przy umawianiu
**File**: `frontend/src/app/components/visits/visits.component.ts` (l. 106-117)
**Intent**: Otypować budowany obiekt jako `BookAppointmentPayload`, by kompilator wymusił zgodność
nazw/typów pól (wychwytuje m.in. rozjazd, gdyby pole zniknęło/zmieniło typ).
**Contract**: Lokalna zmienna payloadu anotowana typem `BookAppointmentPayload`.
**Uwaga (F1)**: `userLocalStorageData.id` jest typu `string` (`user.service.ts:5,17`), a payload wymaga
`PatientID: number` → koercja w miejscu budowy: `PatientID: Number(this.userLocalStorageData.id)`.
Świadoma zmiana zachowania na drucie (number zamiast string); kolumna PatientID jest liczbowa, Sequelize
i tak koercował. To jedyne pole realnie sprawdzane przez kompilator (pozostałe lecą z `visit: any` — patrz F2).

#### 3. Konsumpcja odpowiedzi na dashboardzie
**File**: `frontend/src/app/components/dashboard/dashboard.component.ts`
**Intent**: Otypować wynik `getPatientAppointments` jako `PatientAppointment[]`; pola czytane w
`classifyAppointments`/widoku (Status, Diagnosis, Treatment, Doctor.Specialization, DoctorSchedule.AvailableDate)
zyskują kontrolę typu.
**Contract**: Podstawienie typu w miejscu subskrypcji/przypisania; ewentualne `?.` zgodnie z opcjonalnością w typie.

### Success Criteria:
#### Automated Verification:
- `cd frontend && npm run build` przechodzi (kompilator akceptuje podstawienia)
- `grep -n ": any" frontend/src/app/services/appointment.service.ts` zwraca 0 trafień na ścieżce booka/odczytu
#### Manual Verification:
- Umówienie wizyty działa end-to-end w UI (payload wysyłany jak dotąd, `201`)
- Dashboard renderuje listę wizyt bez regresji (przyszłe/historyczne, diagnoza/leczenie)

**Implementation Note**: Po przejściu automatycznej weryfikacji zatrzymaj się na ręczne potwierdzenie (umówienie + dashboard) przed Fazą 3.

---

## Phase 3: Lekki guard walidacji (BE)

### Overview
Lustrzany walidator kontraktu po stronie serwera — nazwany błąd `400` zamiast surowego `500`; bez nowej zależności.

### Changes Required:

#### 1. Walidacja wejścia w kontrolerze
**File**: `backend/src/controllers/appointmentController.js` (createAppointment, l. 3-13)
**Intent**: Przed `Appointment.create` sprawdzić obecność i podstawowy typ wymaganych pól payloadu;
przy braku/niepoprawności zwrócić `400` z czytelnym komunikatem (nazwany błąd walidacji), zamiast
przepuszczać surowy `req.body` i kończyć generycznym `500`.
**Contract**: Wymagane pola: `PatientID`, `DoctorID`, `ScheduleID` — sprawdzane jako **obecne i koercowalne
do liczby** (`!Number.isNaN(Number(x))`), **nie** surowe `typeof === 'number'` (F1: FE może przysłać liczbę,
guard nie może wywrócić realnego ruchu); `AppointmentDate` (obecna, parsowalna data); `Status` (niepusty string).
Niepoprawne → `res.status(400).json({ error: 'Invalid appointment payload', details: [...] })`.
Poprawne → ścieżka bez zmian (`201`). Opcjonalnie wydzielić `validateBookAppointmentBody(body)` jako lokalną funkcję/util.

### Success Criteria:
#### Automated Verification:
- `node --check backend/src/controllers/appointmentController.js` przechodzi
- Ręczny request z brakującym `ScheduleID`/`PatientID` → odpowiedź `400` (curl/Postman)
- Ręczny poprawny request → `201` z utworzoną wizytą (zachowanie bez zmian)
#### Manual Verification:
- Umówienie wizyty z UI nadal działa (poprawny payload → `201`)
- Wymuszony niepoprawny payload zwraca `400` z czytelnym komunikatem, nie `500`

**Implementation Note**: Brak runnera testów backendu — weryfikacja `node --check` + ręczny request. To naturalny przyszły punkt na wprowadzenie pierwszych testów backendu (poza zakresem tej zmiany).

---

## Testing Strategy

### Unit Tests:
- Brak runnera w tej zmianie. (Przyszłość: walidator `validateBookAppointmentBody` jest czystą funkcją — idealny pierwszy unit test backendu.)

### Manual Testing Steps:
1. Umów wizytę przez UI → oczekiwane `201`, wizyta widoczna na dashboardzie po odświeżeniu.
2. Wyślij payload bez `ScheduleID` (curl) → oczekiwane `400` z komunikatem.
3. Dashboard: lista wizyt renderuje się bez regresji (diagnoza/leczenie/lekarz).

## Migration Notes
Brak zmian schematu/DB. `ScheduleID` pozostaje polem transportowym (bez migracji).

## References
- Research: `context/changes/appointment-booking-analysis/research.md` (szew FE↔BE)
- Ranking: `context/changes/refactor-opportunities/research.md` (kandydat K2)
- Powiązane: `context/domain/02-invariant-aggregate-refactor.md` (pełne rozplecenie ScheduleID/statusu — osobny tor)
- Kształt odpowiedzi: `backend/src/services/appointmentService.js:34-66`

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles.

### Phase 1: Definicja kontraktu (typy FE)
#### Automated
- [ ] 1.1 `cd frontend && npm run build` przechodzi (nowy plik kompiluje się)
- [ ] 1.2 `appointmentTypes.ts` istnieje i eksportuje 3 nazwane typy
#### Manual
- [ ] 1.3 Pola typu odpowiadają kształtowi z `appointmentService.js:34-66`

### Phase 2: Podstawienie typów (FE)
#### Automated
- [ ] 2.1 `cd frontend && npm run build` przechodzi
- [ ] 2.2 `grep ": any"` w `appointment.service.ts` = 0 na ścieżce booka/odczytu
#### Manual
- [ ] 2.3 Umówienie wizyty działa end-to-end (`201`)
- [ ] 2.4 Dashboard renderuje wizyty bez regresji

### Phase 3: Lekki guard walidacji (BE)
#### Automated
- [ ] 3.1 `node --check appointmentController.js` przechodzi
- [ ] 3.2 Request bez wymaganego pola → `400`
- [ ] 3.3 Poprawny request → `201` (bez zmian zachowania)
#### Manual
- [ ] 3.4 Umówienie z UI działa; niepoprawny payload → `400` z komunikatem, nie `500`
