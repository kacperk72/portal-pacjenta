# Typy/DTO i walidacja na szwie FE↔BE umawiania wizyty (K2) — Plan Brief

> Full plan: `context/changes/appointment-contract-types/plan.md`
> Research: `context/changes/appointment-booking-analysis/research.md`, `context/changes/refactor-opportunities/research.md`

## What & Why
Szew umawiania wizyty FE↔BE nie ma żadnej bariery: payload jest typu `any`, backend przyjmuje surowy
`req.body`, a `ScheduleID` jest wysyłany mimo braku w modelu. Wprowadzamy typowany kontrakt (FE) +
lekki walidator (BE), by zmiana pola była wychwytywana statycznie (kompilator TS — jedyna dostępna
osłona regresji) i odrzucana przy złym wejściu.

## Starting Point
`appointment.service.ts` zwraca `Observable<any>`; `visits.component.ts` składa payload ręcznie;
`appointmentController.createAppointment` przepuszcza `req.body` bez walidacji (surowy `500` przy błędzie).
Brak typu `Appointment` w `types/`; brak runnera testów backendu.

## Desired End State
Brak `any` na ścieżce wizyty; payload i odpowiedź mają nazwane typy TS używane w serwisie, `visits` i
`dashboard`; backend odrzuca niepoprawny payload kodem `400` z czytelnym komunikatem, a poprawny
działa jak dotąd (`201`). `ng build` przechodzi.

## Key Decisions Made
| Decyzja | Wybór | Dlaczego | Źródło |
| --- | --- | --- | --- |
| Status `ScheduleID` | Pole meta-transportowe (w typie, oznaczone) | Zero zmian DB; pełne rozplecenie to agregat (plan 02) | Plan |
| Zakres | Typ FE + lekki ręczny guard BE (bez nowej zależności) | Domyka szew po obu stronach minimalnym kosztem | Plan |
| Typowanie odpowiedzi | Payload + odpowiedź (getPatientAppointments) | Domyka cały szew, dashboard też zyskuje typ | Plan |
| Walidacja BE | Ręczna, bez biblioteki | Brak testów/deps — minimalizujemy ryzyko i footprint | Research (K2) |

## Scope
**In scope:** typy FE (`appointmentTypes.ts`), eliminacja `any` w `appointment.service.ts`, typowanie
`visits.component.ts` i `dashboard.component.ts`, ręczny walidator w `appointmentController.js`.
**Out of scope:** repo-wide `any`, przeniesienie `ScheduleID` do modelu, double-booking/agregat (plan 02),
auth/interceptor (K3), biblioteka walidacji, runner testów backendu (N1).

## Architecture / Approach
Backend (CommonJS JS) nie współdzieli typów TS — FE dostaje typy, BE dostaje niezależny, lustrzany
walidator. Kolejność faz: typy (addytywne) → podstawienie (kompilator pilnuje) → guard BE.

## Phases at a Glance
| Faza | Dostarcza | Kluczowe ryzyko |
| --- | --- | --- |
| 1. Definicja kontraktu (typy FE) | `appointmentTypes.ts` (3 typy) | kształt odpowiedzi musi zgadzać się z `include` w service |
| 2. Podstawienie typów (FE) | brak `any`, typowani konsumenci | kompilator może ujawnić istniejące niespójności do naprawy |
| 3. Lekki guard walidacji (BE) | `400` zamiast `500` na złym payloadzie | brak testów → weryfikacja ręczna (`node --check` + curl) |

**Prerequisites:** brak (buduje na istniejącym kodzie).
**Estimated effort:** ~1 sesja, 3 fazy.

## Open Risks & Assumptions
- Brak runnera testów backendu → Faza 3 weryfikowana ręcznie; to świadomy kompromis (N1 osobno).
- Podstawienie typów (Faza 2) może ujawnić istniejące rozjazdy pól — to pożądane, ale może wymagać drobnych korekt poza pierwotnym zakresem.
- Backend i FE trzymają kontrakt niezależnie (brak współdzielonego pakietu) — ryzyko rozjazdu w przyszłości pozostaje (pełne rozwiązanie poza K2).

## Success Criteria (Summary)
- `ng build` przechodzi; `appointment.service.ts` bez `any` na ścieżce wizyty.
- Niepoprawny payload booka → `400` z komunikatem; poprawny → `201` bez zmian.
- Dashboard i umawianie działają bez regresji.
