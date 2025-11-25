import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import colors from '../theme/colors';

const PageContainer = styled.div`
    max-width: 900px;
`;

const Title = styled.h1`
    color: ${colors.text.primary};
    font-size: 2em;
    margin-bottom: 20px;
    margin-top: 0;
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    background: ${colors.background.card};
    color: ${colors.text.primary};
    box-shadow: ${colors.shadows.small};
    border-radius: 8px;
    overflow: hidden;
`;

const Th = styled.th`
    text-align: left;
    padding: 12px 16px;
    border-bottom: 1px solid ${colors.border.light};
    color: ${colors.text.secondary};
    font-weight: 600;
    background: ${colors.background.light};
`;

const Td = styled.td`
    padding: 12px 16px;
    border-bottom: 1px solid ${colors.border.light};
`;

const Message = styled.div`
    color: ${colors.text.primary};
    padding: 12px 0;
`;

const Controls = styled.div`
    display: flex;
    gap: 10px;
    margin-bottom: 12px;
    justify-content: flex-end;
`;

const EditButton = styled.button`
    background: ${colors.gradients.accent};
    color: ${colors.text.white};
    border: none;
    padding: 8px 14px;
    border-radius: 8px;
    cursor: pointer;
`;

const SaveButton = styled.button`
    background: ${colors.status.success};
    color: ${colors.text.white};
    border: none;
    padding: 8px 14px;
    border-radius: 8px;
    cursor: pointer;
`;

const CancelButton = styled.button`
    background: transparent;
    color: ${colors.text.primary};
    border: 1px solid ${colors.border.light};
    padding: 8px 14px;
    border-radius: 8px;
    cursor: pointer;
`;

function KundeProfil() {
    const [kunden, setKunden] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(null);
    const [saving, setSaving] = useState(false);
    const [savedMessage, setSavedMessage] = useState(null);

    useEffect(() => {
        // Try fetching profile data from backend. Adjust endpoint as needed.
        fetch('/api/kunde/profile')
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then((data) => {
                setKunden(data);
                setLoading(false);
            })
            .catch((err) => {
                // If API not available, keep graceful fallback (show placeholders)
                setError(err.message);
                setLoading(false);
            });
    }, []);

    // initialize form when kunden loaded or fallback
    useEffect(() => {
        const src = kunden || placeholder;
        setFormData({
            kundenID: src.kundenID,
            vorname: src.vorname,
            nachname: src.nachname,
            geburtsdatum: src.geburtsdatum,
            telefonnummer: src.telefonnummer,
            email: src.email,
            namenskuerzel: src.namenskuerzel,
            adresse: src.adresse,
        });
    }, [kunden]);

    const placeholder = {
        kundenID: 1,
        vorname: 'Max',
        nachname: 'Mustermann',
        geburtsdatum: '1990-01-01',
        telefonnummer: '+49 123 456789',
        email: 'max@example.com',
        namenskuerzel: 'MM',
        adresse: 'Musterstr. 1, 12345 Stadt'
    };

    const person = kunden || placeholder;

    const handleEdit = () => {
        setSavedMessage(null);
        setIsEditing(true);
    };

    const handleCancel = () => {
        // reset formData to original
        const src = kunden || placeholder;
        setFormData({
            kundenID: src.kundenID,
            vorname: src.vorname,
            nachname: src.nachname,
            geburtsdatum: src.geburtsdatum,
            telefonnummer: src.telefonnummer,
            email: src.email,
            namenskuerzel: src.namenskuerzel,
            adresse: src.adresse,
        });
        setIsEditing(false);
    };

    const handleSave = async () => {
        setSaving(true);
        setSavedMessage(null);
        try {
            const res = await fetch('/api/kunde/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const updated = await res.json();
            setKunden(updated);
            setIsEditing(false);
            setSavedMessage('Profil gespeichert');
        } catch (e) {
            setError(e.message);
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    return (
        <PageContainer>
            <Title>Mein Profil</Title>

            <Controls>
                {!isEditing && <EditButton onClick={handleEdit}>Bearbeiten</EditButton>}
                {isEditing && <SaveButton onClick={handleSave} disabled={saving}>{saving ? 'Speichern...' : 'Speichern'}</SaveButton>}
                {isEditing && <CancelButton onClick={handleCancel}>Abbrechen</CancelButton>}
            </Controls>

            {loading && <Message>Loading profile…</Message>}
            {error && <Message>Could not load profile from server ({error}). Showing demo data.</Message>}

            <Table>
                <thead>
                    <tr>
                        <Th>Feld</Th>
                        <Th>Wert</Th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <Td>Kunden ID</Td>
                        <Td>{formData?.kundenID}</Td>
                    </tr>
                    <tr>
                        <Td>Vorname</Td>
                        <Td>{isEditing ? <input value={formData?.vorname || ''} onChange={(e) => handleChange('vorname', e.target.value)} /> : formData?.vorname}</Td>
                    </tr>
                    <tr>
                        <Td>Nachname</Td>
                        <Td>{isEditing ? <input value={formData?.nachname || ''} onChange={(e) => handleChange('nachname', e.target.value)} /> : formData?.nachname}</Td>
                    </tr>
                    <tr>
                        <Td>Geburtsdatum</Td>
                        <Td>{isEditing ? <input type="date" value={formData?.geburtsdatum || ''} onChange={(e) => handleChange('geburtsdatum', e.target.value)} /> : formData?.geburtsdatum}</Td>
                    </tr>
                    <tr>
                        <Td>Telefon</Td>
                        <Td>{isEditing ? <input value={formData?.telefonnummer || ''} onChange={(e) => handleChange('telefonnummer', e.target.value)} /> : formData?.telefonnummer}</Td>
                    </tr>
                    <tr>
                        <Td>Email</Td>
                        <Td>{isEditing ? <input value={formData?.email || ''} onChange={(e) => handleChange('email', e.target.value)} /> : formData?.email}</Td>
                    </tr>
                    <tr>
                        <Td>Namenskürzel</Td>
                        <Td>{isEditing ? <input value={formData?.namenskuerzel || ''} onChange={(e) => handleChange('namenskuerzel', e.target.value)} /> : formData?.namenskuerzel}</Td>
                    </tr>
                    <tr>
                        <Td>Adresse</Td>
                        <Td>{isEditing ? <textarea value={formData?.adresse || ''} onChange={(e) => handleChange('adresse', e.target.value)} rows={3} /> : formData?.adresse}</Td>
                    </tr>
                </tbody>
            </Table>
            {savedMessage && <Message style={{ marginTop: 12 }}>{savedMessage}</Message>}
        </PageContainer>
    );
}

export default KundeProfil;
