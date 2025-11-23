# **TESZT JEGYZŐKÖNYV \- Témák (Topics) & Profil (Profile) API**

## **Általános információk**

| Mező | Érték |
| :---- | :---- |
| **Projekt neve** | CtrlAltDefekt \- Kvízjáték (Topics & Profile Modul) |
| **Prioritás** | Magas |
| **Leírás** | A app/api/topics.py és app/api/profile.py fájlokban definiált végpontok funkcionális tesztelése. Fókuszban a témák kezelése (Admin CRUD) és a felhasználói profil műveletek. |
| **Teszt célja** | Annak igazolása, hogy a témák kezelése csak adminok számára lehetséges, a publikus listázás működik, és a profilműveletek (lekérdezés, törlés) helyesen és biztonságosan futnak le. |

| Mező | Érték |
| :---- | :---- |
| **Teszt eset szerzője** | Tusnádi Szabolcs |
| **Teszt eset felülvizsgálója** | Erdős Csaba (Product Owner) |
| **Teszt eset verziója** | 1.1 |
| **Teszt végrehajtás dátuma** | 2025-11-23 |

## **Teszt eset részletek**

| Teszt Eset ID | Teszt Lépések | Input Adat | Várható Eredmény | Aktuális Eredmény | Teszt Környezet | Végrehajtás Státusz | Bug Súlyossága | Bug Prioritása | Megjegyzések |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| **Topics API** |  |  |  |  |  |  |  |  |  |
| TCT-001 | 1\. GET /api/topics/ hívása bejelentkezés nélkül. | Header: Nincs | HTTP 200 OK, JSON lista a témákról. | HTTP 200 OK | Dev | Sikeres | \- | \- | Publikus hozzáférés működik. |
| TCT-002 | 1\. POST /api/topics/ hívása Admin joggal. | Header: Valid Admin JWT Body: {"name": "Új Téma"} | HTTP 201 Created, {"id": X, "name": "Új Téma"} | HTTP 201 Created | Dev | Sikeres | \- | \- | Sikeres létrehozás. |
| TCT-003 | 1\. POST /api/topics/ hívása normál felhasználóként. | Header: Valid User JWT Body: {"name": "Hacker Téma"} | HTTP 403 Forbidden, {"error": "Admin access required"} | HTTP 403 Forbidden | Dev | Sikeres | \- | \- | Jogosultság ellenőrzés rendben. |
| TCT-004 | 1\. POST /api/topics/ hívása már létező névvel. | Header: Valid Admin JWT Body: {"name": "Létező Téma"} | HTTP 409 Conflict, {"error": "Topic already exists"} | HTTP 409 Conflict | Dev | Sikeres | \- | \- | Duplikáció szűrés rendben. |
| TCT-005 | 1\. POST /api/topics/ hívása hiányzó névvel. | Header: Valid Admin JWT Body: {} | HTTP 400 Bad Request, {"error": "Missing topic name"} | HTTP 400 Bad Request | Dev | Sikeres | \- | \- | Validáció rendben. |
| TCT-006 | 1\. GET /api/topics/\<id\> hívása létező ID-val. | URL: /api/topics/1 | HTTP 200 OK, {"id": 1, "name": "..."} | HTTP 200 OK | Dev | Sikeres | \- | \- | Egyedi lekérdezés működik. |
| TCT-007 | 1\. GET /api/topics/\<id\> hívása nem létező ID-val. | URL: /api/topics/999 | HTTP 404 Not Found, {"error": "Topic not found"} | HTTP 404 Not Found | Dev | Sikeres | \- | \- | Hibakezelés rendben. |
| TCT-008 | 1\. PUT /api/topics/\<id\> hívása Admin joggal (névváltoztatás). | Header: Valid Admin JWT URL: /api/topics/1 Body: {"name": "Frissített Téma"} | HTTP 200 OK, {"id": 1, "name": "Frissített Téma"} | HTTP 200 OK | Dev | Sikeres | \- | \- | Sikeres frissítés. |
| TCT-009 | 1\. PUT /api/topics/\<id\> hívása olyan névre, ami már másnál létezik. | Header: Valid Admin JWT URL: /api/topics/1 Body: {"name": "Másik Létező Téma"} | HTTP 409 Conflict, {"error": "Topic name already in use"} | HTTP 409 Conflict | Dev | Sikeres | \- | \- | Egyediség megőrzése update-nél rendben. |
| TCT-010 | 1\. DELETE /api/topics/\<id\> hívása Admin joggal (használaton kívüli téma). | Header: Valid Admin JWT URL: /api/topics/2 | HTTP 200 OK, {"message": "Topic deleted successfully"} | HTTP 200 OK | Dev | Sikeres | \- | \- | Sikeres törlés. |
| TCT-011 | 1\. DELETE /api/topics/\<id\> hívása Admin joggal (kvízhez kapcsolt téma). | Header: Valid Admin JWT URL: /api/topics/1 (van hozzá kvíz) | HTTP 409 Conflict, {"error": "Cannot delete topic..."} | HTTP 409 Conflict | Dev | Sikeres | \- | \- | Referenciális integritás védelme működik. |
| **Profile API** |  |  |  |  |  |  |  |  |  |
| TCP-001 | 1\. GET /api/profile/ hívása bejelentkezett felhasználóként. | Header: Valid User JWT | HTTP 200 OK, {"id": X, "username": "...", "email": "..."} | HTTP 200 OK | Dev | Sikeres | \- | \- | Saját adatok lekérése rendben. |
| TCP-002 | 1\. GET /api/profile/ hívása bejelentkezés nélkül. | Header: Nincs | HTTP 401 Unauthorized, JWT hibaüzenet. | HTTP 401 Unauthorized | Dev | Sikeres | \- | \- | Védett végpont rendben. |
| TCP-003 | 1\. DELETE /api/profile/ hívása (Fiók törlése). | Header: Valid User JWT | HTTP 200 OK, {"message": "A fiókod sikeresen törölve."} | HTTP 200 OK | Dev | Sikeres | \- | \- | Sikeres törlés. |
| TCP-004 | 1\. Fiók törlésének ellenőrzése (Adatbázis szinten). | Lépés: TCP-003 után ellenőrzés. | A User rekord és a hozzá tartozó Result/Quiz rekordok eltűntek. | Rekordok törölve | Dev | Sikeres | \- | \- | Kaszkádolt törlés működik. |
| TCP-005 | 1\. Törölt fiókkal való bejelentkezés kísérlete. | Lépés: TCP-003 után login. | HTTP 401 Unauthorized, {"error": "Hibás e-mail cím vagy jelszó"} | HTTP 401 Unauthorized | Dev | Sikeres | \- | \- | Hozzáférés megszűnt. |
| TCP-006 | 1\. DELETE /api/profile/ hívása érvénytelen tokennel. | Header: Invalid JWT | HTTP 422 Unprocessable Entity (vagy 401\) | 422/401 | Dev | Sikeres | \- | \- | Token validáció rendben. |

