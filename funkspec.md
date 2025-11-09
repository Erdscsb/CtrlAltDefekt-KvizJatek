# Funkcionális specifikáció -- Kvízjáték

## 1. Jelenlegi helyzet
A jelenlegi quiz alkalmazások jellemzően statikus adatbázisokon alapulnak, hiányzik a dinamikus, AI-alapú tartalomgenerálás és a személyre szabott élmény. A regisztráció nélküli használat korlátozott, az adminisztráció manuális és időigényes.

## 2. Vágyálomrendszer

## 3. A rendszerre vonatkozó pályázat, törvények, rendeletek

## 4. Jelenlegi üzleti folyamatok modellje

## 5. Igényelt üzleti folyamatok modellje

## 6. Követelménylista

## 7. Használati esetek

## 8. Képernyőtervek (Logikai felépítés)

## 9. Forgatókönyvek

## 10. Funkció – Követelmény Megfeleltetés

## 11. Fogalomszótár
* **AI generálás:** Kérdések és válaszok automatikus előállítása mesterséges intelligencia (OpenAI API) segítségével.
* **Quiz:** Kérdésekből álló játék vagy teszt, amely pontszám alapján értékeli a felhasználót.
* **Admin:** Olyan felhasználói szerepkör (`is_admin=True` az `users` táblában), aki a rendszer működését és tartalmát kezelheti (pl. témakörök).
* **GDPR:** Általános adatvédelmi rendelet.
* **Frontend:** A felhasználó által látott, böngészőben futó alkalmazásrész (React).
* **Backend:** A szerveroldali logika, adatbázis-kezelés és AI integráció (Flask).
* **API (Application Programming Interface):** A Frontend és Backend közötti kommunikációs csatorna. Jellemzően RESTful API (JSON).
* **SQLite:** Egy szerver nélküli, fájl-alapú adatbázis-kezelő. Az adatbázis egyetlen `.db` fájlban tárolódik.
* **JWT (JSON Web Token):** A felhasználói bejelentkezés állapotának (session) kezelésére szolgáló token, amit a Flask generál és a React tárol (pl. LocalStorage).
* **CRUD:** Create, Read, Update, Delete. Az adatbázis-műveletek alapvető csoportja (pl. témák kezelésénél).
* **Prompt:** Az AI-nak (OpenAI) adott szöveges utasítás, amely leírja, hogy milyen kimenetet (pl. milyen kvízkérdéseket) várunk tőle.
