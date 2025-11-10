# Funkcionális specifikáció -- Kvízjáték

## 1. Jelenlegi helyzet
A jelenlegi quiz alkalmazások jellemzően statikus adatbázisokon alapulnak, hiányzik a dinamikus, AI-alapú tartalomgenerálás és a személyre szabott élmény. A regisztráció nélküli használat korlátozott, az adminisztráció manuális és időigényes.

## 2. Vágyálomrendszer
A cél egy modern, reszponzív webalkalmazás (React/Flask/SQLite stacken), amely biztosít felhasználói regisztrációt és bejelentkezést. A rendszer képes AI (OpenAI API) segítségével dinamikusan quiz-eket generálni különböző témákban és nehézségi szinteken. A felhasználók teljesítményét (pontszámait) nyomon követi és menti. Adminisztrációs felületet biztosít a rendszer paramétereinek (pl. témakörök) kezelésére és statisztikák megtekintésére.

## 3. A rendszerre vonatkozó pályázat, törvények, rendeletek
* **Technológia (Frontend):** Szabványos HTML/CSS/JavaScript, React keretrendszer használatával.
* **Technológia (Backend):** Python, Flask keretrendszer használatával.
* **Adatbázis:** SQLite.
* **AI Integráció:** OpenAI API (GPT modell) használata.
* **Adatvédelem:** GDPR szabályok betartása a felhasználói adatok (e-mail, jelszó-hash, eredmények) kezelésében.
* **Design:** Reszponzív kialakítás (mobil, tablet, desktop).
* **Média:** Képek (ha a quizek tartalmaznak) JPEG vagy PNG formátumban.

## 4. Jelenlegi üzleti folyamatok modellje
A jelenlegi, piacon lévő (vagy a fejlesztendő rendszer elődjének tekintett) alkalmazások üzleti folyamatai jellemzően statikusak és manuális adminisztráción alapulnak.
### 4.1. Felhasználói folyamat (Statikus Quiz)
1.  **Regisztráció/Bejelentkezés (Korlátozott):** A felhasználó regisztráció nélkül csak limitált quizeket ér el. A teljes hozzáféréshez regisztrálni és bejelentkezni szükséges.
2.  **Témaválasztás:** A felhasználó egy **előre definiált, statikus listából** választ témakört (pl. "Történelem - Középkor").
3.  **Quiz Kitöltése:** A rendszer betölti az adott témához manuálisan rögzített kérdéseket (pl. 10 db) a központi adatbázisból. A felhasználó megválaszolja a kérdéseket.
4.  **Értékelés:** A rendszer a statikusan rögzített helyes válaszok alapján kiértékeli a felhasználó teljesítményét.

### 4.2. Adminisztrációs folyamat (Manuális)
1.  **Kérdésbank Kezelése:** Az adminisztrátor manuálisan rögzíti az új kérdéseket, a válaszlehetőségeket és a helyes választ az adatbázisba.
2.  **Témakörök Kezelése:** Az adminisztrátor hozza létre és rendszerezi a témaköröket (pl. új kategória felvétele).
3.  **Karbantartás:** A folyamat időigényes, rugalmatlan, és nem biztosít dinamikusan generált, személyre szabott tartalmat.

## 5. Igényelt üzleti folyamatok modellje
(A követelményspecifikáció 4.1 pontja alapján)
Az új rendszer a következő fő funkcionális folyamatokat valósítja meg:

1.  **Felhasználókezelés:**
    * Vendég → Regisztrációs űrlap kitöltése → Regisztrált felhasználó.
    * Felhasználó → Bejelentkezési űrlap kitöltése → Bejelentkezett felhasználó (Session/Token kezelés).
2.  **Quiz Generálás:**
    * Felhasználó → Téma és nehézség kiválasztása (vagy egyedi téma megadása) → Backend kérés → OpenAI API hívás → AI generálja a kérdéseket/válaszokat.
3.  **Quiz Lejátszás és Értékelés:**
    * Backend → Kérdések és válaszok mentése adatbázisba (K08) → Kérdések megjelenítése a felhasználónak.
    * Felhasználó → Válaszok megadása → Beküldés.
    * Backend → Válaszok kiértékelése → Pontszám generálása → Eredmény mentése a felhasználó profiljához (K03).
    * Frontend → Eredmény és visszajelzés megjelenítése.
4.  **Eredmények Nyomon követése:**
    * Felhasználó → Profil oldal megtekintése → Korábbi quizek és pontszámok listázása.
5.  **Adminisztráció:**
    * Admin → Bejelentkezés → Admin felület elérése.
    * Admin → Témakörök listázása, létrehozása, módosítása, törlése (CRUD).
    * Admin → Statisztikák megtekintése (pl. felhasználói aktivitás).
    * Admin → AI által generált kérdések minőségének ellenőrzése (opcionális).

## 6. Követelménylista
| Kód | Követelmény | Prioritás |
|---|---|---|
| K01 | Felhasználói regisztráció és bejelentkezés | Magas |
| K02 | AI-generált quiz kérdések és válaszok | Magas |
| K03 | Quiz eredmények mentése és visszajelzés | Magas |
| K04 | Admin felület a témák kezelésére és statisztikákra | Közepes |
| K05 | Reszponzív és mobilbarát felület | Magas |
| K06 | GDPR és adatvédelmi szabályok betartása | Magas |
| K07 | Könnyen üzemeltethető rendszer | Magas |
| K08 | Quiz kérdések mentése | Közepes |

## 7. Használati esetek
A rendszer funkciói a következő fő használati esetekre bonthatók:

### 7.1. Felhasználói modul
* **UC-01: Regisztráció:** A vendég felhasználó e-mail cím, felhasználónév és jelszó megadásával fiókot hoz létre. A rendszer ellenőrzi az adatok érvényességét (pl. e-mail formátum, egyedi e-mail) és a jelszót hash-elve tárolja az SQLite `users` táblában.
* **UC-02: Bejelentkezés:** A regisztrált felhasználó e-mail/felhasználónév és jelszó párossal bejelentkezik. A Flask backend validálja az adatokat, és sikeres azonosítás esetén egy JWT tokent (vagy session cookie-t) állít ki, amit a React frontend tárol.
* **UC-03: Kijelentkezés:** A bejelentkezett felhasználó kijelentkezik. A frontend törli a tokent/sessiont.

### 7.2. Quiz Modul
* **UC-04: Új Quiz Konfigurálása:** A bejelentkezett felhasználó kiválaszt egy előre definiált témát (amit az admin kezel, pl. "Történelem") VAGY megad egy egyedi témát (szöveges beviteli mező). Kiválasztja a nehézségi szintet (pl. Könnyű, Közepes, Nehéz).
* **UC-05: Quiz Generálása (AI):** A felhasználó elindítja a generálást. A React frontend kérést küld a Flask backendnek. A backend (az OpenAI API kulccsal) hívást indít az OpenAI API felé a megadott téma és nehézség alapján, specifikus prompttal (pl. "Generálj 5 db közepes nehézségű kvízkérdést... JSON formátumban...").
* **UC-06: Quiz Kitöltése:** Az AI által generált és a backend által validált kérdések megjelennek a React felületen (pl. egyenként vagy egy oldalon). A felhasználó kiválasztja a válaszokat.
* **UC-07: Quiz Kiértékelése:** A felhasználó beküldi a válaszait. A Flask backend kiértékeli azokat (összevetve a generáláskor kapott helyes válaszokkal), kiszámolja a pontszámot (pl. 3/5).
* **UC-08: Eredmény Mentése és Megtekintése:** A rendszer a kvízt (generált kérdések, válaszok) elmenti a `quizzes` és `questions` táblákba (K08), az elért eredményt (pontszám, dátum, user_id, quiz_id) pedig egy `results` táblába (K03). A felhasználó azonnali visszajelzést kap a pontszámáról.
* **UC-09: Korábbi Eredmények Megtekintése:** A felhasználó a profil oldalán listázhatja és megtekintheti korábbi kvízjeinek eredményeit (téma, dátum, pontszám).

### 7.3. Adminisztrációs Modul
* **UC-10: Admin Bejelentkezés:** Az "admin" jogosultsággal (pl. `is_admin` flag a `users` táblában) rendelkező felhasználó bejelentkezik.
* **UC-11: Témák Kezelése (CRUD):** Az admin felületen létrehozhat, módosíthat és törölhet előre definiált témaköröket (melyek megjelennek az UC-04-ben a legördülő listában). Ezek a `topics` táblában tárolódnak.
* **UC-12: Statisztikák Megtekintése:** Az admin dashboardon aggregált adatokat lát (pl. regisztrált felhasználók száma, lejátszott quizek száma, átlagpontszám témánként).

## 8. Képernyőtervek (Logikai felépítés)
A rendszer a következő főbb képernyőkből (React komponensek/oldalak) épül fel:

1.  **Bejelentkező Oldal (`/login`):**
    * Űrlap: E-mail / Felhasználónév, Jelszó.
    * Gomb: "Bejelentkezés".
    * Link: "Nincs még fiókod? Regisztrálj itt!"
2.  **Regisztrációs Oldal (`/register`):**
    * Űrlap: Felhasználónév, E-mail cím, Jelszó, Jelszó megerősítése.
    * Gomb: "Regisztráció".
    * Link: "Már van fiókod? Jelentkezz be!"
3.  **Főoldal / Dashboard (Bejelentkezve) (`/`):**
    * Navigációs sáv (Header): Profil link, Kijelentkezés gomb, (ha admin: "Admin" link).
    * Gomb: "Új Quiz Indítása".
    * Szekció: "Korábbi Eredményeim" (lista a legutóbbi 5-10 eredményről, linkelve az eredmény oldalra).
4.  **Új Quiz Konfigurációs Oldal (`/quiz/new`):**
    * Űrlap:
        * Témakör választó (lenyíló lista az admin által definiált `topics` táblából, pl. "Földrajz", "Irodalom").
        * Szöveges beviteli mező: "Vagy adj meg egyedi témát..." (ha ezt kitölti, a lenyíló lista inaktívvá válik).
        * Nehézségi szint (rádiógombok: Könnyű, Közepes, Nehéz).
        * Kérdésszám (opcionális, pl. csúszka: 5-10).
    * Gomb: "Quiz Generálása". (Kattintáskor töltőképernyő jelenik meg, amíg az AI dolgozik).
5.  **Quiz Lejátszási Oldal (`/quiz/{quiz_id}`):**
    * Quiz címe (Téma).
    * Haladásjelző (pl. "Kérdés 2/5").
    * Aktuális kérdés szövege.
    * Válaszlehetőségek (rádiógombok vagy checkboxok).
    * Navigációs gombok: "Következő kérdés" / "Quiz Beküldése" (az utolsó kérdésnél).
6.  **Eredmény Oldal (`/quiz/{quiz_id}/result`):**
    * Elért pontszám (pl. "Eredményed: 4/5").
    * Visszajelzés (pl. "Szép munka!").
    * (Opcionális: Részletes kiértékelés - kérdések, adott válasz, helyes válasz).
    * Gombok: "Új Quiz", "Vissza a Főoldalra".
7.  **Profil Oldal (`/profile`):**
    * Felhasználói adatok (név, e-mail).
    * (Opcionális: Jelszóváltoztatás űrlap).
    * Táblázat/Lista: "Korábbi Quizek" (Téma, Dátum, Pontszám, Link az Eredmény Oldalra).
8.  **Admin Dashboard (`/admin`):**
    * Védett útvonal, csak adminoknak.
    * Navigáció: "Témák Kezelése", "Statisztikák".
    * Dashboard modulok (pl. "Összes felhasználó: 150", "Lejátszott quizek: 430").
9.  **Admin Téma Kezelő (`/admin/topics`):**
    * Űrlap: "Új téma hozzáadása" (szöveges mező, Mentés gomb).
    * Táblázat: Meglévő témák (ID, Név, Műveletek [Szerkesztés, Törlés]).

## 9. Forgatókönyvek (Scenarios)

### 9.1. Forgatókönyv: Új felhasználó egyedi témájú kvízt tölt ki
1.  **Aktor:** Vendég Felhasználó (Péter)
2.  **Előfeltétel:** Péter a `/login` oldalon van.
3.  **Leírás:**
    1.  Péter a "Regisztrálj itt!" linkre kattint, átirányít a `/register` oldalra.
    2.  Kitölti az űrlapot (user: "Peti88", email: "peter@email.com", jelszo: "Jelszo123!").
    3.  A Flask backend validálja az adatokat, létrehozza a felhasználót az SQLite `users` táblában (jelszót hash-elve, `is_admin=False`), és visszaküld egy JWT tokent.
    4.  A React automatikusan bejelentkezteti és a Főoldalra (`/`) irányítja.
    5.  Péter a "Új Quiz Indítása" gombra kattint (`/quiz/new`).
    6.  Az "Egyedi téma" mezőbe beírja: "Forma 1 2000-es évek".
    7.  Kiválasztja a "Nehéz" nehézségi szintet.
    8.  A "Quiz Generálása" gombra kattint.
    9.  A React kérést küld a Flask `/api/quiz/generate` végpontjára (Téma: "Forma 1...", Nehézség: "Nehéz").
    10. A Flask backend hívja az OpenAI API-t a prompttal.
    11. Az AI visszaad 5 kérdést és választ JSON formátumban.
    12. A Flask elmenti a kérdéseket (`questions` tábla) és a kvíz definíciót (`quizzes` tábla, pl. ID: 101), majd visszaküldi a kérdéseket a frontendnek.
    13. A React átirányít a `/quiz/101` oldalra.
    14. Péter megválaszolja az 5 kérdést, majd az "Quiz Beküldése" gombra kattint.
    15. A React elküldi a válaszait a Flask `/api/quiz/101/submit` végpontjára.
    16. A Flask kiértékeli a válaszokat (pl. 3 helyes), és elmenti az eredményt a `results` táblába (user_id: Péter ID-ja, quiz_id: 101, score: 3).
    17. A React átirányít a `/quiz/101/result` oldalra.
    18. Péter látja az eredményt: "Eredményed: 3/5".

### 9.2. Forgatókönyv: Admin témát ad hozzá
1.  **Aktor:** Adminisztrátor (AdminBela)
2.  **Előfeltétel:** AdminBela be van jelentkezve és `is_admin=True` jogosultsággal rendelkezik.
3.  **Leírás:**
    1.  AdminBela a navigációs sávban az "Admin" linkre kattint (`/admin`).
    2.  Az Admin Dashboardon a "Témák Kezelése" menüpontra kattint (`/admin/topics`).
    3.  Látja a meglévő témák listáját (pl. "Történelem", "Földrajz").
    4.  Az "Új téma hozzáadása" űrlapba beírja: "Filmművészet".
    5.  A "Mentés" gombra kattint.
    6.  A React kérést (POST) küld a Flask `/api/admin/topics` végpontjára.
    7.  A Flask backend (ellenőrizve az admin jogosultságot a JWT token alapján) beszúrja az új témát az SQLite `topics` táblába.
    8.  A React felület frissíti a témák listáját, ahol már látszik az új "Filmművészet" téma.


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
