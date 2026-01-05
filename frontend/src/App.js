import React from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Dashboard';
import Dashboard from './pages/Dashboard';
import Beispiel from "./pages/Beispiel";
import NeuesRestaurant from "./pages/NeuesRestaurant";
import RestaurantDetail from "./pages/RestaurantDetail";
import GerichtDetail from "./pages/GerichtDetail";
import EditRestaurantInfos from "./pages/EditRestaurantInfos";
import colors from './theme/colors';
import Restaurants from "./pages/Restaurant";
import Bestellung from "./pages/Bestellung";
import KundeHome from './pages/Kundehome';

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
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Öffentliche Routes - Login & Register */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Geschützte Routes mit Sidebar */}
                    <Route
                        path="/*"
                        element={
                            <ProtectedRoute>
                                <AppContainer>
                                    <Sidebar />
                                    <ContentArea>
                                        <Routes>
                                            {/* Dashboard */}
                                            <Route path="/" element={<Dashboard />} />

                                            {/* Beispiel-Route */}
                                            <Route path="/beispiel" element={<Beispiel />} />

                                            {/* Restaurant Admin Routes - nur für Restaurants */}
                                            <Route
                                                path="/neuesRestaurant"
                                                element={
                                                    <ProtectedRoute requiredType="restaurant">
                                                        <NeuesRestaurant />
                                                    </ProtectedRoute>
                                                }
                                            />

                                            {/* Restaurant Routes - für alle */}
                                            <Route path="/restaurants" element={<Restaurants />} />
                                            <Route path="/restaurants/:id" element={<RestaurantDetail />} />
                                            <Route path="/restaurants/:restaurantId/gericht/:gerichtId" element={<GerichtDetail />} />

                                            {/* Edit Routes - nur für Restaurants */}
                                            <Route
                                                path="/restaurants/:id/edit"
                                                element={
                                                    <ProtectedRoute requiredType="restaurant">
                                                        <EditRestaurantInfos />
                                                    </ProtectedRoute>
                                                }
                                            />

                                            {/* Kunden Routes - nur für Kunden */}
                                            <Route
                                                path="/kunde"
                                                element={
                                                    <ProtectedRoute requiredType="kunde">
                                                        <KundeHome />
                                                    </ProtectedRoute>
                                                }
                                            />
                                            <Route
                                                path="/kunde/restaurants"
                                                element={
                                                    <ProtectedRoute requiredType="kunde">
                                                        <Restaurants />
                                                    </ProtectedRoute>
                                                }
                                            />
                                            <Route
                                                path="/kunde/bestellungen"
                                                element={
                                                    <ProtectedRoute requiredType="kunde">
                                                        <Bestellung />
                                                    </ProtectedRoute>
                                                }
                                            />

                                            {/* Fallback - redirect to home */}
                                            <Route path="*" element={<Navigate to="/" replace />} />
                                        </Routes>
                                    </ContentArea>
                                </AppContainer>
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;