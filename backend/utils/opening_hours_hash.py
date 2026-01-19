import hashlib
import json

def generate_opening_hours_hash(details_list):
    """Generiert Hash-Signatur aus Öffnungszeit-Details"""
    sorted_details = sorted(details_list, key=lambda x: x['wochentag'])

    hash_data = []
    for detail in sorted_details:
        day_str = f"{detail['wochentag']}:"
        if detail.get('ist_geschlossen'):
            day_str += "CLOSED"
        else:
            # Zeiten können String oder time-Objekt sein
            oeffnung = detail.get('oeffnungszeit')
            schliessung = detail.get('schliessungszeit')

            # Konvertiere zu String falls nötig
            if hasattr(oeffnung, 'strftime'):
                oeffnung = oeffnung.strftime('%H:%M')
            elif isinstance(oeffnung, str):
                oeffnung = oeffnung[:5]  # Nur HH:MM
            else:
                oeffnung = ''

            if hasattr(schliessung, 'strftime'):
                schliessung = schliessung.strftime('%H:%M')
            elif isinstance(schliessung, str):
                schliessung = schliessung[:5]
            else:
                schliessung = ''

            day_str += f"{oeffnung}-{schliessung}"
        hash_data.append(day_str)

    hash_string = "|".join(hash_data)
    return hashlib.sha256(hash_string.encode()).hexdigest()