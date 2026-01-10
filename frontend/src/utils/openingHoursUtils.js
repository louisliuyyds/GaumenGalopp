/**
 * Generiert einen lesbaren Namen für eine Öffnungszeit-Vorlage
 * basierend auf dem Muster der Öffnungszeiten
 * @param {Array} openingHours - Öffnungszeiten-Array
 * @returns {string} - Generierter Name
 */
export const generateTemplateName = (openingHours) => {
    // Zähle geschlossene Tage
    const closedDays = openingHours.filter(day => day.ist_geschlossen).length;

    if (closedDays === 7) {
        return 'Dauerhaft geschlossen';
    }

    if (closedDays === 0) {
        // Alle Tage offen - prüfe ob immer gleiche Zeiten
        const firstOpenDay = openingHours[0];
        const allSameTimes = openingHours.every(day =>
            day.oeffnungszeit === firstOpenDay.oeffnungszeit &&
            day.schliessungszeit === firstOpenDay.schliessungszeit
        );

        if (allSameTimes) {
            return `Täglich ${firstOpenDay.oeffnungszeit} - ${firstOpenDay.schliessungszeit} Uhr`;
        }
    }

    // Prüfe typische Muster
    const weekdaysClosed = openingHours.slice(0, 5).filter(day => day.ist_geschlossen).length;
    const weekendClosed = openingHours.slice(5, 7).filter(day => day.ist_geschlossen).length;

    if (weekdaysClosed === 0 && weekendClosed === 2) {
        return 'Montag - Freitag';
    }

    if (weekdaysClosed === 0 && weekendClosed === 0) {
        return 'Montag - Sonntag';
    }

    // Fallback: Zähle offene Tage
    const openDays = 7 - closedDays;
    return `${openDays} Tage/Woche geöffnet`;
};

/**
 * Validiert Öffnungszeiten
 * @param {Array} openingHours - Zu validierende Öffnungszeiten
 * @returns {Object} - { isValid: boolean, errors: Array }
 */
export const validateOpeningHours = (openingHours) => {
    const errors = [];

    openingHours.forEach((day) => {
        if (day.ist_geschlossen) {
            return; // Geschlossene Tage sind immer valid
        }

        // Prüfe ob Zeiten vorhanden sind
        if (!day.oeffnungszeit || !day.schliessungszeit) {
            errors.push(`${day.tagName}: Öffnungs- und Schließzeiten müssen angegeben sein`);
            return;
        }

        // Prüfe ob Schließzeit nach Öffnungszeit liegt
        if (day.oeffnungszeit >= day.schliessungszeit) {
            errors.push(`${day.tagName}: Schließzeit muss nach der Öffnungszeit liegen`);
        }
    });

    return {
        isValid: errors.length === 0,
        errors
    };
};

/**
 * Formatiert Öffnungszeiten für die Anzeige
 * @param {Array} openingHours - Öffnungszeiten
 * @returns {string} - Formatierter Text
 */
export const formatOpeningHoursDisplay = (openingHours) => {
    if (!openingHours || openingHours.length === 0) {
        return 'Keine Öffnungszeiten hinterlegt';
    }

    const sortedHours = [...openingHours].sort((a, b) => a.wochentag - b.wochentag);

    return sortedHours
        .map(day => {
            if (day.ist_geschlossen) {
                return `${day.tagName}: Geschlossen`;
            }
            return `${day.tagName}: ${day.oeffnungszeit} - ${day.schliessungszeit} Uhr`;
        })
        .join('\n');
};

export const generateOpeningHoursHash = (openingHours) => {
    const hashData = openingHours
        .sort((a, b) => a.wochentag - b.wochentag)
        .map(day => {
            if (day.ist_geschlossen) {
                return `${day.wochentag}:CLOSED`;
            }
            // Entferne Sekunden falls vorhanden
            const oeffnung = day.oeffnungszeit?.substring(0, 5) || '';
            const schliessung = day.schliessungszeit?.substring(0, 5) || '';
            return `${day.wochentag}:${oeffnung}-${schliessung}`;
        })
        .join('|');

    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(hashData))
        .then(buf => Array.from(new Uint8Array(buf))
            .map(b => b.toString(16).padStart(2, '0'))
            .join(''));
};