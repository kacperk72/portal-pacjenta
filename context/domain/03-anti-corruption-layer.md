---
title: "Anti-Corruption Layer: Mongoose w domenie Ankiety przedwizytowej"
created: 2026-06-15
type: refactor-plan
phase: "Faza 4 — Domain-Driven Design (Lekcja 5)"
inputs: ["context/domain/01-domain-distillation.md", "context/changes/appointment-booking-analysis/research.md", "context/map/artifact-2-structure.md"]
tags: [ddd, anti-corruption-layer, mongoose, survey, refactor-plan, exploration]
---

# Plan: Anti-Corruption Layer dla przeciekającego Mongoose (Ankieta)

> **Produkt to PLAN, nie implementacja.** Zero zmian w kodzie. Cytaty zweryfikowane.

## KROK 0 — Kontekst
- **Brak dokumentów wymagań** (brak PRD/deklaracji wymienialności) — `README.md` opisuje tylko cele
  produktu. Brak zapisu „X ma być wymienialne" → oś (c) klasyfikacji oceniam jako `unknown`/neutralną.
- **Zależności zewnętrzne (backend) [E]** (`backend/package.json`): bcryptjs, cors, dotenv, express,
  express-session, jsonwebtoken, **mongoose**, **mysql2**, **openai**, passport, passport-local, **sequelize**.
- **Dwa silniki persystencji [E]:** Sequelize/MySQL (rdzeń: wizyty, lekarze, profile) + Mongoose/MongoDB
  (wyłącznie Ankieta przedwizytowa). Frontend nie zna żadnej z tych bibliotek (komunikacja przez HTTP).

## KROK 1 — Przeciekające zależności (wszystkie pliki, które je dziś „znają")

### Kandydat A — **Mongoose** (persystencja Ankiety)
| Plik:linia | Jak „zna" mongoose |
|---|---|
| `app.js:12,19-30` | `require("mongoose")` + `mongoose.connect(MONGO_URI)` (bootstrap połączenia w entry poincie) |
| `config/dbmongo.js:1,5` | drugi `require("mongoose")` + `connect` — **martwy duplikat** (0 importerów; K1) |
| `schemas/surveySchema.js:1,3,32` | `mongoose.Schema` + `mongoose.model` — **domena Ankiety = schemat biblioteki** |
| `services/surveyService.js:1,5,14,23,32` | importuje model i woła **API Mongoose** (`.create/.find/.findOne`) |
| `controllers/surveyController.js:9-33` | ręczna **rekonstrukcja** `filteredSurveyData` (mapowanie camelCase→PascalCase pod schemat) |

> Dodatkowo **trzeci kształt** tej samej encji żyje na froncie: `interface Survey` (`surveyTypes.ts:19-22`).
> Ten sam byt domenowy istnieje w 3 reprezentacjach: FE `Survey` → mapowanie w kontrolerze → schemat Mongoose.

### Kandydat B — **OpenAI SDK** (czat AI)
| Plik:linia | Jak „zna" openai |
|---|---|
| `app.js:14` | `require("openai")` — **import nieużywany** (grep: brak innego użycia w `app.js`) — martwy przeciek |
| `chatController.js:1,3,11` | `new OpenAI()` + `openai.chat.completions.create({...})` — kształt wywołania specyficzny dla dostawcy, wprost w kontrolerze |

> OpenAI **nie** jest przeciekiem obustronnym — front woła `POST /chat/one` przez HTTP (`chat.service.ts:14`),
> nie zna SDK. Przeciek ogranicza się do backendu (2 pliki).

## KROK 2 — Klasyfikacja i wybór #1

| Oś | A: Mongoose | B: OpenAI |
|---|---|---|
| (a) liczba warstw/plików | **5 plików, 4 warstwy** (entry, config, schemat/model, serwis, kontroler) + 3. kształt na FE | 2 pliki (entry-martwy, kontroler) |
| (b) ryzyko/koszt wymiany dziś | **wysoki** — model = schemat biblioteki; serwis woła API Mongoose; zmiana store'u dotyka domeny i serwisu | średni — izolowane do `chatController` |
| (c) deklaracja wymienialności | brak dokumentów (`unknown`) — ale Ankieta to subdomena **CORE** (artefakt 01) | brak; czat to **Generic** (klasyczny kandydat „wymienialny") |

**Wybór #1: Mongoose w domenie Ankiety.** Najgorszy przeciek: dotyka **najwięcej warstw**, a co
groźniejsze — **wiąże rdzeniową** (Core) domenę Ankiety wprost z biblioteką persystencji: „model"
domenowy JEST schematem Mongoose (`surveySchema.js`), a warstwa serwisu mówi API Mongoose
(`surveyService.js`). To dokładnie sygnał z artefaktu 01 (ranking #3: „Ankieta jako port domeny / ACL
nad Mongoose"). OpenAI zostaje jako prostszy, wtórny kandydat (zob. uwaga na końcu).

## KROK 3 — Diagnoza

- **Brak reprezentacji domenowej Ankiety niezależnej od Mongoose [E].** Jedyny „model" to
  `mongoose.model("PreAppointmentSurvey", schema)` (`surveySchema.js:32`) — typy pól (`String`, `Number`,
  `required`) to typy biblioteki. Nie ma czystego value-objectu domeny.
- **Semantyka biblioteki w warstwie serwisu [E].** `surveyService.js` woła `.create`, `.find({})`,
  `.findOne({ AppointmentID })` (`:5,14,23,32`) — kontrakt zapytań Mongoose przecieka do warstwy
  use-case'ów.
- **Zduplikowana rekonstrukcja obiektu [E].** `surveyController.js:9-33` ręcznie składa
  `filteredSurveyData` (mapowanie nazw z FE na pola schematu) — mapowanie, które powinno żyć w jednym
  miejscu (ACL), rozsiane między kontroler a schemat. Trzeci kształt (`surveyTypes.ts:19`) na froncie.
- **Mieszanie silników + martwy duplikat [E].** `dbmongo.js` to druga, martwa konfiguracja połączenia
  (`app.js` łączy inline, `:19-30`). Mongoose i Sequelize współistnieją bez wyraźnej granicy.
- **Rozjazd linkowania (D-A z artefaktu 01) [E].** Ankieta linkuje wizytę przez `AppointmentID`
  (`surveySchema.js:7`, `surveyController.js:12`), podczas gdy `appointments.SurveyID` jest martwy.
  Decyzja o kanonicznym kluczu powinna zostać zakodowana w ACL, nie w kontrolerze.

## KROK 4 — Projekt ACL

**Idea:** jeden domenowy byt Ankiety (framework-free) + **wąski port** repozytorium; **adapter**
Mongoose jako JEDYNE miejsce wiedzy o bibliotece (schemat + mapowanie z/do domeny).

### Domenowy value object (jedyne źródło kształtu Ankiety)
```
// domain/PreAppointmentSurvey.js — zero zależności od mongoose
class PreAppointmentSurvey {
  constructor({ patientId, doctorId, appointmentId, visitReason, symptoms, medications, allergies, chronic, referral, testResults }) { ... }
  static create(input) {
    precondition: appointmentId, patientId, doctorId, visitReason wymagane  else throw InvalidSurveyError
    return new PreAppointmentSurvey(normalize(input))   // walidacja w domenie, nie w schemacie biblioteki
  }
}
class InvalidSurveyError extends DomainError {}
```

### Wąski port (interfejs domenowy — reszta kodu zna tylko to)
```
// domain/ports/SurveyRepository.js  (kontrakt, bez mongoose)
interface SurveyRepository {
  save(survey: PreAppointmentSurvey): Promise<PreAppointmentSurvey>
  findByAppointmentId(appointmentId): Promise<PreAppointmentSurvey | null>
  findByDoctorId(doctorId): Promise<PreAppointmentSurvey[]>
  findAll(): Promise<PreAppointmentSurvey[]>
}
```

### Adapter (jedyny plik znający Mongoose)
```
// infrastructure/mongoose/MongooseSurveyRepository.js
const SurveyDoc = mongoose.model("PreAppointmentSurvey", schema)  // schemat ŻYJE TYLKO TU
class MongooseSurveyRepository implements SurveyRepository {
  save(survey)            { return toDomain(await SurveyDoc.create(toDoc(survey))) }
  findByAppointmentId(id) { return toDomainOrNull(await SurveyDoc.findOne({ AppointmentID: id })) }
  ...
  // toDoc()/toDomain() — JEDYNE miejsce mapowania domena<->Mongoose; tu też kanoniczna decyzja o linku (AppointmentID)
}
```

### Cienki controller/use-case
```
saveSurvey(req,res):
  survey = PreAppointmentSurvey.create(mapWireToInput(req.body))   // mapowanie wire -> domena (zamiast filteredSurveyData)
  saved  = surveyRepository.save(survey)                          // zna tylko port
  201 json(toWire(saved))                                         // UI dostaje dane domenowe, nie surowy dokument Mongoose
  catch InvalidSurveyError -> 422
```

## KROK 5 — Dowód izolacji + before/after

**Wymiana Mongoose (np. na Sequelize/MySQL albo inny store) po refaktorze dotyka WYŁĄCZNIE adaptera:**
- Nowy `SequelizeSurveyRepository` implementujący ten sam port; podmiana w kompozycji zależności.
- **Nie zmienia się:** domena (`PreAppointmentSurvey`), port, kontroler, kontrakt API (`/survey/*`), front (`Survey`).

| Miejsce dziś | Before | After |
|---|---|---|
| `surveySchema.js` | schemat = model domeny | schemat tylko w adapterze; domena ma własny VO |
| `surveyService.js:5,14,23,32` | woła API Mongoose | znika / staje się use-casem na porcie |
| `surveyController.js:9-33` | `filteredSurveyData` (mapowanie ad-hoc) | `mapWireToInput` + `PreAppointmentSurvey.create`; mapowanie domena↔doc w adapterze |
| UI / `getSurveyByAppointmentID` | dostaje surowy dokument Mongoose | dostaje obiekt domenowy (`toWire`) |

## KROK 6 — Weryfikacja i plan

**Kryterium sukcesu [E]:** `grep -rn "mongoose" backend/src` zwraca **wyłącznie** pliki adaptera +
pojedynczy bootstrap połączenia.

| Plik | Dziś zna mongoose? | Po ACL? |
|---|---|---|
| `infrastructure/mongoose/MongooseSurveyRepository.js` (nowy) | — | **TAK (jedyny)** |
| `infrastructure/mongoose/connection.js` (wydzielony bootstrap) | — | TAK (połączenie) |
| `app.js:12,19-30` | tak (inline connect) | **nie** (przeniesione do connection.js) |
| `config/dbmongo.js` | tak (martwy) | **usunięty** (K1) |
| `schemas/surveySchema.js` | tak | **nie** (schemat przeniesiony do adaptera) |
| `services/surveyService.js` | tak | **nie** (use-case na porcie) |
| `controllers/surveyController.js` | zna kształt | **nie** (zna tylko domenę+port) |

**Plan faz (inkrementalny, odwracalny; brak runnera testów → patrz nota):**
1. **(prerekwizyt)** wydziel `connection.js` (bootstrap mongoose z `app.js`), usuń martwy `dbmongo.js` (zazębia się z K1).
2. Zdefiniuj domenowy `PreAppointmentSurvey` (VO + `create()` z walidacją) — czysty, jednostkowo testowalny.
3. Zdefiniuj port `SurveyRepository`; przenieś schemat + mapowanie do `MongooseSurveyRepository`.
4. Przełącz `surveyController` na port + domenę; usuń `filteredSurveyData`; zwracaj `toWire`.
5. Zakoduj w adapterze kanoniczną decyzję linku Ankieta↔Wizyta (`AppointmentID`); rozstrzygnij martwy `appointments.SurveyID` (D-A).
6. (opcjonalnie) FE: współdziel kształt `Survey` z kontraktem wire.

> **Nota o testach [E]:** backend nie ma runnera (`backend/package.json:8` placeholder). Domenowy VO
> jest jednostkowo testowalny bez DB (faza 2 — **test-first**); adapter wymaga testu integracyjnego z
> Mongo testowym. Wprowadzenie ACL to dobry moment na pierwsze testy (wspólne z planem agregatu, artefakt 02).

---

### Podsumowanie
Najgorszym przeciekiem zależności jest **Mongoose w rdzeniowej domenie Ankiety przedwizytowej**: biblioteka
przecieka przez 4 warstwy (`app.js`, `config/dbmongo.js`, `schemas/surveySchema.js`, `services/surveyService.js`)
i — co groźniejsze — „model" domenowy Ankiety JEST schematem Mongoose, a warstwa serwisu mówi wprost API
Mongoose (`.create/.find/.findOne`). Ten sam byt istnieje w trzech rozjechanych kształtach (FE `Survey`,
`filteredSurveyData` w kontrolerze, schemat). Plan wprowadza ACL: framework-free value object
`PreAppointmentSurvey` jako jedyne źródło kształtu, **wąski port** `SurveyRepository` i **adapter** Mongoose
będący jedynym miejscem wiedzy o bibliotece (schemat + mapowanie + kanoniczny link `AppointmentID`).
Kryterium sukcesu jest weryfikowalne grepem: po refaktorze `mongoose` występuje wyłącznie w adapterze i
bootstrapie połączenia — wymiana store'u nie tyka domeny, kontrolera, API ani UI. OpenAI pozostaje prostszym,
wtórnym kandydatem ACL (Generic, 2 pliki, w tym martwy import w `app.js:14`).
