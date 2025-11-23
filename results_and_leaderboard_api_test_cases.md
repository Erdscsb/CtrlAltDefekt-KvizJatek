# TESZT ESET SABLON

## Általános információk

| Mező | Érték |
| :--- | :--- |
| **Projekt neve** | CtrlAltDefekt - Kvízjáték |
| **Prioritás** | Magas |
| **Leírás** | A `result.py` és `leaderboard.py` API végpontjainak funkcionális tesztelése. Fókuszban a szerveroldali pontszámítás pontossága, az eredmények mentése, a jogosultsági szintek (User vs Admin) ellenőrzése, és a ranglétra aggregációs logikája. |
| **Teszt célja** | Annak igazolása, hogy a rendszer helyesen értékeli ki a kvízeket, biztonságosan kezeli az eredményeket, és pontos ranglistát szolgáltat. |

| Mező | Érték |
| :--- | :--- |
| **Teszt eset szerzője** | Erdős Csaba (Product Owner) |
| **Teszt eset felülvizsgálója** | Lovas Gergő (Backend Dev) |
| **Teszt eset verziója** | 1.0 |
| **Teszt végrehajtás dátuma** | 2025-11-23 |

---

## Teszt eset részletek (20 sor)

| Teszt Eset ID | Teszt Lépések | Input Adat | Várható Eredmény | Aktuális Eredmény | Teszt Környezet | Végrehajtás Státusz | Bug Súlyossága | Bug Prioritása | Megjegyzések |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC-001 | 1. POST kérés a `/result/` végpontra.<br>2. Minden kérdésre helyes válasz küldése. | Header: Valid JWT<br>Body: `{"quiz_id": 1, "answers": [{"question_id": 101, "selected_answer": "CorrectA"}, ...]}` | HTTP 201 Created,<br>JSON: `{"score": 5, "total_questions": 5, ...}` | Megegyezik a várttal | Dev / Local | Sikeres | - | - | Maximális pontszám számítása. |
| TC-002 | 1. POST kérés részben helyes válaszokkal. | Header: Valid JWT<br>Body: `{"quiz_id": 1, "answers": [1 helyes, 1 helytelen]}` | HTTP 201 Created,<br>Mentett Score: 1/2. | Megegyezik a várttal | Dev / Local | Sikeres | - | - | Részleges pontszámítás. |
| TC-003 | 1. POST kérés csupa helytelen válasszal. | Header: Valid JWT<br>Body: `{"quiz_id": 1, "answers": [mind rossz]}` | HTTP 201 Created,<br>Mentett Score: 0/5. | Megegyezik a várttal | Dev / Local | Sikeres | - | - | 0 pontos eredmény kezelése. |
| TC-004 | 1. POST kérés üres válaszlistával (`answers: []`). | Header: Valid JWT<br>Body: `{"quiz_id": 1, "answers": []}` | HTTP 400 Bad Request,<br>Error: "A válaszok száma nem egyezik..." | Megegyezik a várttal | Dev / Local | Sikeres | Közepes | Közepes | Validáció: üres lista. |
| TC-005 | 1. POST kérés nem létező `quiz_id`-val. | Header: Valid JWT<br>Body: `{"quiz_id": 9999, "answers": [...]}` | HTTP 404 Not Found,<br>Error: "Kvíz nem található" | Megegyezik a várttal | Dev / Local | Sikeres | Alacsony | Alacsony | Integritás ellenőrzés. |
| TC-006 | 1. POST kérés idegen `question_id`-val (másik kvízhez tartozó kérdés). | Header: Valid JWT<br>Body: `{"quiz_id": 1, "answers": [{"question_id": 999, ...}]}` | HTTP 201 Created (Score nem nő), vagy 400 Bad Request (ha a darabszám nem stimmel). | Megegyezik a várttal | Dev / Local | Sikeres | Magas | Magas | Csalás elleni védelem (Questions ID mismatch). |
| TC-007 | 1. POST kérés kevesebb válasszal, mint a kérdések száma. | Header: Valid JWT<br>Body: `{"quiz_id": 1 (5 kérdés), "answers": [csak 3 db]}` | HTTP 400 Bad Request,<br>Error: "A válaszok száma nem egyezik..." | Megegyezik a várttal | Dev / Local | Sikeres | Közepes | Közepes | Validáció: hiányos kitöltés. |
| TC-008 | 1. POST kérés érvénytelen adatszerkezettel (nem lista). | Header: Valid JWT<br>Body: `{"quiz_id": 1, "answers": "string_not_list"}` | HTTP 400 Bad Request,<br>Error: "Hiányzó ... vagy 'answers' lista" | Megegyezik a várttal | Dev / Local | Sikeres | Alacsony | Alacsony | Bemeneti formátum ellenőrzése. |
| TC-009 | 1. GET kérés a `/result/` végpontra (User). | Header: Valid JWT (User A) | HTTP 200 OK,<br>Csak a User A eredményeit tartalmazó lista. | Megegyezik a várttal | Dev / Local | Sikeres | - | - | Saját eredmények listázása. |
| TC-010 | 1. GET kérés a `/result/` végpontra (Admin). | Header: Valid JWT (Admin) | HTTP 200 OK,<br>Minden felhasználó eredménye látható. | Megegyezik a várttal | Dev / Local | Sikeres | - | - | Admin láthatóság tesztelése. |
| TC-011 | 1. GET kérés egy konkrét eredményre (`/result/<id>`) - Saját. | Header: Valid JWT (Owner) | HTTP 200 OK,<br>Részletes eredmény JSON. | Megegyezik a várttal | Dev / Local | Sikeres | - | - | Részletező nézet. |
| TC-012 | 1. GET kérés más felhasználó eredményére (`/result/<id>`). | Header: Valid JWT (User B) | HTTP 403 Forbidden,<br>Error: "You do not have permission..." | Megegyezik a várttal | Dev / Local | Sikeres | Kritikus | Kritikus | Adatvédelmi teszt (Horizontális eszkaláció). |
| TC-013 | 1. GET kérés más felhasználó eredményére (Admin). | Header: Valid JWT (Admin) | HTTP 200 OK,<br>Az eredmény adatai megjelennek. | Megegyezik a várttal | Dev / Local | Sikeres | - | - | Admin hozzáférés ellenőrzése. |
| TC-014 | 1. GET kérés nem létező eredmény ID-ra. | Header: Valid JWT<br>URL: `/result/99999` | HTTP 404 Not Found,<br>Error: "Result not found" | Megegyezik a várttal | Dev / Local | Sikeres | Alacsony | Alacsony | Hibakezelés. |
| TC-015 | 1. GET kérés `/result/user/<id>` (Admin endpoint). | Header: Valid JWT (Admin)<br>URL: `/result/user/2` | HTTP 200 OK,<br>A 2-es ID-jú user összes eredménye. | Megegyezik a várttal | Dev / Local | Sikeres | - | - | Admin specifikus szűrés. |
| TC-016 | 1. GET kérés a `/leaderboard/` végpontra. | Header: Valid JWT | HTTP 200 OK,<br>JSON lista csökkenő pontszám szerint rendezve. | Megegyezik a várttal | Dev / Local | Sikeres | - | - | Ranglétra alapműködés. |
| TC-017 | 1. Ranglétra limit ellenőrzése (Több mint 10 user esetén). | Adatbázis: 15 user eredményekkel.<br>Header: Valid JWT | HTTP 200 OK,<br>A lista hossza pontosan 10 elem. | Megegyezik a várttal | Dev / Local | Sikeres | Alacsony | Alacsony | Top 10 limit tesztelése. |
| TC-018 | 1. Ranglétra lekérése üres adatbázis esetén. | Adatbázis: Nincs eredmény.<br>Header: Valid JWT | HTTP 200 OK,<br>Üres lista `[]`. | Megegyezik a várttal | Dev / Local | Sikeres | - | - | Üres állapot kezelése. |
| TC-019 | 1. Ranglétra lekérése bejelentkezés nélkül. | Header: Nincs (Hiányzó Token) | HTTP 401 Unauthorized,<br>Error: "Missing Authorization Header" | Megegyezik a várttal | Dev / Local | Sikeres | Magas | Magas | Védett végpont ellenőrzése. |
| TC-020 | 1. Új eredmény beküldése.<br>2. Ranglétra lekérése és frissülés ellenőrzése. | User A beküld +100 pontot.<br>GET `/leaderboard/` | HTTP 200 OK,<br>User A összpontszáma növekedett, helyezése javult. | Megegyezik a várttal | Dev / Local | Sikeres | - | - | Valós idejű frissülés tesztje. |
