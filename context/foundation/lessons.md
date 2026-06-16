# Lessons Learned

> Append-only register of recurring rules and patterns. Re-read at start by /10x-frame, /10x-research, /10x-plan, /10x-plan-review, /10x-implement, /10x-impl-review.

## Koercuj typy na szwie FE↔BE, gdy źródłem jest localStorage

- **Context**: typowanie/DTO na granicy FE↔BE dla payloadu, gdzie wartość pochodzi z localStorage (np. PatientID z userLocalStorageData.id)
- **Problem**: localStorage zawsze zwraca string; gdy kontrakt/kolumna oczekuje number, podstawienie typu wywraca `ng build` (`string` not assignable to `number`), a po luzowaniu typu guard BE odrzuca poprawny ruch. W K2 PatientID był stringiem na drucie mimo liczbowej kolumny.
- **Rule**: Na szwie FE↔BE koercuj wartości z localStorage do typu kontraktu w miejscu budowy payloadu (np. `Number(id)`); BE waliduj koercowalność, nie surowy `typeof`. Faza typowania i faza walidacji muszą trzymać tę samą umowę.
- **Applies to**: plan, plan-review, implement, impl-review

## Uważaj na Number("") i Number([]) przy ręcznej walidacji liczb

- **Context**: ręczna (bez biblioteki) walidacja pól liczbowych w kontrolerach Express/Node
- **Problem**: `Number("")`, `Number("   ")`, `Number([])` dają `0` (nie `NaN`), więc naiwny guard `!Number.isNaN(Number(v))` przepuszcza puste/whitespace/array jako poprawne 0.
- **Rule**: Walidując koercowalność do liczby, jawnie odrzucaj `null/undefined/""` przed `Number(...)` i wyklucz `typeof v === "object"`; nie polegaj na samym `Number.isNaN(Number(v))`.
- **Applies to**: implement, impl-review

## Sequelize bulkCreate wymaga tablicy, nie obiektu

- **Context**: zapisy przez Sequelize `Model.bulkCreate(...)` (np. tworzenie grafiku lekarza w createSchedules)
- **Problem**: przekazanie pojedynczego obiektu zamiast tablicy rzuca `records.map is not a function` → 500; rekord nie powstaje (z UI wygląda jak cichy brak zapisu).
- **Rule**: Do `bulkCreate` zawsze przekazuj tablicę (`[obj]` dla jednego rekordu); dla pojedynczego użyj `create`. Waliduj kształt wejścia w kontrolerze przed wywołaniem.
- **Applies to**: implement, impl-review
