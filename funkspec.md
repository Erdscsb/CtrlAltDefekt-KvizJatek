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
