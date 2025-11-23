import React from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Beispiel from "./pages/Beispiel";

const AppContainer = styled.div`
    display: flex;
    flex-direction: row;
    height: 100vh;
`;

const ContentArea = styled.div`
    margin-left: 220px; // Sidebar ist 200px breit + padding
    padding: 40px;
    width: 100%;
    background-color: #ecf0f1;
`;

function App() {
    return (
        <Router>
            <AppContainer>
                <Sidebar />
                <ContentArea>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/beispiel" element={<Beispiel />} />
                    </Routes>
                </ContentArea>
            </AppContainer>
        </Router>
    );
}

export default App;