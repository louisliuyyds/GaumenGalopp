import React from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import colors from '../theme/colors';

const Container = styled.div`
    max-width: 900px;
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

const EditCard = styled.div`
    background: ${colors.background.card};
    border-radius: 12px;
    padding: 40px;
    box-shadow: ${colors.shadows.medium};
`;

const PageTitle = styled.h1`
    color: ${colors.text.primary};
    font-size: 2.5em;
    margin-bottom: 10px;
`;

const Subtitle = styled.p`
    color: ${colors.text.light};
    font-size: 1.1em;
    margin-bottom: 40px;
    padding-bottom: 20px;
    border-bottom: 2px solid ${colors.border.light};
`;

const ComingSoon = styled.div`
    text-align: center;
    padding: 60px 20px;
    color: ${colors.text.light};
    font-size: 1.2em;
    line-height: 1.8;
`;

function EditRestaurantInfos() {
    const { id } = useParams();
    const navigate = useNavigate();

    return (
        <Container>
            <BackButton onClick={() => navigate(`/restaurants`)}>
                ← Zurück zum Restaurant
            </BackButton>

            <EditCard>
                <PageTitle>✏️ Restaurant bearbeiten</PageTitle>
                <Subtitle>Hier kannst du alle Informationen des Restaurants anpassen</Subtitle>

                <ComingSoon>
                    🍽️ Restaurant-Bearbeitungsformular kommt hier hin...<br/>
                    <small style={{fontSize: '0.9em', color: colors.text.lighter}}>
                        (Restaurant ID: {id})
                    </small>
                </ComingSoon>


            </EditCard>
        </Container>
    );
}

export default EditRestaurantInfos;