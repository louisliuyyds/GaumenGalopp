import React from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Beispiel from "./pages/Beispiel";
import NeuesRestaurant from "./pages/NeuesRestaurant";
import RestaurantDetail from "./pages/RestaurantDetail";
import GerichtDetail from "./pages/GerichtDetail";
import EditRestaurantInfos from "./pages/EditRestaurantInfos";
import Restaurants from "./pages/Restaurant";
import colors from './theme/colors';

const AppContainer = styled.div`
    display: flex;
    flex-direction: row;
    height: 100vh;
    background-color: ${colors.background.main};
`;

const ContentArea = styled.div`
    margin-left: 220px;
    padding: 40px;
    width: 100%;
    overflow-y: auto;
`;

function App() {
    return (
        <Router>
            <AppContainer>
                <Sidebar />
                <ContentArea>
                    <Routes>
                        {/* Verwaltungsansicht Routen */}
                        <Route path="/" element={<Home />} />
                        <Route path="/beispiel" element={<Beispiel />} />
                        <Route path="/neuesRestaurant" element={<NeuesRestaurant />} />
                        <Route path="/restaurants" element={<Restaurants />} />
                        <Route path="/restaurants/:id" element={<RestaurantDetail />} />
                        <Route path="/restaurants/:id/edit" element={<EditRestaurantInfos />} />
                        <Route path="/restaurants/:restaurantId/gericht/:gerichtId" element={<GerichtDetail />} />
                        
                        {/* Kundenansicht Routen (Platzhalter für zukünftige Entwicklung) */}
                        <Route path="/kunde" element={<Home />} />
                        <Route path="/kunde/restaurants" element={<Restaurants />} />
                        <Route path="/kunde/bestellungen" element={<Home />} />
                        <Route path="/kunde/favoriten" element={<Home />} />
                        <Route path="/kunde/profil" element={<Home />} />
                    </Routes>
                </ContentArea>
            </AppContainer>
        </Router>
    );
}

export default App;