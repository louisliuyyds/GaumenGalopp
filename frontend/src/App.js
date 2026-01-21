import React from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Restaurants from "./pages/Restaurant";
import RestaurantDetail from "./pages/RestaurantDetail";
import GerichtDetail from "./pages/GerichtDetail";
import EditRestaurantInfos from "./pages/EditRestaurantInfos";
import EditOpeningHours from "./pages/EditOpeningHours";
import EditMenu from "./pages/EditMenu";
import KundeHome from './pages/KundeHome';
import Warenkorb from "./pages/Warenkorb";
import KundeProfil from './pages/KundeProfil';
import RestaurantProfil from './pages/RestaurantProfil';
import Bestellhistorie from "./pages/Bestellhistorie";
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
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Öffentliche Routes */}
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
                                            <Route
                                                path="/restaurants/:id/edit/opening"
                                                element={
                                                    <ProtectedRoute requiredType="restaurant">
                                                        <EditOpeningHours />
                                                    </ProtectedRoute>
                                                }
                                            />
                                            <Route
                                                path="/restaurants/:id/edit/menu"
                                                element={
                                                    <ProtectedRoute requiredType="restaurant">
                                                        <EditMenu />
                                                    </ProtectedRoute>
                                                }
                                            />

                                            {/* Restaurant Profil Route */}
                                            <Route
                                                path="/restaurants/profil"
                                                element={
                                                    <ProtectedRoute requiredType="restaurant">
                                                        <RestaurantProfil />
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
                                                path="/kunde/warenkorb"
                                                element={
                                                    <ProtectedRoute requiredType="kunde">
                                                        <Warenkorb />
                                                    </ProtectedRoute>
                                                }
                                            />
                                            <Route
                                                path="/kunde/profil"
                                                element={
                                                    <ProtectedRoute requiredType="kunde">
                                                        <KundeProfil />
                                                    </ProtectedRoute>
                                                }
                                            />
                                            <Route
                                                path="/kunde/bestellhistorie"
                                                element={
                                                    <ProtectedRoute requiredType="kunde">
                                                        <Bestellhistorie />
                                                    </ProtectedRoute>
                                                }
                                            />

                                            {/* Bestellhistorie auch für Restaurants */}
                                            <Route
                                                path="/bestellhistorie"
                                                element={<Bestellhistorie />}
                                            />

                                            {/* Fallback */}
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