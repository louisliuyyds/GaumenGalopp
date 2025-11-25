import React from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import colors from "../theme/colors";

const Container = styled.div`
    max-width: 900px;
    margin: 0 auto;
`;

const BackButton = styled.button`
    background: ${colors.gradients.primary};
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    cursor: pointer;
    margin-bottom: 30px;
    font-size: 1em;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 4px 10px rgba(26, 58, 46, 0.2);

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 15px rgba(26, 58, 46, 0.3);
    }
`;

const DetailCard = styled.div`
    background: white;
    border-radius: 12px;
    padding: 40px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
`;

const GerichtName = styled.h1`
    color: #1a3a2e;
    font-size: 2.5em;
    margin-bottom: 20px;
`;

const ComingSoon = styled.div`
    text-align: center;
    padding: 60px 20px;
    color: #666;
    font-size: 1.2em;
`;

function GerichtDetail() {
    const { restaurantId, gerichtId } = useParams();
    const navigate = useNavigate();

    return (
        <Container>
            <BackButton onClick={() => navigate(`/restaurants/${restaurantId}`)}>
                ← Zurück zum Restaurant
            </BackButton>

            <DetailCard>
                <GerichtName>Gericht Details</GerichtName>
                <ComingSoon>
                    🍽️ Gericht-Bearbeitungsformular kommt hier hin...<br/>
                    <small>(Restaurant ID: {restaurantId}, Gericht ID: {gerichtId})</small>
                </ComingSoon>
            </DetailCard>
        </Container>
    );
}

export default GerichtDetail;