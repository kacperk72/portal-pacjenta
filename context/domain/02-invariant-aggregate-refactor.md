---
title: "Agregat-strażnik niezmiennika: Wizyta (ekskluzywność slotu + pochodzenie statusu)"
created: 2026-06-15
type: refactor-plan
phase: "Faza 4 — Domain-Driven Design (Lekcja 5)"
inputs: ["context/domain/01-domain-distillation.md", "context/changes/appointment-booking-analysis/research.md"]
tags: [ddd, aggregate, invariant, refactor-plan, appointment, exploration]
---

# Plan: agregat-strażnik niezmiennika Wizyty

> **Produkt to PLAN, nie implementacja.** Zero zmian w kodzie produkcyjnym. Cytaty zweryfikowane.
> Zasada: **fail-fast** — nielegalna operacja zatrzymuje, nie „loguje-i-jedzie dalej".

## KROK 0 — Kontekst (skrót, pełne w `01-domain-distillation.md`)
- **Brak dokumentów wymagań** (brak PRD); wizja z `README.md:7`. Słownik i subdomeny — patrz artefakt 01.
- **Stack/warstwy:** Express (routes → controllers → services → models Sequelize). **Brak warstwy
  domeny** — reguły wizyty rozsmarowane między UI Angulara, `service` i model. Brak testów/CI
  (jedyny strażnik regresji to kompilator TS na froncie).

## KROK 1 — Niezmienniki biznesowe (z artefaktu 01)
| Id | Niezmiennik | Źródło |
|---|---|---|
| I1 | Jeden slot grafiku ma **co najwyżej jedną** wizytę (brak double-booking) | FK `DoctorSchedule.AppointmentID` (`doctorModel.js:57-64`), filtr wolnych slotów (`doctorService.js:91-94`) |
| I2 | Status wizyty podąża cyklem `zaplanowana → zakończona`; status nadaje **dziedzina**, nie klient | `visits.component.ts:112` (klient ustawia `'zaplanowana'`), `doctor-dashboard.component.ts:102` |
| I3 | Diagnoza/Leczenie/Recepta istnieją tylko dla **zakończonej** wizyty | `appointmentModel.js:28-39`, `doctorModel.js:72-114` |
| I4 | Wizyta wskazuje **istniejący** termin | `visits.component.ts:116` (`ScheduleID`) |

## KROK 2 — Klasyfikacja i wybór #1

| Niezmiennik | (a) rdzeniowość | (b) rozsmarowanie | (c) egzekwowanie | Ocena |
|---|---|---|---|---|
| **I1 slot ekskluzywny** | **wysoka** (każde umówienie; integralność danych) | UI(search) + service + model — 3 warstwy | **IGNOROWANY** przy zapisie (silent overwrite) | **najmocniejszy kandydat** |
| I2 cykl/pochodzenie statusu | wysoka | UI ustawia status, backend nigdy nie waliduje | naruszalny; **klient jedynym autorem** | silny (współwłasność agregatu) |
| I3 diagnoza tylko dla zakończonej | średnia | model deklaruje, kod nie implementuje | NIEZAIMPLEMENTOWANY | osobny zakres (cała ścieżka zakończenia brakuje) |
| I4 istniejący termin | średnia | UI + service | częściowy | mieści się w I1 |

**Wybór #1: I1 — ekskluzywność slotu (brak double-booking).** Jest jednocześnie **najbardziej
rdzeniowy** (dotyczy każdego umówienia, a jego złamanie = ciche zniszczenie danych: dwie wizyty na
ten sam termin / nadpisany `AppointmentID`) **i najsłabiej egzekwowany** (zapis nie sprawdza nic —
`appointmentService.js:16-24`; jedyny „filtr" jest w *wyszukiwaniu*, czyli po stronie prezentacji,
nie zapisu). Agregat, który go pilnuje, naturalnie staje się też jedynym miejscem nadawania statusu
(**I2** — dziś nadawanego przez klienta), więc plan obejmuje I1 jako rdzeń + I2 jako współwłasność
tego samego roota.

## KROK 3 — Diagnoza (gdzie dziś żyje reguła)

| Warstwa | Co robi z niezmiennikiem | Dowód |
|---|---|---|
| UI (Angular) | Buduje payload, **nadaje `Status: 'zaplanowana'`** i `ScheduleID`; „walidacja" to tylko blokada przycisku szukania | `visits.component.ts:106-117` (status `:112`) |
| Wyszukiwanie (service) | Pokazuje **tylko wolne** sloty (`AppointmentID IS NULL`) — to jedyne miejsce, gdzie reguła w ogóle istnieje, ale to **prezentacja**, nie strażnik zapisu | `doctorService.js:91-94` |
| Controller | Przekazuje surowy `req.body` bez walidacji | `appointmentController.js:3-13` |
| Service (zapis) | `Appointment.create` + **bezwarunkowy** `DoctorSchedule.update(AppointmentID=new)` w transakcji; **brak sprawdzenia zajętości** → silent overwrite | `appointmentService.js:9-32` |
| Model | `Status` to wolny `STRING`; FK `AppointmentID` na slocie istnieje, ale **brak unikalnego ograniczenia** wymuszającego 1:1 | `appointmentModel.js:24`, `doctorModel.js:57-64` |
| Route | Otwarty, bez auth; `PatientID` z klienta | `appointmentRoutes.js:5` |

**Wnioski diagnozy:**
- Reguła **nigdzie nie jest egzekwowana przy zapisie**. Transakcja jest atomowa, ale chroni przed
  awarią połączenia, **nie** przed double-bookingiem (sprawdzenia po prostu nie ma).
- Status jest nadawany **wyłącznie przez klienta** — serwer akceptuje dowolną wartość.
- Błąd nie jest „połykany" sztucznie, ale ścieżka błędu zwraca surowy `500 error.message` — brak
  **nazwanego błędu domenowego** odróżniającego „slot zajęty" od awarii.

## KROK 4 — Projekt agregatu-strażnika

**Agregat-root: `Appointment`** — jedyne miejsce egzekwowania reguł wizyty. Slot (`DoctorSchedule`)
jest pozyskiwany i „zajmowany" wewnątrz granicy agregatu; klient nie steruje statusem.

### Nazwany błąd domenowy (fail-fast)
```
class SlotAlreadyBookedError extends DomainError {}   // I1 złamany: slot zajęty
class SlotNotFoundError extends DomainError {}         // I4: slot nie istnieje
class IllegalStatusTransitionError extends DomainError {} // I2: niedozwolone przejście
```

### Metody domenowe z preconditions (sygnatury + pseudokod)
```
// Status jest typem domeny, nie stringiem z klienta
const AppointmentStatus = Object.freeze({ SCHEDULED: 'zaplanowana', COMPLETED: 'zakończona' });

// Fabryka: jedyna droga powstania wizyty — pilnuje I1 + I4 + nadaje status (I2)
Appointment.book({ patientId, slot /* DoctorSchedule */ }) -> Appointment
  precondition: slot != null                      else throw SlotNotFoundError
  precondition: slot.AppointmentID == null        else throw SlotAlreadyBookedError   // I1
  status := AppointmentStatus.SCHEDULED            // I2: status nadaje DZIEDZINA, nie klient
  appointmentDate := slot.AvailableDate + slot.TimeSlotFrom   // serwer składa datę, nie klient
  return new Appointment(patientId, slot.DoctorID, appointmentDate, status, scheduleId=slot.ScheduleID)

// Przejście statusu (I2/I3) — domknięcie cyklu, osobna metoda roota
Appointment.complete({ diagnosis, treatment }) -> void
  precondition: this.status == SCHEDULED          else throw IllegalStatusTransitionError  // I2
  this.diagnosis := diagnosis; this.treatment := treatment
  this.status := AppointmentStatus.COMPLETED
```

### Repozytorium (ładuje/zapisuje agregat zamiast rozsianych zapytań) + atomowość
```
AppointmentRepository.bookInTransaction(patientId, scheduleId) -> Appointment
  return sequelize.transaction(async tx => {
    // SELECT ... FOR UPDATE na slocie — blokada wiersza eliminuje race (I1 pod współbieżnością)
    slot := DoctorSchedule.findByPk(scheduleId, { lock: tx.LOCK.UPDATE, transaction: tx })
    appt := Appointment.book({ patientId, slot })          // preconditions — fail-fast
    saved := Appointment.create(appt.toPersistence(), { transaction: tx })
    DoctorSchedule.update({ AppointmentID: saved.id },
                          { where: { ScheduleID: scheduleId, AppointmentID: null }, transaction: tx })
    // jeśli update dotknął 0 wierszy → ktoś zajął slot równolegle → throw SlotAlreadyBookedError
    return saved
  })
```
> **Twarda bariera danych (uzupełnienie I1):** dodać **UNIQUE** na `DoctorSchedule.AppointmentID`
> (lub odwrotny model 1:1) — niezmiennik egzekwowany także na poziomie schematu, nie tylko kodu.

### Cienki route/controller
```
POST /appointment/add:
  patientId := req.user.id            // I2/bezpieczeństwo: z TOŻSAMOŚCI, nie z body (dziś z localStorage)
  scheduleId := parse(req.body.scheduleId)
  try   -> appt = AppointmentRepository.bookInTransaction(patientId, scheduleId); 201 json(appt)
  catch SlotAlreadyBookedError -> 409 Conflict
  catch SlotNotFoundError      -> 404
  catch IllegalStatusTransition-> 422
  // mapowanie nazwanego błędu domenowego na kod HTTP — zamiast surowego 500
```
**Egzekucja przenosi się z klienta na serwer:** status i data wizyty są składane przez dziedzinę;
klient przestaje wysyłać `Status`/`AppointmentDate`/`PatientID`.

## KROK 5 — Before / after, plan faz, testy

### Before → After (per miejsce reguły dziś)
| Miejsce | Before | After |
|---|---|---|
| `visits.component.ts:112` | klient ustawia `Status:'zaplanowana'` | klient wysyła **tylko `scheduleId`**; status nadaje serwer |
| `visits.component.ts:106-117` | klient składa `AppointmentDate`, `PatientID` | serwer wyprowadza datę ze slotu, `PatientID` z tożsamości |
| `appointmentService.js:16-24` | bezwarunkowy `update` (silent overwrite) | warunkowy claim slotu `WHERE AppointmentID IS NULL` + lock; 0 wierszy → `SlotAlreadyBookedError` |
| `appointmentController.js:10-12` | surowy `500 error.message` | mapowanie nazwanych błędów → 409/404/422 |
| `appointmentModel.js:24` | `Status: STRING` dowolny | wartości z `AppointmentStatus`; (docelowo) ograniczenie/enum |
| `doctorModel.js:57-64` | FK bez unikalności | **UNIQUE** na `AppointmentID` slotu |

### Plan faz (inkrementalny, odwracalny)
1. **(prerekwizyt) Pierwsze testy backendu.** Dziś runner nie istnieje (`backend/package.json:8`
   placeholder). Wprowadzenie agregatu **MUSI** iść z pierwszym test-runnerem — to naturalny moment,
   bo agregat jest testowalny w izolacji (czysta logika `book`/`complete` bez DB). **Test-first** dla
   logiki domenowej.
2. **Czysty agregat + błędy domenowe** (`Appointment.book/complete`, `AppointmentStatus`, `*Error`) —
   bez DB, w pełni jednostkowo testowalny. Odwracalny (nowy kod obok starego).
3. **Repozytorium + transakcja z lockiem**; podmiana wywołania w service za feature-flagą/równolegle.
4. **Cienki controller + mapowanie błędów**; przeniesienie składania statusu/daty na serwer.
5. **Migracja schematu: UNIQUE na `DoctorSchedule.AppointmentID`** (bariera danych) — osobno, po
   sprawdzeniu braku istniejących duplikatów.
6. **Front:** klient wysyła tylko `scheduleId`; obsługa `409` (slot zajęty) z komunikatem dla usera
   (przy okazji domyka brak feedbacku z analizy appointment).

### Przypadki testowe niezmiennika (legalne / nielegalne)
- ✅ book na wolny slot → wizyta `SCHEDULED`, slot oznaczony.
- ❌ book na zajęty slot → `SlotAlreadyBookedError` (409), **żaden** stan nie zmieniony (atomowość).
- ❌ book na nieistniejący `scheduleId` → `SlotNotFoundError` (404).
- ❌ dwa równoległe booki na ten sam slot → dokładnie jeden sukces, drugi `SlotAlreadyBookedError` (lock/`WHERE AppointmentID IS NULL`).
- ✅ complete wizyty `SCHEDULED` → `COMPLETED` z diagnozą/leczeniem.
- ❌ complete wizyty już `COMPLETED` lub o nieznanym statusie → `IllegalStatusTransitionError` (422).
- ❌ klient próbuje narzucić `Status` w body → ignorowane; status pochodzi z dziedziny.

### Nowe „load-bearing" nazwy
`Appointment` (agregat-root), `AppointmentStatus` (`SCHEDULED`/`COMPLETED`), `AppointmentRepository`,
`book()`, `complete()`, `SlotAlreadyBookedError`, `SlotNotFoundError`, `IllegalStatusTransitionError`.
*(Projekt nie prowadzi rejestru kontraktów — `contract-surfaces.md` nieobecny; nazwy do utrwalenia przy implementacji.)*

---

### Podsumowanie
Plan zabezpiecza najrdzeniowszy i najsłabiej egzekwowany niezmiennik domeny — **ekskluzywność slotu
wizyty (I1, brak double-booking)** — dziś całkowicie ignorowany przy zapisie (`appointmentService.js:16-24`
robi bezwarunkowy `DoctorSchedule.update`, a jedyny filtr wolnych slotów żyje w *wyszukiwaniu*,
`doctorService.js:91-94`). Projektuję agregat-root `Appointment` jako **jedyne miejsce egzekwowania**:
fabryka `book()` z preconditions sprawdza wolność/istnienie slotu i **nadaje status po stronie
dziedziny** (odbierając tę odpowiedzialność klientowi — I2), a nielegalna operacja rzuca **nazwany
błąd domenowy** (`SlotAlreadyBookedError` → 409) zamiast cichego nadpisania lub surowego 500.
Repozytorium zamyka claim slotu w **jednej transakcji z blokadą wiersza** (odporność na wyścig),
wspartej **UNIQUE** na `DoctorSchedule.AppointmentID` jako barierą danych. Ponieważ backend nie ma
dziś żadnych testów, faza #1 planu to wprowadzenie pierwszego runnera i **test-first** dla czystej
logiki agregatu — wymienione są przypadki legalnych i nielegalnych operacji. Całość jest
inkrementalna i odwracalna; status `complete()` domyka też rozjazd D-B/I2 z destylacji domeny.
