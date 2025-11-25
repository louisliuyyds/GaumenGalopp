// Zentrale Farbdefinitionen für das gesamte Projekt
// Farbschema: Midnight Blue & Neon Cyan

const colors = {
    // Haupt-Farbschema
    primary: {
        dark: '#0d1b2a',      // Midnight Blue (fast schwarz)
        medium: '#1b263b',    // Dunkles Navy
        light: '#e0f4ff',     // Eisblaues Hell
    },

    // Akzent-Farben
    accent: {
        orange: '#00d9ff',    // Neon Cyan
        lightOrange: '#5ce1e6', // Helles Cyan
        gold: '#ffbe0b',      // Leuchtendes Gelb für Ratings
    },

    // Basis-Farben
    background: {
        main: '#f0f4f8',      // Sehr heller Blaugrau
        card: '#ffffff',      // Card-Hintergrund
        light: '#e8f0f7',     // Heller Eisblau-Hintergrund
        gradient: 'linear-gradient(135deg, #f0f4f8 0%, #ffffff 100%)',
    },

    // Text-Farben
    text: {
        primary: '#0d1b2a',   // Haupt-Text (midnight)
        secondary: '#1b263b', // Sekundär-Text (navy)
        light: '#415a77',     // Heller Text
        lighter: '#778da9',   // Noch heller
        white: '#ffffff',     // Weiß
        muted: '#a8b8cc',     // Gedämpft
    },

    // Status-Farben
    status: {
        success: '#06ffa5',   // Neon Grün
        successHover: '#05e696',
        error: '#ff006e',     // Neon Pink/Rot
        errorHover: '#e6006a',
        warning: '#fb5607',   // Leuchtorange
        info: '#3a86ff',      // Elektrisch Blau
    },

    // Border & Shadow
    border: {
        light: '#d8e2ef',
        medium: '#b1c5d9',
        dark: '#8fa8c4',
    },

    // Gradients
    gradients: {
        primary: 'linear-gradient(135deg, #0d1b2a 0%, #1b263b 100%)',
        accent: 'linear-gradient(135deg, #00d9ff 0%, #5ce1e6 100%)',
        card: 'linear-gradient(135deg, #f0f4f8 0%, #ffffff 100%)',
    },

    // Transparente Overlays
    overlay: {
        light: 'rgba(255, 255, 255, 0.12)',
        medium: 'rgba(255, 255, 255, 0.2)',
        dark: 'rgba(13, 27, 42, 0.1)',
    },

    // Schatten
    shadows: {
        small: '0 2px 8px rgba(13, 27, 42, 0.12)',
        medium: '0 4px 15px rgba(13, 27, 42, 0.1)',
        large: '0 8px 25px rgba(13, 27, 42, 0.18)',
        accent: '0 4px 10px rgba(0, 217, 255, 0.3)',
        accentHover: '0 6px 15px rgba(0, 217, 255, 0.4)',
        primarySmall: '0 4px 10px rgba(13, 27, 42, 0.2)',
        primaryMedium: '0 6px 15px rgba(13, 27, 42, 0.3)',
    }
};

export default colors;