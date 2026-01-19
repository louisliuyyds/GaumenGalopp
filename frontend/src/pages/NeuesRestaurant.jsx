import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { restaurantService } from '../services';
import kochstilService from '../services/kochstilService';
import kochstilRestaurantService from '../services/kochstilRestaurantService';

const NeuesRestaurant= () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        klassifizierung: '',
        telefon: '',
        kuechenchef: '',
        adresseid: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [availableKochstile, setAvailableKochstile] = useState([]);
    const [selectedKochstile, setSelectedKochstile] = useState([]); // Array von IDs
    const [newKochstil, setNewKochstil] = useState(''); // Für neue Kategorie

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    useEffect(() => {
        const loadKochstile = async () => {
            try {
                const response = await kochstilService.getAll();
                setAvailableKochstile(response.data);
            } catch (error) {
                console.error('Fehler beim Laden der Kochstile:', error);
            }
        };
        loadKochstile();
    }, []);

    // Toggle bestehende Kategorie
    const toggleKochstil = (stilId) => {
        setSelectedKochstile(prev =>
            prev.includes(stilId)
                ? prev.filter(id => id !== stilId)
                : [...prev, stilId]
        );
    };

// Neue Kategorie hinzufügen
    const handleAddNewKochstil = async () => {
        if (!newKochstil.trim()) return;

        // Prüfe ob schon existiert
        const existing = availableKochstile.find(
            k => k.kochstil.toLowerCase() === newKochstil.toLowerCase()
        );

        if (existing) {
            // Existiert schon → einfach auswählen
            toggleKochstil(existing.stilid);
            setNewKochstil('');
            alert('Diese Kategorie existiert bereits und wurde ausgewählt!');
            return;
        }

        try {
            // Erstelle neue Kategorie
            const response = await kochstilService.create({
                kochstil: newKochstil.trim(),
                beschreibung: ''
            });

            // Füge zu Liste hinzu
            const newStil = response.data;
            setAvailableKochstile(prev => [...prev, newStil]);
            setSelectedKochstile(prev => [...prev, newStil.stilid]);
            setNewKochstil('');
            alert('Neue Kategorie erfolgreich erstellt!');
        } catch (error) {
            console.error('Fehler beim Erstellen:', error);
            alert('Fehler beim Erstellen der Kategorie');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validierung (BEHALTEN!)
        if (!formData.name || !formData.telefon) {
            setError('Name und Telefon sind Pflichtfelder');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // adresseid in Number umwandeln (BEHALTEN!)
            const dataToSubmit = {
                ...formData,
                adresseid: parseInt(formData.adresseid)
            };

            const response = await restaurantService.create(dataToSubmit);
            const newRestaurantId = response.data.restaurantid;

            console.log('Restaurant erstellt:', response.data);

            // NEU: Kochstile zuweisen
            for (const stilId of selectedKochstile) {
                await kochstilRestaurantService.assignKochstilToRestaurant({
                    restaurantid: newRestaurantId,
                    stilid: stilId
                });
            }

            alert('Restaurant erfolgreich erstellt!');

            // Zur Restaurant-Liste navigieren
            navigate('/restaurants');
        } catch (err) {
            setError(err.message);
            console.error('Fehler beim Erstellen:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setFormData({
            name: '',
            klassifizierung: '',
            telefon: '',
            kuechenchef: '',
            adresseid: '',
        });
        setError(null);
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
            <h1>Neues Restaurant erstellen</h1>

            {error && (
                <div style={{
                    backgroundColor: '#fee',
                    color: '#c00',
                    padding: '15px',
                    borderRadius: '4px',
                    marginBottom: '20px'
                }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Name *
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '16px'
                        }}
                        placeholder="Restaurant Name"
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Klassifizierung
                    </label>
                    <input
                        type="text"
                        name="klassifizierung"
                        value={formData.klassifizierung}
                        onChange={handleChange}
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '16px'
                        }}
                        placeholder="z.B. Italienisch, Sterne-Restaurant"
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Telefon *
                    </label>
                    <input
                        type="tel"
                        name="telefon"
                        value={formData.telefon}
                        onChange={handleChange}
                        required
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '16px'
                        }}
                        placeholder="+49 123 456789"
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Küchenchef
                    </label>
                    <input
                        type="text"
                        name="kuechenchef"
                        value={formData.kuechenchef}
                        onChange={handleChange}
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '16px'
                        }}
                        placeholder="Name des Küchenchefs"
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Adresse ID
                    </label>
                    <input
                        type="number"
                        name="adresseid"
                        value={formData.adresseid}
                        onChange={handleChange}
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '16px'
                        }}
                        placeholder="ID der Adresse"
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        🍽️ Kategorien
                    </label>

                    {/* Bestehende Kategorien */}
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '10px',
                        marginBottom: '15px',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        backgroundColor: '#f9f9f9'
                    }}>
                        {availableKochstile.length > 0 ? (
                            availableKochstile.map(k => (
                                <button
                                    key={k.stilid}
                                    type="button"
                                    onClick={() => toggleKochstil(k.stilid)}
                                    style={{
                                        padding: '8px 16px',
                                        borderRadius: '20px',
                                        border: '2px solid',
                                        borderColor: selectedKochstile.includes(k.stilid) ? '#3498db' : '#ddd',
                                        backgroundColor: selectedKochstile.includes(k.stilid) ? '#3498db' : 'white',
                                        color: selectedKochstile.includes(k.stilid) ? 'white' : '#333',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: selectedKochstile.includes(k.stilid) ? 'bold' : 'normal',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {k.kochstil}
                                </button>
                            ))
                        ) : (
                            <span style={{ color: '#666' }}>Lade Kategorien...</span>
                        )}
                    </div>

                    {/* Neue Kategorie hinzufügen */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                            type="text"
                            value={newKochstil}
                            onChange={(e) => setNewKochstil(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddNewKochstil())}
                            placeholder="Neue Kategorie hinzufügen..."
                            style={{
                                flex: 1,
                                padding: '10px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '16px'
                            }}
                        />
                        <button
                            type="button"
                            onClick={handleAddNewKochstil}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#2ecc71',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                fontWeight: 'bold'
                            }}
                        >
                            + Hinzufügen
                        </button>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            flex: 1,
                            backgroundColor: loading ? '#95a5a6' : '#27ae60',
                            color: 'white',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '4px',
                            fontSize: '16px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        {loading ? 'Wird erstellt...' : 'Restaurant erstellen'}
                    </button>

                    <button
                        type="button"
                        onClick={handleReset}
                        disabled={loading}
                        style={{
                            flex: 1,
                            backgroundColor: '#95a5a6',
                            color: 'white',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '4px',
                            fontSize: '16px',
                            cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        Zurücksetzen
                    </button>
                </div>
            </form>

            <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
                * Pflichtfelder
            </p>
        </div>
    );
}

export default NeuesRestaurant;