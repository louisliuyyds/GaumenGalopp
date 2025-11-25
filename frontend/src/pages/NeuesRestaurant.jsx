import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { restaurantService } from '../services';

const NeuesRestaurant= () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        klassifizierung: '',
        telefon: '',
        kuechenchef: '',
        adresseID: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validierung
        if (!formData.name || !formData.telefon) {
            setError('Name und Telefon sind Pflichtfelder');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // AdresseID in Number umwandeln
            const dataToSubmit = {
                ...formData,
                adresseID: parseInt(formData.adresseID)
            };

            const neuesRestaurant = await restaurantService.create(dataToSubmit);

            console.log('Restaurant erstellt:', neuesRestaurant);
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
            adresseID: '',
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
                        name="adresseID"
                        value={formData.adresseID}
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
