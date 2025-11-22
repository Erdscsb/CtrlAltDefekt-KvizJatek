# TESZT ESET SABLON

## Általános információk

| Mező | Érték |
| :--- | :--- |
| **Projekt neve** | Quiz API Modul (Flask) |
| **Prioritás** | Magas |
| **Leírás** | A `quiz.py` fájlban definiált végpontok (Létrehozás, Lekérdezés, Módosítás, Törlés) funkcionális tesztelése, beleértve az AI generálást és a jogosultságkezelést. |
| **Teszt célja** | Annak igazolása, hogy a kvíz API helyesen kezeli a bemeneti adatokat, a jogosultságokat (JWT), és a tranzakciókat. |

| Mező | Érték |
| :--- | :--- |
| **Teszt eset szerzője** | Gergő Lovas |
| **Teszt eset felülvizsgálója** | Lead Developer |
| **Teszt eset verziója** | 1.0 |
| **Teszt végrehajtás dátuma** | 2025-11-22 |

---

## Teszt eset részletek (20 sor)

| Teszt Eset ID | Teszt Lépések | Input Adat | Várható Eredmény | Aktuális Eredmény | Teszt Környezet | Végrehajtás Státusz | Bug Súlyossága | Bug Prioritása | Megjegyzések |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC-001 | 1. POST kérés küldése a `/quiz/` végpontra.<br>2. Manuális kérdések megadása. | Header: Valid JWT<br>Body: `{"topic_id": 1, "difficulty": "medium", "questions": [{"question_text": "Q1", "options": ["A", "B"], "correct_option_index": 0}]}` | HTTP 201 Created,<br>JSON: `{"message": "Quiz created successfully", ...}` | Megegyezik a várttal | Dev / Local | Sikeres | - | - | Manuális létrehozás sikeres. |
| TC-002 | 1. POST kérés küldése a `/quiz/` végpontra.<br>2. AI generálás kérése (`ai_generate: true`). | Header: Valid JWT<br>Body: `{"custom_topic": "History", "difficulty": "hard", "ai_generate": true, "num_questions": 5}` | HTTP 201 Created,<br>JSON: `{"questions_count": 5}` | Megegyezik a várttal | Dev / Local | Sikeres | - | - | AI integráció tesztelése. |
| TC-003 | 1. POST kérés küldése hiányzó témával. | Header: Valid JWT<br>Body: `{"difficulty": "easy", "questions": [...]}` | HTTP 400 Bad Request,<br>Error: "Either 'topic_id' or 'custom_topic' is required" | Megegyezik a várttal | Dev / Local | Sikeres | Közepes | Közepes | Validáció ellenőrzése. |
| TC-004 | 1. POST kérés küldése nem létező `topic_id`-val. | Header: Valid JWT<br>Body: `{"topic_id": 9999, "difficulty": "easy"}` | HTTP 404 Not Found,<br>Error: "Topic with id 9999 not found" | Megegyezik a várttal | Dev / Local | Sikeres | Alacsony | Alacsony | Adatbázis konzisztencia teszt. |
| TC-005 | 1. POST kérés küldése hiányzó nehézségi szinttel. | Header: Valid JWT<br>Body: `{"custom_topic": "Math"}` | HTTP 400 Bad Request,<br>Error: "Missing 'difficulty'" | Megegyezik a várttal | Dev / Local | Sikeres | Közepes | Közepes | Kötelező mező teszt. |
| TC-006 | 1. AI generálás kérése érvénytelen `num_questions` számmal (pl. 20). | Header: Valid JWT<br>Body: `{"custom_topic": "Space", "difficulty": "easy", "ai_generate": true, "num_questions": 20}` | HTTP 400 Bad Request,<br>Error: "num_questions must be an integer between 1 and 15" | Megegyezik a várttal | Dev / Local | Sikeres | Alacsony | Alacsony | Határérték tesztelés. |
| TC-007 | 1. AI generálás kérése téma megnevezése nélkül (`topic_id` valid, de a DB-ben nincs név, vagy `custom` hiányzik). | Header: Valid JWT<br>Body: `{"ai_generate": true, "difficulty": "easy"}` (Topic ID nélkül) | HTTP 400 Bad Request,<br>Error: "Cannot generate questions without a topic name..." | Megegyezik a várttal | Dev / Local | Sikeres | Közepes | Közepes | Logikai ág tesztelése. |
| TC-008 | 1. Manuális létrehozás üres kérdéslistával. | Header: Valid JWT<br>Body: `{"custom_topic": "T", "difficulty": "E", "questions": []}` | HTTP 400 Bad Request,<br>Error: "Missing 'questions' list or list is empty..." | Megegyezik a várttal | Dev / Local | Sikeres | Közepes | Közepes | Üres lista kezelése. |
| TC-009 | 1. Manuális kérdés kevesebb mint 2 opcióval. | Header: Valid JWT<br>Body: `{"...": "...", "questions": [{"question_text": "Q", "options": ["A"], "correct_option_index": 0}]}` | HTTP 400 Bad Request,<br>Error: "Invalid question data: ... must be a list with at least 2 items" | Megegyezik a várttal | Dev / Local | Sikeres | Magas | Magas | Adat integritás teszt. |
| TC-010 | 1. Manuális kérdés érvénytelen `correct_option_index`-szel (túlindexelés). | Header: Valid JWT<br>Body: `{"...": "...", "questions": [{"options": ["A", "B"], "correct_option_index": 5}]}` | HTTP 400 Bad Request,<br>Error: "Invalid question data: Invalid 'correct_option_index'" | Megegyezik a várttal | Dev / Local | Sikeres | Magas | Magas | Logikai validáció. |
| TC-011 | 1. GET kérés a `/quiz/` végpontra (lista lekérése). | Header: Nincs (Public) | HTTP 200 OK,<br>JSON lista a kvízekről (kérdések nélkül). | Megegyezik a várttal | Dev / Local | Sikeres | - | - | Publikus végpont teszt. |
| TC-012 | 1. GET kérés egy létező kvízre `/quiz/<id>`.<br>2. Válasz tartalmának ellenőrzése. | URL param: `quiz_id=1` (létező) | HTTP 200 OK,<br>JSON tartalmazza a kérdéseket (`questions` lista). | Megegyezik a várttal | Dev / Local | Sikeres | - | - | Részletek lekérése. |
| TC-013 | 1. Biztonsági teszt: `correct_option_index` ellenőrzése a válaszban. | URL param: `quiz_id=1` | HTTP 200 OK,<br>A válasz JSON **NEM** tartalmazhatja a `correct_option_index` mezőt. | Megegyezik a várttal | Dev / Local | Sikeres | Kritikus | Kritikus | Data Leakage megelőzése. |
| TC-014 | 1. GET kérés nem létező kvízre. | URL param: `quiz_id=99999` | HTTP 404 Not Found,<br>Error: "Quiz not found" | Megegyezik a várttal | Dev / Local | Sikeres | Alacsony | Alacsony | Hibakezelés. |
| TC-015 | 1. DELETE kérés saját kvíz törlésére. | Header: Valid JWT (Owner User)<br>URL: `/quiz/<own_id>` | HTTP 200 OK,<br>Message: "Quiz deleted successfully" | Megegyezik a várttal | Dev / Local | Sikeres | - | - | Jogosultság: Tulajdonos. |
| TC-016 | 1. DELETE kérés más felhasználó kvízére (nem admin). | Header: Valid JWT (User B)<br>URL: `/quiz/<User_A_Quiz_ID>` | HTTP 403 Forbidden,<br>Error: "You do not have permission to delete this quiz" | Megegyezik a várttal | Dev / Local | Sikeres | Magas | Magas | Jogosultság: Idegen hozzáférés tiltása. |
| TC-017 | 1. DELETE kérés nem létező kvízre. | Header: Valid JWT<br>URL: `/quiz/9999` | HTTP 404 Not Found,<br>Error: "Quiz not found" | Megegyezik a várttal | Dev / Local | Sikeres | Alacsony | Alacsony | Törlési hibakezelés. |
| TC-018 | 1. PUT kérés kvíz frissítésére (Metaadat + Kérdések cseréje). | Header: Valid JWT (Owner)<br>Body: `{"difficulty": "hard", "questions": [new_list]}` | HTTP 200 OK,<br>Message: "Quiz updated successfully" | Megegyezik a várttal | Dev / Local | Sikeres | - | - | Teljes update működése. |
| TC-019 | 1. PUT kérés más kvízének módosítására. | Header: Valid JWT (User B)<br>Body: `{"difficulty": "easy"}` | HTTP 403 Forbidden,<br>Error: "You do not have permission to edit this quiz" | Megegyezik a várttal | Dev / Local | Sikeres | Magas | Magas | Módosítási védelem. |
| TC-020 | 1. PUT kérés érvénytelen kérdés adatokkal (hiányzó mező). | Header: Valid JWT (Owner)<br>Body: `{"questions": [{"question_text": "Missing opts"}]}` | HTTP 400 Bad Request,<br>Error: "Invalid data: Each new question must have..." | Megegyezik a várttal | Dev / Local | Sikeres | Közepes | Közepes | Tranzakció rollback tesztelése. |