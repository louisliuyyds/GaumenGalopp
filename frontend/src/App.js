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
import colors from './theme/colors';
import Restaurants from "./pages/Restaurant";

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
                        <Route path="/" element={<Restaurants />} />
                        <Route path="/beispiel" element={<Beispiel />} />
                        <Route path="/neuesRestaurant" element={<NeuesRestaurant />} />
                        <Route path="/restaurants" element={<Restaurants />} />
                        <Route path="/restaurants/:restaurantId/gericht/:gerichtId" element={<GerichtDetail />} />
                        <Route path="/restaurants/:id" element={<RestaurantDetail />} />
                        <Route path="/restaurants/:id/edit" element={<EditRestaurantInfos />} />
                    </Routes>
                </ContentArea>
            </AppContainer>
        </Router>
    );
}

export default App;