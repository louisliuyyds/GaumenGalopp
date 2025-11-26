import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import colors from '../theme/colors';

const Container = styled.div`
    max-width: 1400px;
    margin: 0 auto;
`;

const PageTitle = styled.h1`
    color: ${colors.text.primary};
    font-size: 2.5em;
    margin-bottom: 30px;
    font-weight: 700;
`;

const StatsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 25px;
    margin-bottom: 40px;
`;

const StatCard = styled.div`
    background: ${colors.gradients.card};
    border-radius: 16px;
    padding: 30px;
    box-shadow: ${colors.shadows.medium};
    border: 2px solid ${colors.border.light};
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
        transform: translateY(-5px);
        box-shadow: ${colors.shadows.large};
        border-color: ${colors.accent.orange};
    }
`;

const StatIcon = styled.div`
    font-size: 3em;
    margin-bottom: 15px;
`;

const StatValue = styled.div`
    font-size: 2.5em;
    font-weight: 700;
    color: ${colors.text.primary};
    margin-bottom: 10px;
`;

const StatLabel = styled.div`
    font-size: 1.1em;
    color: ${colors.text.secondary};
    font-weight: 500;
`;

const QuickActionsSection = styled.div`
    background: ${colors.background.card};
    border-radius: 16px;
    padding: 40px;
    box-shadow: ${colors.shadows.medium};
    margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
    color: ${colors.text.primary};
    font-size: 1.8em;
    margin-bottom: 25px;
    padding-bottom: 15px;
    border-bottom: 3px solid ${colors.accent.orange};
    display: inline-block;
`;

const ActionsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
`;

const ActionButton = styled.button`
    background: ${colors.gradients.primary};
    color: ${colors.text.white};
    border: none;
    padding: 25px;
    border-radius: 12px;
    cursor: pointer;
    font-size: 1.1em;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: ${colors.shadows.primarySmall};
    display: flex;
    align-items: center;
    gap: 12px;
    text-align: left;

    &:hover {
        transform: translateY(-3px);
        box-shadow: ${colors.shadows.primaryMedium};
    }
`;

const RecentActivitySection = styled.div`
    background: ${colors.background.card};
    border-radius: 16px;
    padding: 40px;
    box-shadow: ${colors.shadows.medium};
`;

const ActivityItem = styled.div`
    padding: 20px;
    border-bottom: 1px solid ${colors.border.light};
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.2s ease;

    &:last-child {
        border-bottom: none;
    }

    &:hover {
        background: ${colors.background.light};
        border-radius: 8px;
    }
`;

const ActivityText = styled.div`
    color: ${colors.text.secondary};
    font-size: 1em;
`;

const ActivityTime = styled.div`
    color: ${colors.text.muted};
    font-size: 0.9em;
`;

function Home() {
    const navigate = useNavigate();

    const stats = [
        { icon: '🏪', value: '24', label: 'Restaurants', onClick: () => navigate('/restaurants') },
        { icon: '🍽️', value: '156', label: 'Gerichte', onClick: () => navigate('/restaurants') },
        { icon: '📦', value: '89', label: 'Bestellungen heute', onClick: () => {} },
        { icon: '👥', value: '1,247', label: 'Aktive Kunden', onClick: () => {} },
    ];

    const quickActions = [
        { icon: '➕', label: 'Neues Restaurant', onClick: () => navigate('/neuesRestaurant') },
        { icon: '🍕', label: 'Neues Gericht', onClick: () => navigate('/restaurants') },
        { icon: '📊', label: 'Berichte ansehen', onClick: () => {} },
        { icon: '⚙️', label: 'Einstellungen', onClick: () => {} },
    ];

    const recentActivities = [
        { text: 'Neues Restaurant "Sushi Paradise" hinzugefügt', time: 'vor 2 Stunden' },
        { text: 'Gericht "Pizza Quattro Stagioni" aktualisiert', time: 'vor 3 Stunden' },
        { text: 'Bestellung #1523 abgeschlossen', time: 'vor 4 Stunden' },
        { text: 'Neue Bewertung für "Bella Italia" (5 Sterne)', time: 'vor 5 Stunden' },
        { text: 'Restaurant "Le Bistro" Öffnungszeiten geändert', time: 'vor 1 Tag' },
    ];

    return (
        <Container>
            <PageTitle> Dashboard</PageTitle>

            <StatsGrid>
                {stats.map((stat, index) => (
                    <StatCard key={index} onClick={stat.onClick}>
                        <StatIcon>{stat.icon}</StatIcon>
                        <StatValue>{stat.value}</StatValue>
                        <StatLabel>{stat.label}</StatLabel>
                    </StatCard>
                ))}
            </StatsGrid>

            <QuickActionsSection>
                <SectionTitle> Schnellaktionen</SectionTitle>
                <ActionsGrid>
                    {quickActions.map((action, index) => (
                        <ActionButton key={index} onClick={action.onClick}>
                            <span style={{ fontSize: '1.5em' }}>{action.icon}</span>
                            {action.label}
                        </ActionButton>
                    ))}
                </ActionsGrid>
            </QuickActionsSection>

            <RecentActivitySection>
                <SectionTitle> Letzte Aktivitäten</SectionTitle>
                {recentActivities.map((activity, index) => (
                    <ActivityItem key={index}>
                        <ActivityText>{activity.text}</ActivityText>
                        <ActivityTime>{activity.time}</ActivityTime>
                    </ActivityItem>
                ))}
            </RecentActivitySection>
        </Container>
    );
}

export default Home;