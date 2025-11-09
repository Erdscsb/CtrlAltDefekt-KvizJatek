# Rendszerterv

# 1. A rendszer célja

# 2. Projektterv

# 3. Üzleti folyamatok modellje

# 4. Követelmények
---------------------


A rendszernek az alábbi főbb követelményeknek kell megfelelnie:


### **Funkcionális követelmények:**


*   **K01:** Felhasználói regisztráció és bejelentkezés (e-mail/jelszó).
    
*   **K02:** AI-alapú, dinamikus kvízgenerálás téma és nehézség alapján (OpenAI API).
    
*   **K03:** A kvíz eredmények (pontszám) mentése a felhasználó profiljához és visszajelzés adása.
    
*   **K08:** A generált kvízek és kérdések mentése az adatbázisba (újrajátszhatóság, ellenőrzés).
    
*   **K04:** Adminisztrációs felület az előre definiált témakörök kezelésére (CRUD) és statisztikák megtekintésére.
    


### **Nem funkcionális követelmények:**


*   **K05:** Reszponzív, mobilbarát felhasználói felület (React komponensekkel).
    
*   **K07:** A rendszer (Flask/SQLite stack) legyen könnyen telepíthető és üzemeltethető.
    
*   Az OpenAI API hívásokra adott várakozási idő alatt a felhasználó megfelelő visszajelzést kapjon (pl. "Töltés...").
    


### **Törvényi előírások, szabványok:**


*   **K06:** Felhasználói adatok (e-mail, jelszó-hash) kezelése a GDPR szabályainak megfelelően.

# 5. Funkcionális terv

# 6. Fizikai környezet

# 7. Absztrakt domain modell

# 8. Architekturális terv

# 9. Adatbázis terv

# 10. Implementációs terv

# 11. Tesztterv

# 12. Telepítési terv

# 13. Karbantartási terv
