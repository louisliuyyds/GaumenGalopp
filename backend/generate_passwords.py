"""
Script zum Generieren von Passwort-Hashes für bestehende Restaurants und Kunden
Verwendet bcrypt wie im Backend
"""

import bcrypt

def hash_password(password: str) -> str:
    """Hasht Passwort mit bcrypt"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def generate_password_updates():
    """Generiert SQL UPDATE statements mit gehashten Passwörtern"""

    print("-- SQL UPDATE Statements für Restaurant-Passwörter")
    print("-- Passwort-Schema: 'restaurant{N}' (z.B. restaurant5)\n")

    # Restaurants: restaurant1@example.com -> Passwort: restaurant1
    for i in range(1, 61):  # Anpassen je nach Anzahl
        email = f"restaurant{i}@example.com"
        password = f"restaurant{i}"
        hashed = hash_password(password)

        print(f"UPDATE restaurant SET passwordhash = '{hashed}' WHERE email = '{email}';")

    print("\n\n-- SQL UPDATE Statements für Kunden-Passwörter")
    print("-- Passwort-Schema: 'kunde{N}' (z.B. kunde1)\n")

    # Kunden: kunde1@example.com -> Passwort: kunde1
    for i in range(1, 102):  # Anpassen je nach Anzahl
        email = f"kunde{i}@example.com"
        password = f"kunde{i}"
        hashed = hash_password(password)

        print(f"UPDATE kunde SET passwordhash = '{hashed}' WHERE email = '{email}';")

if __name__ == "__main__":
    generate_password_updates()