// Zentrale Farbdefinitionen für das gesamte Projekt
// Farbschema: Luxuriös mit Gold & Beige
const colors = {
    // Haupt-Farbschema
    primary: {
        dark: '#1a1410',      // Tiefes Schokoladenbraun
        medium: '#2d2419',    // Warmes dunkles Braun
        light: '#f5f0e8',     // Cremiges Beige
    },
    // Akzent-Farben
    accent: {
        orange: '#d4af37',    // Klassisches Gold
        lightOrange: '#e8c568', // Helles Gold
        gold: '#f4d03f',      // Leuchtendes Gold für Highlights
    },
    // Basis-Farben
    background: {
        main: '#faf8f3',      // Warmes Off-White
        card: '#ffffff',      // Card-Hintergrund
        light: '#f5efe6',     // Sanftes Beige
        gradient: 'linear-gradient(135deg, #faf8f3 0%, #f5efe6 100%)',
    },
    // Text-Farben
    text: {
        primary: '#331603ff',   // Haupt-Text (dunkelbraun)
        secondary: '#3d3328', // Sekundär-Text (mittelbraun)
        light: '#6b5d4f',     // Heller Text
        lighter: '#8f7f6f',   // Noch heller
        white: '#ffffff',     // Weiß
        muted: '#b3a593',     // Gedämpft
    },
    // Status-Farben
    status: {
        success: '#7a9d54',   // Gedämpftes Olivgrün
        successHover: '#6b8a48',
        error: '#a04747',     // Warmes Rot
        errorHover: '#8f3d3d',
        warning: '#d4863c',   // Warmes Orange
        info: '#6b7fa3',      // Gedämpftes Blau
    },
    // Border & Shadow
    border: {
        light: '#e8dfd0',
        medium: '#d4c4ad',
        dark: '#b8a68d',
    },
    // Gradients
    gradients: {
        primary: 'linear-gradient(135deg, #dbc681ff 0%, #866948ff 100%)',
        accent: 'linear-gradient(135deg, #f4e1a2ff 0%, #f4d03f 100%)',
        card: 'linear-gradient(135deg, #ffffff 0%, #faf8f3 100%)',
        luxury: 'linear-gradient(135deg, #f5efe6 0%, #e8dfd0 50%, #d4af37 100%)',
    },
    // Transparente Overlays
    overlay: {
        light: 'rgba(255, 255, 255, 0.15)',
        medium: 'rgba(255, 255, 255, 0.25)',
        dark: 'rgba(26, 20, 16, 0.1)',
        gold: 'rgba(212, 175, 55, 0.1)',
    },
    // Schatten
    shadows: {
        small: '0 2px 8px rgba(26, 20, 16, 0.12)',
        medium: '0 4px 15px rgba(26, 20, 16, 0.1)',
        large: '0 8px 25px rgba(26, 20, 16, 0.15)',
        accent: '0 4px 12px rgba(212, 175, 55, 0.35)',
        accentHover: '0 6px 18px rgba(212, 175, 55, 0.45)',
        primarySmall: '0 4px 10px rgba(26, 20, 16, 0.2)',
        primaryMedium: '0 6px 15px rgba(26, 20, 16, 0.25)',
        gold: '0 4px 20px rgba(212, 175, 55, 0.3)',
    }
};

export default colors;