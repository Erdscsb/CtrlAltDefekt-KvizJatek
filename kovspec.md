# Követelményspecifikáció -- Kvízjáték

## 1. Jelenlegi helyzet
Jelenleg a piacon egyre jobban elterjednek a AI megoldások, de felhasználók számára elérhető quiz appok általában statikus kérdésadatbázist használnak, és nem kínálnak személyre szabott, dinamikusan generált tartalmat.  

A felhasználók regisztráció és bejelentkezés nélkül csak korlátozott módon tudják használni a rendszert. Az adminisztráció és a kérdésbank kezelése manuálisan történik, ami időigényes és rugalmatlan.

## 2. Vágyálom rendszer
A cél egy modern webalkalmazás létrehozása, amely:

- Felhasználói regisztrációt és bejelentkezést biztosít.
- AI-generált quiz kérdéseket és válaszokat jelenít meg.
- Dinamikusan generál új quizeket, különböző témákban és nehézségi szinten.
- A felhasználók pontszámait és teljesítményét nyomon követi.
- Adminisztrációs felületet kínál a rendszer paramétereinek és témáinak kezelésére.
- Reszponzív, mobilon és tableten is jól használható.

## 3. Jelenlegi üzleti folyamatok
### 3.1. Regisztráció és bejelentkezés
- Felhasználó regisztrál a weboldalon e-mail cím és jelszó megadásával.
- Bejelentkezés után a felhasználó hozzáfér az quizekhez.

### 3.2. Quiz játék
- Felhasználó kiválaszt egy témát és nehézségi szintet.
- A rendszer AI segítségével generál 5-10 kérdést és válaszlehetőséget.
- Felhasználó válaszol a kérdésekre, majd a rendszer kiértékeli a teljesítményt.
- Eredmények mentése a felhasználó profiljába.
- A generált kvíz mentésre kerül, és újra kitölthető.

### 3.3. Adminisztráció
- Adminisztrátor témaköröket hoz létre vagy módosít, de a felhasználó is megadhat egyedi témákat.
- Admin felületen ellenőrizhető az AI-generált kérdések és válaszok minősége.
- Statisztikák megtekintése a felhasználók aktivitásáról és teljesítményéről.


## 4. Igényelt üzleti folyamatok
### 4.1. Online megjelenés
1. **Felhasználói regisztráció:** új felhasználó adatai megadása → regisztráció
2. **Bejelentkezés:** felhasználónév/jelszó megadása → belépés a rendszerbe.
3. **Quiz generálás:** téma és nehézség kiválasztása → AI generálja a kérdéseket és válaszokat.
4. **Quiz kitöltése:** felhasználó válaszol → rendszer kiértékeli → pontszám mentése.
5. **Eredmények megtekintése:** felhasználó profilján belül a korábbi quizek és pontszámok megtekintése.
6. **Admin felület:** témák kezelése, kérdések minőségének ellenőrzése, statisztikák megtekintése.

## 5. A rendszerre vonatkozó szabályok
- A webfelület szabványos eszközökkel készüljön (HTML/CSS/JavaScript).
- Az AI integráció az OpenAI API segítségével történik.
- Képek (ha vannak) JPEG vagy PNG formátumban.
- Felhasználói adatok kezelése a GDPR szabályainak megfelelően történik.
- A rendszer reszponzív legyen.

## 6. Követelménylista
| Kód  | Követelmény |
|------|-------------|
| K01  | Felhasználói regisztráció és bejelentkezés |
| K02  | AI-generált quiz kérdések és válaszok |
| K03  | Quiz eredmények mentése és visszajelzés |
| K04  | Admin felület a témák kezelésére és statisztikákra |
| K05  | Reszponzív és mobilbarát felület |
| K06  | GDPR és adatvédelmi szabályok betartása |
| K07  | Könnyen üzemeltethető rendszer |
| K08  | Quiz kérdések mentése |

## 7. Fogalomszótár
- **AI generálás:** Kérdések és válaszok automatikus előállítása mesterséges intelligencia segítségével.
- **Quiz:** Kérdésekből álló játék vagy teszt, amely pontszám alapján értékeli a felhasználót.
- **Admin:** Olyan felhasználói szerepkör, aki a rendszer működését és tartalmát kezelheti.
- **GDPR:** Általános adatvédelmi rendelet, amely a felhasználói adatok védelmét szabályozza.
