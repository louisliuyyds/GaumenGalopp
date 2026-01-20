import React, { useState } from 'react';
import styled from 'styled-components';
import colors from '../theme/colors';
import { bewertungService } from '../services';
import { useAuth } from '../context/AuthContext';

const FormContainer = styled.div`
    background: ${colors.background.card};
    border-radius: 16px;
    padding: 30px;
    margin-top: 30px;
    box-shadow: ${colors.shadows.medium};
    border: 2px solid ${colors.border.light};
`;

const FormTitle = styled.h3`
    color: ${colors.text.primary};
    font-size: 1.6em;
    margin-bottom: 25px;
    font-weight: 700;
`;

const StarRatingContainer = styled.div`
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    align-items: center;
`;

const StarButton = styled.button`
    background: none;
    border: none;
    font-size: 2.5em;
    cursor: pointer;
    transition: transform 0.2s ease;
    color: ${props => props.$filled ? colors.accent.orange : colors.border.medium};

    &:hover {
        transform: scale(1.2);
    }
`;

const TextArea = styled.textarea`
    width: 100%;
    padding: 15px;
    border: 2px solid ${colors.border.light};
    border-radius: 12px;
    font-size: 1em;
    font-family: inherit;
    resize: vertical;
    min-height: 120px;
    transition: all 0.3s ease;

    &:focus {
        outline: none;
        border-color: ${colors.accent.orange};
        box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.1);
    }

    &::placeholder {
        color: ${colors.text.light};
    }
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 15px;
    margin-top: 20px;
`;

const SubmitButton = styled.button`
    background: ${colors.gradients.accent};
    color: white;
    border: none;
    padding: 14px 32px;
    border-radius: 12px;
    font-size: 1.05em;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: ${colors.shadows.small};

    &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: ${colors.shadows.medium};
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const CancelButton = styled.button`
    background: white;
    color: ${colors.text.primary};
    border: 2px solid ${colors.border.light};
    padding: 14px 32px;
    border-radius: 12px;
    font-size: 1.05em;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        background: ${colors.background.main};
        border-color: ${colors.border.medium};
    }
`;

const SuccessMessage = styled.div`
    background: ${colors.status.successLight};
    color: ${colors.status.success};
    padding: 15px;
    border-radius: 8px;
    margin-top: 15px;
    font-weight: 600;
`;

const ErrorMessage = styled.div`
    background: ${colors.status.errorLight};
    color: ${colors.status.error};
    padding: 15px;
    border-radius: 8px;
    margin-top: 15px;
    font-weight: 600;
`;

const LoginPrompt = styled.div`
    background: ${colors.status.infoLight};
    color: ${colors.status.info};
    padding: 20px;
    border-radius: 12px;
    text-align: center;
    font-size: 1.05em;
`;

function BewertungForm({ gerichtId, onBewertungSubmitted }) {
    const { user } = useAuth();
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [kommentar, setKommentar] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    // Prüfe ob User ein Kritiker ist
    const isKritiker = user?.role === 'kritiker';

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (rating === 0) {
            setError('Bitte wähle eine Bewertung aus.');
            return;
        }

        if (!kommentar.trim()) {
            setError('Bitte schreibe einen Kommentar.');
            return;
        }

        try {
            setSubmitting(true);
            setError(null);

            // Normale Kundenbewertung (auch für Kritiker als Kunde)
            await bewertungService.create({
                kundenid: user.user_id,
                gerichtid: parseInt(gerichtId),
                rating: rating,
                kommentar: kommentar.trim(),
                erstelltam: new Date().toISOString()
            });

            setSuccess(true);
            setRating(0);
            setKommentar('');

            // Auto-Reload: Callback aufrufen
            if (onBewertungSubmitted) {
                setTimeout(() => {
                    onBewertungSubmitted();
                }, 1000);
            }

        } catch (err) {
            console.error('Fehler beim Erstellen der Bewertung:', err);
            setError('Fehler beim Speichern der Bewertung. Bitte versuche es erneut.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        setRating(0);
        setKommentar('');
        setError(null);
        setSuccess(false);
    };

    // Nicht eingeloggt oder kein Kunde
    if (!user || user.user_type !== 'kunde') {
        return (
            <FormContainer>
                <LoginPrompt>
                    Du musst als Kunde eingeloggt sein, um eine Bewertung abzugeben.
                </LoginPrompt>
            </FormContainer>
        );
    }

    return (
        <FormContainer>
            <FormTitle>
                ✍️ Bewertung abgeben
                {isKritiker && (
                    <span style={{
                        fontSize: '0.8em',
                        color: colors.text.light,
                        marginLeft: '10px',
                        fontWeight: '400'
                    }}>
                        (als Kunde)
                    </span>
                )}
            </FormTitle>

            {isKritiker && (
                <div style={{
                    background: colors.status.infoLight,
                    padding: '12px 16px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    fontSize: '0.95em',
                    color: colors.text.secondary
                }}>
                    💡 Als Kritiker gibst du hier eine <strong>Kundenbewertung</strong> mit Kommentar ab.
                    Kritikerbewertungen (nur Rating, kein Kommentar) werden separat verwaltet.
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <StarRatingContainer>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <StarButton
                            key={star}
                            type="button"
                            $filled={star <= (hoverRating || rating)}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                        >
                            ⭐
                        </StarButton>
                    ))}
                    {rating > 0 && (
                        <span style={{ marginLeft: '10px', color: colors.text.secondary, fontWeight: '600' }}>
                            {rating} von 5 Sternen
                        </span>
                    )}
                </StarRatingContainer>

                <TextArea
                    placeholder="Teile deine Erfahrung mit diesem Gericht..."
                    value={kommentar}
                    onChange={(e) => setKommentar(e.target.value)}
                    disabled={submitting}
                />

                <ButtonGroup>
                    <SubmitButton type="submit" disabled={submitting || rating === 0}>
                        {submitting ? 'Wird gespeichert...' : 'Bewertung absenden'}
                    </SubmitButton>
                    <CancelButton type="button" onClick={handleCancel} disabled={submitting}>
                        Zurücksetzen
                    </CancelButton>
                </ButtonGroup>

                {success && (
                    <SuccessMessage>
                        Bewertung erfolgreich gespeichert! Die Seite wird aktualisiert...
                    </SuccessMessage>
                )}

                {error && (
                    <ErrorMessage>
                        {error}
                    </ErrorMessage>
                )}
            </form>
        </FormContainer>
    );
}

export default BewertungForm;