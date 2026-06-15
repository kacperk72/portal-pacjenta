---
title: "Destylacja domeny — portal-pacjenta"
created: 2026-06-15
type: domain-distillation
phase: "Faza 4 — Domain-Driven Design (Lekcja 5)"
inputs: [README.md, "backend/src/models/*", "backend/src/schemas/surveySchema.js", "context/changes/appointment-booking-analysis/research.md", "context/map/repo-map.md"]
tags: [ddd, domain, ubiquitous-language, aggregates, exploration]
---

# Destylacja domeny: portal-pacjenta

> Produkt to **mapa domeny, nie kod**. Eksploracja, zero zmian w kodzie. Cytaty wyłącznie zweryfikowane.
> Rygor: [E]vidence / [I]nference / [U]nknown.

## KROK 0 — Kontekst projektu

**⚠️ Brak dokumentów wymagań/wizji** (brak `prd.md`, brak `foundation/`-owych docs). Jedyne źródło
intencji produktu to `README.md`; reszta wiedzy domenowej **odtworzona z kodu** (głównie modeli) —
to ograniczenie tej destylacji.

- **Wizja (jedyne zdanie celu) [E]** `README.md:7`: „aplikacja webowa, która umożliwia pacjentom
  **zarządzanie wizytami lekarskimi**, **przeglądanie wyników badań** oraz **komunikację z
  placówkami medycznymi**." To trzy deklarowane filary produktu.
- **Stack [E]:** Angular (frontend, TS) + Node/Express (backend, CommonJS) + Sequelize/MySQL +
  Mongoose/MongoDB (ankieta) + OpenAI (czat AI). README: Angular 17, Express 4, Docker/Nginx.
- **Gdzie żyje logika domenowa [E]:** rozproszona. Persystencja + asocjacje w `backend/src/models/`
  (Sequelize) i `backend/src/schemas/` (Mongoose). Logika reguł — częściowo w `services/`, częściowo
  w UI Angulara (np. status nadawany w `visits.component.ts`). **Brak wydzielonej warstwy domeny.**

## KROK 1 — Ubiquitous Language

| Pojęcie | Definicja | Źródło / życie w kodzie |
|---|---|---|
| **Pacjent** (Patient) | Użytkownik umawiający i przeglądający własne wizyty | `README.md:7`; `User.Role` domyślnie `"patient"` (`userModel.js:24`); `PatientID` FK (`appointmentModel.js:12`) |
| **Lekarz** (Doctor) | Świadczeniodawca; ma specjalizację, miasta, grafik | `Doctor` (`doctorModel.js:6`); `Specialization`, `Cities` (`:14,18`) |
| **Wizyta** (Appointment) | Spotkanie pacjent–lekarz w terminie; nośnik statusu, diagnozy, leczenia | `Appointment` (`appointmentModel.js:4`): `AppointmentDate`, `Status`, `Diagnosis`, `Treatment`, `SurveyID` |
| **Status wizyty** | Stan cyklu życia wizyty | wartości `'zaplanowana'` (`visits.component.ts:112`), `'zakończona'` (`doctor-dashboard.component.ts:102`); typ wolny `STRING` (`appointmentModel.js:24`) |
| **Grafik lekarza / Termin** (DoctorSchedule) | Slot dostępności lekarza, który może zostać zajęty przez wizytę | `DoctorSchedule` (`doctorModel.js:29`): `AvailableDate`, `TimeSlotFrom`, `TimeSlotTill`, `Duration`, `AppointmentID` |
| **Wolny / zajęty slot** | Slot bez przypisanej wizyty = wolny | filtr `AppointmentID IS NULL` (`doctorService.js:91-94`) |
| **Recepta** (Prescription) | Lek przepisany w ramach wizyty | `Prescription` (`doctorModel.js:72`): `Medicine`, `Dosage`, `Instructions`; FK `AppointmentID` |
| **Diagnoza / Leczenie** (Diagnosis/Treatment) | Wynik wizyty wpisywany przez lekarza | `appointmentModel.js:28,32`; wyświetlane `dashboard.component.ts:135-136` |
| **Profil** (Profile) | Dane osobowe pacjenta/lekarza | `Profile` (`profileModel.js:4`): `FirstName`, `LastName`, `ContactInfo` |
| **Ankieta przedwizytowa** (PreAppointmentSurvey) | Triage objawowy wypełniany przed wizytą | `surveySchema.js:3` (Mongo): `VisitReason`, `Symptoms*`, `HasAllergy`, `TestResults`… |
| **Powód wizyty** (VisitReason) | Główny powód zgłoszenia | `surveySchema.js:8` (`required: true`) |
| **Użytkownik / Rola** (User/Role) | Konto logowania; rola steruje widokiem | `userModel.js`: `Username`, `Password`, `Role` (`patient`/`doctor`), `Email`; rola czytana `login.component.ts:55` |
| **AI Doctor / Czat** | Komunikacja z asystentem AI (OpenAI) | komponent `ai-doctor`, `chatController.js` (openai) — filar „komunikacja" z README |

## KROK 2 — Subdomeny (Core / Supporting / Generic)

| Obszar | Kategoria | Uzasadnienie (wobec celów z README) |
|---|---|---|
| **Wizyta** (cykl: umówienie → realizacja → diagnoza/leczenie/recepta) | **CORE** | „zarządzanie wizytami lekarskimi" — sedno produktu i jego przewaga |
| **Ankieta przedwizytowa** (triage objawowy) | **CORE** | unikatowa wartość: ustrukturyzowany wywiad przed wizytą; nie kupisz „z półki" |
| Grafik lekarza (DoctorSchedule) | Supporting | konieczny nośnik dostępności, ale wspiera wizytę, nie jest celem sam w sobie |
| Recepta, Diagnoza/Leczenie | Supporting | artefakty wyniku wizyty; rozszerzają Core, ale dziś niezaimplementowane (patrz KROK 4) |
| Profil (dane osobowe) | Supporting | wspiera prezentację wizyt |
| Uwierzytelnianie / User / Role | **Generic** | logowanie/role to problem rozwiązany „z półki"; brak przewagi konkurencyjnej |
| Czat AI (OpenAI) | Generic | komunikacja oparta o zewnętrzny SDK; wymienialny komponent |

## KROK 3 — Kandydaci na agregaty i ich niezmienniki

### A. Wizyta (Appointment) — główny kandydat na agregat-root
| Niezmiennik | Źródło | Egzekwowanie w kodzie |
|---|---|---|
| **I1.** Jeden slot grafiku może mieć **co najwyżej jedną** wizytę (brak double-booking) | reguła wynika z FK `DoctorSchedule.AppointmentID` (`doctorModel.js:57-64`) + filtru wolnych slotów (`doctorService.js:91-94`) | **IGNOROWANY [E]** — `createAppointment` nie sprawdza zajętości, nadpisuje `AppointmentID` bezwarunkowo (`appointmentService.js:16-24`) |
| **I2.** Status podąża cyklem `zaplanowana → zakończona` (bez cofania/pomijania) | wartości w kodzie (`visits.component.ts:112`, `doctor-dashboard.component.ts:102`) | **IGNOROWANY [E]** — `Status` to wolny `STRING` (`appointmentModel.js:24`); brak walidacji przejść |
| **I3.** Diagnoza/Leczenie/Recepta istnieją **tylko dla zakończonej** wizyty | model wiąże je z `Appointment` (`appointmentModel.js:28-39`, `doctorModel.js:72-114`) | **NIEZAIMPLEMENTOWANY [E]** — brak ścieżki zakończenia (patrz KROK 4 D-B) |
| **I4.** Wizyta wskazuje istniejący, wolny termin | `ScheduleID` w payloadzie (`visits.component.ts:116`) | **CZĘŚCIOWY [I]** — `ScheduleID` używany do update slotu, ale brak weryfikacji wolności/istnienia |

### B. Grafik lekarza (DoctorSchedule) — kandydat wtórny
| Niezmiennik | Źródło | Egzekwowanie |
|---|---|---|
| `TimeSlotFrom < TimeSlotTill`, spójny `Duration` | pola `doctorModel.js:45-56` | **IGNOROWANY [I]** — tylko typy `TIME`/`INTEGER`, brak walidacji logicznej |

### C. Ankieta przedwizytowa (PreAppointmentSurvey) — kandydat wtórny
| Niezmiennik | Źródło | Egzekwowanie |
|---|---|---|
| `PatientID`, `DoctorID`, `AppointmentID`, `VisitReason` są wymagane | `surveySchema.js:5-8` (`required: true`) | **DEKLAROWANY [E]** — Mongoose egzekwuje `required` (jedyny agregat z realnym niezmiennikiem) |
| Powiązanie z wizytą jest spójne | — | **ZŁAMANY [E]** — patrz KROK 4 D-A (dwa mechanizmy linkowania, jeden martwy) |

## KROK 4 — Rozjazdy MODEL vs KOD (najcenniejsze)

| # | Dokument/Model mówi | Kod robi | Dowód (plik:linia) |
|---|---|---|---|
| **D-A** | Wizyta linkuje ankietę przez `appointments.SurveyID` | `SurveyID` zawsze `null`; ankieta w Mongo linkowana przez `AppointmentID` — dwa mechanizmy, `SurveyID` martwy | `appointmentModel.js:36`; `visits.component.ts:115` (`SurveyID: null`); `surveyController.js:7,12` |
| **D-B** | Model deklaruje pełen cykl wizyty: `Status` `zakończona`, `Diagnosis`, `Treatment`, encja `Prescription` | **Brak ścieżki zakończenia**: `Appointment.update(Status)` = ZERO, `Prescription.create` = ZERO; lekarz ma tylko grafik+listę (`doctorRoutes.js`). `'zakończona'` jest tylko ODCZYTYWANE, nigdy ZAPISYWANE | grep: 0 trafień zapisu; `doctor-dashboard.component.ts:102` (odczyt); `doctorRoutes.js:6-18` |
| **D-C** | Domena ma skończony zbiór statusów (`zaplanowana`/`zakończona`) | `Status` to wolny `STRING` bez enuma/walidacji — można zapisać dowolny | `appointmentModel.js:24-27` |
| **D-D** | Slot jest ekskluzywny (jedna wizyta na termin) | brak egzekwowania przy zapisie (silent overwrite) | `appointmentService.js:16-24` vs filtr `doctorService.js:91-94` |
| **D-E** | Pacjent operuje na **własnych** wizytach | `PatientID` z localStorage klienta, niezweryfikowany serwerowo (IDOR) | `visits.component.ts:106-117`; `appointmentRoutes.js:5,8` (brak auth) |

> **Najważniejszy wniosek:** model danych „wie" więcej o domenie wizyty niż robi to kod. Pełen cykl
> życia wizyty (realizacja, diagnoza, leczenie, recepta) jest **zadeklarowany w schemacie, lecz
> nieegzekwowany i w dużej części niezaimplementowany**. To klasyczny anemiczny model: encje bez
> zachowania, reguły rozproszone lub nieobecne.

## KROK 5 — Ranking refaktoru (wg wartości × ryzyka)

Wartość = jak rdzeniowy niezmiennik; ryzyko = jak słabo dziś egzekwowany.

1. **🥇 Agregat Wizyta (Appointment) — egzekwowanie I1 (slot ekskluzywny) + I2 (cykl statusu).**
   Najrdzeniowszy obszar (Core), a niezmienniki **ignorowane** (I1, I2) lub **niezaimplementowane**
   (I3). Naprawa: uczynić `Appointment` jedynym miejscem egzekwowania reguł wizyty (zajętość slotu,
   legalne przejścia statusu, nazwany błąd domenowy zamiast cichego nadpisania). To jest cel dla
   **kroku 4.2** (agregat-strażnik niezmiennika). Odpowiada odłożonemu **D1** z Fazy 3.
2. **🥈 Spójność powiązania Wizyta↔Ankieta (D-A).** Rdzeniowe (oba Core), dziś rozjechane (dwa
   mechanizmy linkowania, `SurveyID` martwy). Wartość średnia, ryzyko ciche (dane mogą się rozejść).
3. **🥉 Ankieta jako port domeny (ACL nad Mongo/Mongoose).** Ankieta przecieka szczegółem persystencji
   (Mongoose) i mieszaniem z Sequelize — kandydat na **Anti-Corruption Layer** (krok 4.3).

**Kandydaci odrzuceni z czołówki:** DoctorSchedule (niezmiennik B niski-wartościowy), Generic (auth/czat
— nie domena rdzeniowa, choć auth to realny dług bezpieczeństwa opisany jako K3 w Fazie 3).

---

### Podsumowanie (dla nawigacji)
Artefakt destyluje domenę portal-pacjenta z README + kodu (brak dokumentów wymagań — ograniczenie).
Zawiera Ubiquitous Language z cytatami `plik:linia`, klasyfikację subdomen (Core: **Wizyta** i
**Ankieta przedwizytowa**; Generic: auth/czat), kandydatów na agregaty z niezmiennikami i statusem
ich egzekwowania, oraz tabelę rozjazdów MODEL vs KOD. **Najważniejszy wniosek:** model deklaruje
bogaty cykl życia wizyty (status, diagnoza, leczenie, recepta), którego kod w większości **nie
egzekwuje ani nie implementuje** — to anemiczny model z regułami rozproszonymi lub nieobecnymi.
Rekomendacja #1: zbudować **agregat Wizyta** egzekwujący ekskluzywność slotu i cykl statusu (wejście
do kroku 4.2); dalej spójność Wizyta↔Ankieta i ACL nad Mongoose (krok 4.3).
