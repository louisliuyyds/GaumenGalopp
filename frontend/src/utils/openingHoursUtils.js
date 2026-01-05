// utils/openingHoursUtils.js
// Utility-Funktionen für Öffnungszeiten-Verwaltung

/**
 * Vergleicht zwei Öffnungszeit-Arrays und prüft, ob sie identisch sind
 * @param {Array} hours1 - Erstes Öffnungszeiten-Array
 * @param {Array} hours2 - Zweites Öffnungszeiten-Array
 * @returns {boolean} - true wenn identisch, sonst false
 */
export const areOpeningHoursEqual = (hours1, hours2) => {
    if (!hours1 || !hours2 || hours1.length !== hours2.length) {
        return false;
    }

    // Sortiere beide Arrays nach Wochentag
    const sorted1 = [...hours1].sort((a, b) => a.wochentag - b.wochentag);
    const sorted2 = [...hours2].sort((a, b) => a.wochentag - b.wochentag);

    // Vergleiche jeden Tag
    return sorted1.every((day1, index) => {
        const day2 = sorted2[index];

        // Wenn beide geschlossen sind, sind sie gleich
        if (day1.ist_geschlossen && day2.ist_geschlossen) {
            return true;
        }

        // Wenn nur einer geschlossen ist, sind sie unterschiedlich
        if (day1.ist_geschlossen !== day2.ist_geschlossen) {
            return false;
        }

        // Vergleiche die Zeiten
        return (
            day1.wochentag === day2.wochentag &&
            day1.oeffnungszeit === day2.oeffnungszeit &&
            day1.schliessungszeit === day2.schliessungszeit
        );
    });
};

/**
 * Sucht in vorhandenen Vorlagen nach einer identischen Vorlage
 * @param {Array} openingHours - Zu vergleichende Öffnungszeiten
 * @param {Array} existingTemplates - Array von existierenden Vorlagen
 * @returns {Object|null} - Gefundene Vorlage oder null
 */
export const findMatchingTemplate = async (openingHours, existingTemplates, vorlageService) => {
    for (const template of existingTemplates) {
        try {
            // Lade die Details der Vorlage
            const vorlage = await vorlageService.getById(template.oeffnungszeitid);

            if (!vorlage || !vorlage.details) continue;

            // Formatiere die Vorlage-Details
            const templateHours = vorlage.details.map(detail => ({
                wochentag: detail.wochentag,
                ist_geschlossen: detail.ist_geschlossen,
                oeffnungszeit: detail.oeffnungszeit || '',
                schliessungszeit: detail.schliessungszeit || '',
            }));

            // Vergleiche
            if (areOpeningHoursEqual(openingHours, templateHours)) {
                return vorlage;
            }
        } catch (err) {
            console.error('Fehler beim Vergleichen der Vorlage:', err);
        }
    }

    return null;
};

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