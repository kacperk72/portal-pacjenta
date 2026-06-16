---
change_id: appointment-contract-types
title: Typy/DTO i walidacja na szwie kontraktu FE↔BE dla umawiania wizyty (K2)
status: implementing
created: 2026-06-15
updated: 2026-06-16
archived_at: null
---

## Notes

Realizacja możliwości refaktoru **K2** z rankingu `context/changes/refactor-opportunities/research.md`: eliminacja cichego rozjazdu kontraktu FE↔BE dla umawiania wizyty. Dowody: `appointment-booking-analysis/research.md` (szew bez bariery: `any`, brak DTO/walidacji, rozjazd `ScheduleID`).

Cel: wprowadzić kanoniczny współdzielony kształt payloadu wizyty (TS `interface Appointment`) + walidację wejścia po stronie backendu, tak by zmiana pola wizyty była wychwytywana statycznie (kompilator TS — jedyna dostępna osłona regresji wg researchu). Pierwszy krok-prerekwizyt: zdefiniować typ i podstawić pod `any` w `appointment.service.ts`; rozstrzygnąć status `ScheduleID` (pole meta-transportowe vs pole modelu).

Zakres celowo wąski (szew umawiania wizyty), nie cały repo-wide wzorzec `any`.
