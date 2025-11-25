import React from 'react';
import styled from 'styled-components';

const PageContainer = styled.div`
    max-width: 1200px;
`;

const Title = styled.h1`
    color: #2c3e50;
    font-size: 2.5em;
    margin-bottom: 20px;
    margin-top: 0px;
`;

const Description = styled.p`
    color: #7f8c8d;
    font-size: 1.2em;
    line-height: 1.6;
`;

const Subtitle = styled.h2`
    color: antiquewhite;
`


const Home = () => {
    return (
        <PageContainer>
            <Title>Hier kommt der HomeScreen rein</Title>
            <Subtitle>Das ist jetzt mein Untertitle</Subtitle>
            <Description>
                Auf der Seite landet man zuerst, wenn wir die Website starten lul
            </Description>
        </PageContainer>
    );
}

export default Home;