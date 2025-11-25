import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import colors from '../theme/colors';

const Container = styled.div`
    max-width: 800px;
    margin: 0 auto;
`;

const BackButton = styled.button`
    background: ${colors.gradients.primary};
    color: ${colors.text.white};
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    cursor: pointer;
    margin-bottom: 30px;
    font-size: 1em;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: ${colors.shadows.primarySmall};

    &:hover {
        transform: translateY(-2px);
        box-shadow: ${colors.shadows.primaryMedium};
    }
`;

const FormCard = styled.div`
    background: ${colors.background.card};
    border-radius: 16px;
    padding: 40px;
    box-shadow: ${colors.shadows.medium};
`;

const PageTitle = styled.h1`
    color: ${colors.text.primary};
    font-size: 2.3em;
    margin-bottom: 30px;
    font-weight: 700;
    text-align: center;
`;

const FormSection = styled.div`
    margin-bottom: 35px;
`;

const SectionTitle = styled.h2`
    color: ${colors.text.primary};
    font-size: 1.5em;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 2px solid ${colors.accent.orange};
    font-weight: 600;
`;

const FormGroup = styled.div`
    margin-bottom: 20px;
`;

const Label = styled.label`
    display: block;
    color: ${colors.text.primary};
    font-weight: 600;
    margin-bottom: 8px;
    font-size: 1em;
`;

const RequiredStar = styled.span`
    color: ${colors.status.error};
    margin-left: 4px;
`;

const Input = styled.input`
    width: 100%;
    padding: 14px 18px;
    border: 2px solid ${colors.border.light};
    border-radius: 8px;
    font-size: 1em;
    transition: all 0.3s ease;
    background: ${colors.background.light};
    color: ${colors.text.primary};
    box-sizing: border-box;

    &:focus {
        outline: none;
        border-color: ${colors.accent.orange};
        box-shadow: 0 0 0 3px ${colors.overlay.gold};
    }

    &::placeholder {
        color: ${colors.text.muted};
    }
`;

const Select = styled.select`
    width: 100%;
    padding: 14px 18px;
    border: 2px solid ${colors.border.light};
    border-radius: 8px;
    font-size: 1em;
    transition: all 0.3s ease;
    background: ${colors.background.light};
    color: ${colors.text.primary};
    cursor: pointer;
    box-sizing: border-box;

    &:focus {
        outline: none;
        border-color: ${colors.accent.orange};
        box-shadow: 0 0 0 3px ${colors.overlay.gold};
    }
`;

const FormRow = styled.div`
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 15px;
    margin-bottom: 20px;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

const FormRowEqual = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin-bottom: 20px;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 15px;
    justify-content: center;
    margin-top: 35px;
    padding-top: 25px;
    border-top: 2px solid ${colors.border.light};
`;

const SubmitButton = styled.button`
    background: ${colors.gradients.accent};
    color: ${colors.text.white};
    border: none;
    padding: 14px 32px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1.1em;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: ${colors.shadows.accent};

    &:hover {
        transform: translateY(-2px);
        box-shadow: ${colors.shadows.accentHover};
    }

    &:disabled {
        background: ${colors.text.muted};
        cursor: not-allowed;
        transform: none;
    }
`;

const CancelButton = styled.button`
    background: transparent;
    color: ${colors.text.primary};
    border: 2px solid ${colors.border.medium};
    padding: 14px 32px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1.1em;
    font-weight: 600;
    transition: all 0.3s ease;

    &:hover {
        background: ${colors.background.light};
        border-color: ${colors.accent.orange};
    }
`;

const ErrorText = styled.span`
    display: block;
    color: ${colors.status.error};
    font-size: 0.85em;
    margin-top: 6px;
    font-weight: 500;
`;

function NeuesRestaurant() {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        // Restaurant-Daten
        name: '',
        klassifizierung: '',
        telefon: '',
        kuechenchef: '',
        
        // Adress-Daten
        strasse: '',
        hausnummer: '',
        ort: '',
        postleitzahl: '',
        land: 'Deutschland',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        // Restaurant-Validierung
        if (!formData.name.trim()) newErrors.name = 'Name ist erforderlich';
        if (!formData.klassifizierung.trim()) newErrors.klassifizierung = 'Klassifizierung ist erforderlich';
        if (!formData.telefon.trim()) newErrors.telefon = 'Telefon ist erforderlich';
        
        // Adress-Validierung
        if (!formData.strasse.trim()) newErrors.strasse = 'Straße ist erforderlich';
        if (!formData.hausnummer.trim()) newErrors.hausnummer = 'Hausnummer ist erforderlich';
        if (!formData.ort.trim()) newErrors.ort = 'Ort ist erforderlich';
        if (!formData.postleitzahl.trim()) newErrors.postleitzahl = 'Postleitzahl ist erforderlich';
        if (!formData.land.trim()) newErrors.land = 'Land ist erforderlich';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            console.log('Restaurant erstellen:', formData);
            // Hier würde die API-Anfrage stattfinden
            // 1. Adresse erstellen und adresseID erhalten
            // 2. Restaurant mit adresseID erstellen
            alert('Restaurant erfolgreich erstellt!');
            navigate('/restaurants');
        } else {
            alert('Bitte fülle alle erforderlichen Felder korrekt aus.');
        }
    };

    return (
        <Container>
            <BackButton onClick={() => navigate('/restaurants')}>
                ← Zurück zur Übersicht
            </BackButton>

            <FormCard>
                <PageTitle> Neues Restaurant hinzufügen</PageTitle>

                <form onSubmit={handleSubmit}>
                    <FormSection>
                        <SectionTitle> Restaurant-Informationen</SectionTitle>
                        
                        <FormGroup>
                            <Label>
                                Restaurant Name<RequiredStar>*</RequiredStar>
                            </Label>
                            <Input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="z.B. Bella Italia"
                            />
                            {errors.name && <ErrorText>{errors.name}</ErrorText>}
                        </FormGroup>

                        <FormGroup>
                            <Label>
                                Klassifizierung / Küchenstil<RequiredStar>*</RequiredStar>
                            </Label>
                            <Select
                                name="klassifizierung"
                                value={formData.klassifizierung}
                                onChange={handleChange}
                            >
                                <option value="">Bitte wählen...</option>
                                <option value="Italienisch">Italienisch</option>
                                <option value="Japanisch">Japanisch</option>
                                <option value="Französisch">Französisch</option>
                                <option value="Amerikanisch">Amerikanisch</option>
                                <option value="Deutsch">Deutsch</option>
                                <option value="Chinesisch">Chinesisch</option>
                                <option value="Indisch">Indisch</option>
                                <option value="Thai">Thai</option>
                                <option value="Mexikanisch">Mexikanisch</option>
                                <option value="Spanisch">Spanisch</option>
                                <option value="Griechisch">Griechisch</option>
                            </Select>
                            {errors.klassifizierung && <ErrorText>{errors.klassifizierung}</ErrorText>}
                        </FormGroup>

                        <FormGroup>
                            <Label>
                                Telefon<RequiredStar>*</RequiredStar>
                            </Label>
                            <Input
                                type="tel"
                                name="telefon"
                                value={formData.telefon}
                                onChange={handleChange}
                                placeholder="+49 30 12345678"
                            />
                            {errors.telefon && <ErrorText>{errors.telefon}</ErrorText>}
                        </FormGroup>

                        <FormGroup>
                            <Label>Küchenchef</Label>
                            <Input
                                type="text"
                                name="kuechenchef"
                                value={formData.kuechenchef}
                                onChange={handleChange}
                                placeholder="z.B. Giovanni Rossi"
                            />
                        </FormGroup>
                    </FormSection>

                    <FormSection>
                        <SectionTitle>📍 Adresse</SectionTitle>
                        
                        <FormRow>
                            <FormGroup>
                                <Label>
                                    Straße<RequiredStar>*</RequiredStar>
                                </Label>
                                <Input
                                    type="text"
                                    name="strasse"
                                    value={formData.strasse}
                                    onChange={handleChange}
                                    placeholder="z.B. Hauptstraße"
                                />
                                {errors.strasse && <ErrorText>{errors.strasse}</ErrorText>}
                            </FormGroup>

                            <FormGroup>
                                <Label>
                                    Hausnummer<RequiredStar>*</RequiredStar>
                                </Label>
                                <Input
                                    type="text"
                                    name="hausnummer"
                                    value={formData.hausnummer}
                                    onChange={handleChange}
                                    placeholder="z.B. 15"
                                />
                                {errors.hausnummer && <ErrorText>{errors.hausnummer}</ErrorText>}
                            </FormGroup>
                        </FormRow>

                        <FormRowEqual>
                            <FormGroup>
                                <Label>
                                    Postleitzahl<RequiredStar>*</RequiredStar>
                                </Label>
                                <Input
                                    type="text"
                                    name="postleitzahl"
                                    value={formData.postleitzahl}
                                    onChange={handleChange}
                                    placeholder="z.B. 10115"
                                />
                                {errors.postleitzahl && <ErrorText>{errors.postleitzahl}</ErrorText>}
                            </FormGroup>

                            <FormGroup>
                                <Label>
                                    Ort<RequiredStar>*</RequiredStar>
                                </Label>
                                <Input
                                    type="text"
                                    name="ort"
                                    value={formData.ort}
                                    onChange={handleChange}
                                    placeholder="z.B. Berlin"
                                />
                                {errors.ort && <ErrorText>{errors.ort}</ErrorText>}
                            </FormGroup>
                        </FormRowEqual>

                        <FormGroup>
                            <Label>
                                Land<RequiredStar>*</RequiredStar>
                            </Label>
                            <Input
                                type="text"
                                name="land"
                                value={formData.land}
                                onChange={handleChange}
                                placeholder="z.B. Deutschland"
                            />
                            {errors.land && <ErrorText>{errors.land}</ErrorText>}
                        </FormGroup>
                    </FormSection>

                    <ButtonGroup>
                        <CancelButton type="button" onClick={() => navigate('/restaurants')}>
                            Abbrechen
                        </CancelButton>
                        <SubmitButton type="submit">
                            ✓ Restaurant erstellen
                        </SubmitButton>
                    </ButtonGroup>
                </form>
            </FormCard>
        </Container>
    );
}

export default NeuesRestaurant;