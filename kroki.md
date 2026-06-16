# Kroki refaktoryzacji — portal-pacjenta (metodyka 10xDevs, moduł 4)

Dokument przekłada metodykę **modułu 4 (praca z kodem legacy)** na konkretny plan dla
tego repozytorium. Źródłem są prompty w `.claude/prompts/m4l2…m4l5` oraz skille `/10x-*`.
Kolejność jest istotna: **najpierw rozumiemy teren, potem decydujemy co naprawić, dopiero
na końcu piszemy kod.** Na etapach eksploracji NIE refaktoryzujemy.

Każda lekcja produkuje **artefakt w `context/`** — to jest pamięć między sesjami i wejście
do kolejnego kroku. Uruchamiaj poszczególne prompty w **świeżych sesjach** (czysty kontekst).

## Adaptacja do tego repo

Prompty kursowe mają ścieżki z innego projektu. W tym repo odpowiadają im:

| W prompcie kursowym                 | W portal-pacjenta                                        |
| ----------------------------------- | -------------------------------------------------------- |
| `webapp`, `channels/src`            | `frontend/src/app` (Angular)                             |
| `platform/client`, `platform/types` | `frontend/src/app/services`, `frontend/src/app/types`    |
| warstwa serwerowa                   | `backend/src` (controllers / services / models / routes) |

Widoczne już z miejsca podejrzane obszary (warte uwagi w analizie, ale **bez przesądzania
wyniku**): `patientController.js` + `patientController2.js`, `patientModel.js` +
`patientModel2.js` (duplikacja), dwa silniki bazodanowe (`dbmysql.js` + `dbmongo.js`),
brak warstwy testów.

---

## Faza 0 — Przygotowanie

- [x] **0.1** Zainicjuj strukturę kontekstu: `/10x-init` (utworzy `context/{changes,archive,foundation}` + README).
- [x] **0.2** Utwórz katalog na mapę repo: `context/map/`.
- [x] **0.3** Sprawdź narzędzia bazowe — Node/npm, `git log` działa, oraz zainstaluj
      narzędzia analityczne używane dalej: **dependency-cruiser** (graf zależności) i
      **ast-grep** (weryfikacja twierdzeń strukturalnych).

---

## Faza 1 — Mapa repozytorium (Lekcja 2)

Cel: dokument onboardingowy „gdzie projekt żyje → jak jest powiązany → kogo zapytać”.
Trzy artefakty + synteza. Każdy w osobnej sesji.

- [x] **1.1 Mapa terytorium (historia gita)** — prompt `.claude/prompts/m4l2-1-territory-git-history.md`.
  - TOP 10 najczęściej zmienianych folderów i plików za ostatnie 12 mies. (odfiltruj
    lockfile'y, `dist/`, `node_modules/`, configi).
  - Podział na kwartały (gdzie przenosił się nacisk pracy).
  - Współzmiany: które katalogi/pliki zmieniają się razem; czy jest „wspólny mianownik”
    całego repo. Sprawdź, czy mocno sprzężone pliki nadal istnieją.
  - → zapis do `context/map/artifact-1-territory.md`.

- [x] **1.2 Mapa strukturalna (dependency-cruiser)** — prompt `.claude/prompts/m4l2-2-structure-dependency-cruiser.md`.
  - Skonfiguruj dependency-cruiser w projekcie.
  - Cykle zależności w najaktywniejszych obszarach `frontend/src/app` (np.
    `components/`, `services/`, `types/`); dla backendu sprawdź sprzężenia
    controllers ↔ services ↔ models.
  - Granice warstw: czy `services`/`types` są fundamentem i czy komponenty nie importują
    „w poprzek” tego, co zaskoczy przy zmianie.
  - Ryzyka testowalności: gdzie trzeba dużo mockować, gdzie lepszy test integracyjny/e2e.
  - SVG podgrafu renderuj **dopiero po selekcji** (`--focus`/`--include-only`/`--collapse`).
  - → zapis do `context/map/artifact-2-structure.md`.

- [x] **1.3 Mapa kontrybutorów (git)** — prompt `.claude/prompts/m4l2-3-contributors-git.md`.
  - Z artefaktów 1+2 wybierz top 5 obszarów wymagających kontaktu z autorem.
  - Kluczowi kontrybutorzy z 12 mies. (odfiltruj boty i commity agentów AI bez autora-człowieka).
  - → zapis do `context/map/artifact-3-contributors.md`.
  - _Uwaga:_ to repo solo-deweloperskie — krok może dać cienki wynik; wtedy zaznacz to jako ograniczenie.

- [x] **1.4 Synteza → repo-map** — prompt `.claude/prompts/m4l2-repo-map-synthesis.md`.
  - Połącz trzy artefakty w jeden onboardingowy dokument (Mermaid, strefy ryzyka, „pierwsze
    5–8 plików do przeczytania”, wprost wypisane ograniczenia metody).
  - → zapis do `context/map/repo-map.md`.

**Bramka fazy 1:** po 15 min lektury `repo-map.md` widać, gdzie boli i od czego zacząć.

---

## Faza 2 — Research wybranego przepływu (Lekcja 3)

Cel: głęboka analiza JEDNEGO realnego przepływu wskazanego przez mapę (w portal-pacjenta
naturalni kandydaci: **proces wizyty/umawiania (appointment)** albo **ankieta
przedwizytowa (survey)** — wybierz wg `repo-map.md`).

- [x] **2.1 Research 3 sub-agentami** — wzorzec `.claude/prompts/m4l3-1-research-with-map.md`. → change-id: `appointment-booking-analysis`
  - `/10x-research <nazwa-zmiany>` z trzema równoległymi sub-agentami:
    1. **Trace e2e** — ścieżka od entry pointu przez warstwy do zapisu/odczytu (sekwencja `file:line` + Mermaid).
    2. **Luki w testach** — które metody/gałęzie mają pokrycie, a które nie.
    3. **Blast radius** — co musi zmienić się razem (graf statyczny + co-change z gita).
  - Raport MUSI mieć sekcje **Feature overview** i **Technical debt**.
  - → zapis do `context/changes/<nazwa-zmiany>/research.md`.

- [x] **2.2 Weryfikacja ast-grep** — prompt `.claude/prompts/m4l3-2-ast-grep-verification.md`.
  - Wypisz z raportu twierdzenia **strukturalne** (liczby call-site'ów, „tylko tutaj”,
    „zawsze przez X”).
  - Dla każdego zbuduj wzorzec ast-grep, uruchom, sklasyfikuj: potwierdzone / doprecyzowane / obalone (z `plik:linia`).
  - Skoryguj raport wynikami.

**Bramka fazy 2:** twierdzenia z research są zweryfikowane narzędziem, nie tylko „z lektury”.

---

## Faza 3 — Refactor opportunities (Lekcja 4)

Cel: z udokumentowanego długu wybrać **KTÓRE** problemy naprawić, w jakim kształcie i
kolejności. To wciąż **eksploracja** — żadnej decyzji ani kodu.

- [x] **3.1 Nowa zmiana z intencją** — prompt `.claude/prompts/m4l4-1-new-change-intention.md`.
  - `/10x-new refactor-opportunities` — założenie folderu zmiany z jasną intencją (eksploracja → decyzja → implementacja).

- [x] **3.2 Research kandydatów** — prompt `.claude/prompts/m4l4-2-refactor-opportunities-research.md`.
  - `/10x-research refactor-opportunities` — wejście: `research.md` z fazy 2 jako zebrane dowody.
  - Wypisz każdy problem; sklasyfikuj **KANDYDAT** (naprawa zmienia strukturę kodu) vs reszta.
  - Każdego kandydata zbadaj 3 sub-agentami: **obecny kształt** (evidence/inference/unknown),
    **historia i intencjonalność** (świadome ograniczenie vs przypadkowa złożoność),
    **wykonalność migracji** (inkrementalna, odwracalna ścieżka, pierwszy krok-prerekwizyt).
  - Zakończ sekcją **„Refactor opportunities (ranked)”** — 2–3 najmocniejsi kandydaci z trade-offami.
  - Twarde granice: zero zmian w kodzie; jeśli prawdziwa naprawa to przeprojektowanie pojęć
    biznesowych — powiedz to i zatrzymaj się (to materiał na Fazę 4).
  - → zapis do `context/changes/refactor-opportunities/research.md`.

- [x] **3.3 Weryfikacja rankingu ast-grep** — prompt `.claude/prompts/m4l4-3-ranking-ast-grep-verification.md`.
  - Zweryfikuj twierdzenia strukturalne, na których stoi ranking (każde „zero” potwierdź klasycznym grepem).
  - Dodaj sekcję **„## Weryfikacja twierdzeń (ast-grep)”**, popraw liczby w miejscu w formacie
    `150 (raport: 145)`, zaktualizuj frontmatter (`last_updated`, tag `verified`).
  - Sekcji rankingu i werdyktów intencjonalności **nie zmieniaj** — rozbieżności notuj „do decyzji na etapie planowania”.

**Bramka fazy 3:** istnieje zweryfikowany ranking 2–3 możliwości refaktoru. Decyzja zapada dopiero w fazie planowania.

---

## Faza 4 — Domain-Driven Design (Lekcja 5)

Cel: tam, gdzie problem to **pojęcia biznesowe**, a nie tylko struktura kodu. Produkt to
**mapy i plany**, nie kod produkcyjny.

- [x] **4.1 Destylacja domeny** — prompt `.claude/prompts/m4l5-1-domain-distillation.md`.
  - Zbuduj Ubiquitous Language (pojęcia z dokumentów + kodu, z cytatami `plik:linia`).
  - Sklasyfikuj subdomeny: Core / Supporting / Generic (dla portal-pacjenta rdzeniem są
    najpewniej **wizyty + ankieta przedwizytowa**, a uwierzytelnianie/SSO to Generic).
  - Kandydaci na agregaty + ich niezmienniki; tabela **rozjazdów MODEL vs KOD**.
  - → zapis do `context/domain/01-domain-distillation.md`.

- [x] **4.2 Agregat-strażnik niezmiennika** — prompt `.claude/prompts/m4l5-2-invariant-aggregate-refactor.md`.
  - Wybierz niezmiennik **najbardziej rdzeniowy I najsłabiej egzekwowany** (np. reguła
    walidacji ankiety / warunki przejścia statusu wizyty — sprawdź czy egzekwuje to tylko UI Angulara).
  - Zaprojektuj agregat-root jako jedyne miejsce egzekwowania (metody z preconditions,
    nazwany błąd domenowy zamiast cichego update; egzekucja z klienta na serwer).
  - Before/after, plan faz, przypadki testowe (legalne/nielegalne przejścia).
  - → zapis do `context/domain/02-invariant-aggregate-refactor.md`.

- [x] **4.3 Anti-Corruption Layer** — prompt `.claude/prompts/m4l5-3-anti-corruption-layer.md`.
  - Znajdź przeciekającą zależność zewnętrzną (kandydaci tutaj: klient AI w `ai-doctor` /
    `chatController`, mieszanie Mongoose + MySQL, SDK używany po obu stronach granicy).
  - Zaprojektuj wąski port domenowy + adapter; **kryterium sukcesu:** `grep` po nazwie pakietu
    zwraca wyłącznie pliki w katalogu ACL/adaptera.
  - → zapis do `context/domain/03-anti-corruption-layer.md`.

**Bramka fazy 4:** istnieją plany refaktoru DDD z dowodami i kryteriami weryfikacji.

---

## Faza 5 — Decyzja, plan i implementacja

Dopiero teraz zapada decyzja CO realizujemy i powstaje kod.

- [x] **5.1 Plan** — `/10x-plan` dla wybranej możliwości z rankingu (faza 3) lub planu DDD (faza 4). → change-id: `appointment-contract-types` (K2)
- [ ] **5.2 Przegląd planu** — `/10x-plan-review` (substancja, wykonalność, dopasowanie architektoniczne).
- [ ] **5.3 Implementacja** — `/10x-implement` (lub `/10x-tdd` dla faz test-first; `/10x-e2e` dla ryzyk wymagających przeglądarki).
- [ ] **5.4 Przegląd implementacji** — `/10x-impl-review` (drift względem planu, zgodność wzorców).
- [ ] **5.5 Lekcje i archiwizacja** — `/10x-lesson` (powtarzalne reguły) → `/10x-archive` po zamknięciu zmiany.

---

## Zasady przekrojowe (z całego modułu 4)

1. **Dowody przed interpretacją.** Każde twierdzenie strukturalne weryfikuj ast-grep/grep; „zero” potwierdzaj drugim narzędziem.
2. **Eksploracja ≠ implementacja.** W fazach 1–4 nie zmieniamy kodu produkcyjnego.
3. **Świeże sesje + artefakty.** Każdy krok czyta wejściowe artefakty i zapisuje własny do `context/`.
4. **`unknown` jest dozwolone.** Nie wypełniaj luk wiarygodnymi domysłami.
5. **Okno czasowe analizy = 1 rok.** Mapa mówi o aktywności i strukturze, nie o całej prawdzie repo — zaznaczaj to wprost.
6. **Inkrementalnie i odwracalnie.** Każda możliwość refaktoru ma „pierwszy krok-prerekwizyt”, nie wielki przepis naraz.
