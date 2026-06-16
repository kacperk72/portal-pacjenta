<!-- PLAN-REVIEW-REPORT -->
# Plan Review: Typy/DTO i walidacja na szwie FE↔BE umawiania wizyty (K2)

- **Plan**: context/changes/appointment-contract-types/plan.md
- **Mode**: Deep
- **Date**: 2026-06-16
- **Verdict**: REVISE → SOUND (po triage)
- **Findings**: 1 critical · 1 warning · 1 observation

## Verdicts

| Dimension | Verdict |
|-----------|---------|
| End-State Alignment | WARNING → PASS (F1 fixed) |
| Lean Execution | PASS |
| Architectural Fitness | PASS |
| Blind Spots | WARNING → PASS (F1, F2 fixed) |
| Plan Completeness | WARNING → PASS (F1 fixed) |

## Grounding
8/8 paths ✓, symbols ✓ (aliasy `Prescriptions` hasMany / `DoctorSchedule` hasOne potwierdzone w `doctorModel.js:107-130`; kształt `PatientAppointment` zgodny z `appointmentService.js:40-60`), brief↔plan ✓.

## Findings

### F1 — PatientID jest `string` na drucie, ale typ payloadu wymaga `number`

- **Severity**: ❌ CRITICAL
- **Impact**: 🔎 MEDIUM — realny tradeoff (zmiana typu na drucie); pause to reason
- **Dimension**: Blind Spots / End-State Alignment / Plan Completeness
- **Location**: Phase 2 (#2 payload) ↔ Phase 3 (guard) — sprzężenie międzyfazowe
- **Detail**: `user.service.ts:5,17` — `userLocalStorageData.id: string`; `visits.component.ts:109` wysyła `PatientID` jako string. Plan definiuje `BookAppointmentPayload.PatientID: number`. Bez decyzji Phase 2 wywróci `ng build` (`string` not assignable to `number`), albo po luzowaniu typu Phase 3 guard (`typeof === 'number'`) odrzuci realny payload (400). `DoctorID`/`ScheduleID`/`AppointmentDate` lecą z `visit: any` — nie są sprawdzane; tylko `PatientID` jest konkretnie string.
- **Fix A ⭐ Recommended**: Koercja `Number(id)` w miejscu budowy payloadu + typ `number` + guard tolerancyjny (`!Number.isNaN(Number(x))`).
  - Strength: Spójny typ liczbowy; drut poprawniejszy (Sequelize i tak koercował); guard nie wywróci realnego ruchu.
  - Tradeoff: Phase 2 zmienia zachowanie na drucie (number zamiast string).
  - Confidence: HIGH — kolumna PatientID jest liczbowa w DB.
  - Blind spot: Inne miejsca wysyłające PatientID jako string (poza szwem) nie sprawdzone.
- **Fix B**: `PatientID: string` w typie + guard string/koercowalny.
  - Strength: Zero zmian runtime; najmniejszy diff.
  - Tradeoff: Niespójność typów (PatientID:string vs DoctorID/ScheduleID:number).
  - Confidence: HIGH — odzwierciedla dzisiejszy stan.
  - Blind spot: Utrwala rozjazd typów.
- **Decision**: FIXED via Fix A — koercja `Number(id)` w `visits.component.ts`, payload `number`, guard BE sprawdza koercowalność. Edycje: Current State Analysis (Key Discoveries), Phase 2 #2 (Uwaga F1), Phase 3 #1 (Contract).

### F2 — Osłona kompilatora w Phase 2 jest częściowa (`visit: any` upstream)

- **Severity**: ⚠️ WARNING
- **Impact**: 🏃 LOW — szybka decyzja; świadome ograniczenie zakresu
- **Dimension**: End-State Alignment
- **Location**: Phase 2, #2 — `visits.component.ts:100,110-116`
- **Detail**: `bookVisit(visit: any)` i `getVisits` zwraca `any`, więc `DoctorID/ScheduleID/AppointmentDate` lecą z `any` do pól `number` — kompilator ich nie sprawdzi. Realnie typowany tylko `PatientID` (→ F1) i literał `Status`. Wartość ochronna podstawienia mniejsza niż sugeruje brief.
- **Fix**: Zaakceptować jako świadomą granicę zakresu i dopisać wprost w „What We're NOT Doing".
- **Decision**: FIXED — dodano pozycję w „What We're NOT Doing" opisującą granicę osłony.

### F3 — Podwójny eksport `getPatientAppointments` w szwie (K5)

- **Severity**: 💡 OBSERVATION
- **Impact**: 🏃 LOW
- **Dimension**: Architectural Fitness
- **Location**: `appointmentService.js:70-71` (poza zakresem zmiany)
- **Detail**: `module.exports` eksportuje `getPatientAppointments` dwukrotnie — znany kandydat K5. Plan słusznie tego nie dotyka, ale leży w szwie — guardrail przeciw scope creep w Fazie 3.
- **Fix**: Dopisać do „What We're NOT Doing".
- **Decision**: FIXED — dodano guardrail w „What We're NOT Doing".

## Triage Summary

- Fixed: F1 (Fix A), F2, F3 (3)
- ► Verdict after fixes: REVISE → **SOUND**
