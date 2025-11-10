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

## 4. Igényelt üzleti folyamatok

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
